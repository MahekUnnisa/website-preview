import type { OnboardingFlowData } from '@/lib/onboarding-flow';
import type { OnboardingWorkToolCategory, WorkspaceProviderOption } from '@/types/onboarding';
import { defaultWorkToolCategories, mockWorkspaceProviders } from '@/lib/onboarding-flow';
import { resolveOnboardingToolIcon } from '@/lib/onboarding-tool-icon';

export type OnboardingV3WorkspaceOption = {
    id: 'slack' | 'msteams' | string;
    name?: string;
    icon?: string;
    selected?: boolean;
    connected?: boolean;
};

export type OnboardingV3Workspace = {
    connected?: boolean;
    selected?: 'slack' | 'msteams';
    options?: Array<OnboardingV3WorkspaceOption | 'slack' | 'msteams' | 'teams'>;
};

export type OnboardingV3ToolOption = {
    id: string;
    name?: string;
    label?: string;
    /** Theme asset key (e.g. LinearIcon). Not a URL. */
    icon?: string;
    badge?: string;
    selected?: boolean;
};

export type OnboardingV3ToolEntry = string | OnboardingV3ToolOption;

export type OnboardingV3ToolGroup = {
    selected_items?: string[];
    items?: OnboardingV3ToolEntry[];
    options?: OnboardingV3ToolEntry[];
};

export type OnboardingV3ToolBucket = OnboardingV3ToolEntry[] | OnboardingV3ToolGroup;

export type OnboardingV3ToolsAvailable = {
    work_tools?: OnboardingV3ToolBucket;
    code_tools?: OnboardingV3ToolBucket;
    work_tool_options?: OnboardingV3ToolEntry[];
    code_tool_options?: OnboardingV3ToolEntry[];
    selected?: {
        work_tools?: string[];
        code_tools?: string[];
    };
};

export const DEFAULT_PRESELECTED_TOOL_IDS = ['linear', 'github'] as const;

export type OnboardingV3Eod = {
    suggested_time?: string;
    user_time?: string;
    options?: string[];
};

export type OnboardingV3Payload = {
    workspace?: { selected: 'slack' | 'msteams' };
    tools_available?: { work_tools: string[]; code_tools: string[] };
    eod?: { user_time: string };
};

export type OnboardingV3Record = {
    workspace?: OnboardingV3Workspace;
    tools_available?: OnboardingV3ToolsAvailable;
    eod?: OnboardingV3Eod;
};

export type OnboardingRemoteConfig = {
    workspaceProviders: WorkspaceProviderOption[];
    toolCategories: OnboardingWorkToolCategory[];
    wrapUpTimeOptions: string[];
};

export type OnboardingV3MappedResponse = {
    flowData: Partial<OnboardingFlowData>;
    config: OnboardingRemoteConfig;
};

const DEFAULT_WRAP_UP_TIME_OPTIONS = ['5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'];

const defaultToolLookup = new Map(
    defaultWorkToolCategories.flatMap((category) => category.tools.map((tool) => [tool.id, tool] as const))
);

const defaultWorkToolIds = new Set(defaultWorkToolCategories[0]?.tools.map((tool) => tool.id) ?? []);
const defaultCodeToolIds = new Set(defaultWorkToolCategories[1]?.tools.map((tool) => tool.id) ?? []);

export function displayWrapUpTimeToApi(time: string): string {
    const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) {
        return '18:00';
    }

    let hours = Number.parseInt(match[1], 10);
    const minutes = match[2];
    const meridiem = match[3].toUpperCase();

    if (meridiem === 'PM' && hours !== 12) {
        hours += 12;
    }
    if (meridiem === 'AM' && hours === 12) {
        hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`;
}

export function apiWrapUpTimeToDisplay(time: string): string {
    const [hourPart, minutePart = '00'] = time.split(':');
    const hours24 = Number.parseInt(hourPart, 10);
    if (Number.isNaN(hours24)) {
        return time;
    }

    const meridiem = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutePart.padStart(2, '0')} ${meridiem}`;
}

export function buildWrapUpQuestion(time: string): string {
    return `You usually wrap up around ${time}. Is that right?`;
}

export function buildWrapUpTimeSelectionQuestion(): string {
    return 'When do you usually wrap up?';
}

function isToolObject(entry: OnboardingV3ToolEntry): entry is OnboardingV3ToolOption {
    return typeof entry === 'object' && entry !== null && typeof entry.id === 'string';
}

function resolveToolDisplayName(tool: Pick<OnboardingV3ToolOption, 'id' | 'name' | 'label'>): string {
    const fallback = defaultToolLookup.get(tool.id);
    return tool.name ?? tool.label ?? fallback?.label ?? '';
}

function normalizeToolEntry(entry: OnboardingV3ToolEntry): OnboardingV3ToolOption {
    if (isToolObject(entry)) {
        return entry;
    }

    const fallback = defaultToolLookup.get(entry);
    return {
        id: entry,
        name: fallback?.label,
        badge: fallback?.badge
    };
}

function mapToolToWorkItem(tool: OnboardingV3ToolOption) {
    const fallback = defaultToolLookup.get(tool.id);
    const resolved = resolveOnboardingToolIcon({
        id: tool.id,
        icon: tool.icon,
        fallbackIconKey: fallback?.iconKey,
        fallbackIconUrl: fallback?.iconUrl
    });

    return {
        id: tool.id,
        label: resolveToolDisplayName(tool),
        iconKey: resolved.iconKey,
        iconUrl: resolved.iconUrl,
        badge: tool.badge ?? fallback?.badge
    };
}

function buildToolCategory(
    label: string,
    icon: OnboardingWorkToolCategory['icon'],
    entries: OnboardingV3ToolEntry[] | undefined
): OnboardingWorkToolCategory | null {
    if (!entries?.length) {
        return null;
    }

    const tools = entries.map(normalizeToolEntry).map(mapToolToWorkItem);

    return { label, icon, tools };
}

function catalogEntriesHaveMetadata(entries: OnboardingV3ToolEntry[]): boolean {
    return entries.some(
        (entry) =>
            isToolObject(entry) && (Boolean(entry.name) || Boolean(entry.label) || Boolean(entry.icon))
    );
}

function isToolGroup(value: OnboardingV3ToolBucket | undefined): value is OnboardingV3ToolGroup {
    return Boolean(value) && !Array.isArray(value) && typeof value === 'object';
}

function parseToolBucket(value: OnboardingV3ToolBucket | undefined): {
    catalog?: OnboardingV3ToolEntry[];
    selectedItems: string[];
} {
    if (!value) {
        return { selectedItems: [] };
    }

    if (isToolGroup(value)) {
        return {
            catalog: value.items ?? value.options,
            selectedItems: (value.selected_items ?? []).filter(Boolean)
        };
    }

    if (catalogEntriesHaveMetadata(value)) {
        return {
            catalog: value,
            selectedItems: value.filter(isToolObject).filter((tool) => tool.selected).map((tool) => tool.id)
        };
    }

    return {
        catalog: value,
        selectedItems: []
    };
}

function resolveCatalogEntries(
    options: OnboardingV3ToolEntry[] | undefined,
    bucket: OnboardingV3ToolBucket | undefined
): OnboardingV3ToolEntry[] | undefined {
    if (options?.length) {
        return options;
    }

    const parsed = parseToolBucket(bucket);
    if (parsed.catalog?.length) {
        return parsed.catalog;
    }

    return undefined;
}

export function buildDefaultRemoteConfig(): OnboardingRemoteConfig {
    return {
        // ponytail: Slack-only until v3 responds — keys UI needs a label before auth
        workspaceProviders: [mockWorkspaceProviders[0]],
        toolCategories: defaultWorkToolCategories.map((category) => ({
            ...category,
            tools: category.tools.map((tool) => ({ ...tool }))
        })),
        wrapUpTimeOptions: [...DEFAULT_WRAP_UP_TIME_OPTIONS]
    };
}

function normalizeWorkspaceProviderId(id: string | undefined): 'slack' | 'msteams' | null {
    if (id === 'slack') {
        return 'slack';
    }
    if (id === 'msteams' || id === 'teams') {
        return 'msteams';
    }
    return null;
}

function resolveWorkspaceFromApi(workspace: OnboardingV3Workspace | undefined): 'slack' | 'msteams' | undefined {
    const selectedOption = workspace?.options?.find(
        (option) => typeof option === 'object' && option.selected === true
    );
    if (selectedOption && typeof selectedOption === 'object') {
        const id = normalizeWorkspaceProviderId(selectedOption.id);
        if (id) {
            return id;
        }
    }

    return normalizeWorkspaceProviderId(workspace?.selected) ?? undefined;
}

function mapWorkspaceProviders(workspace: OnboardingV3Workspace | undefined): WorkspaceProviderOption[] {
    const defaults = buildDefaultRemoteConfig().workspaceProviders;
    const options = workspace?.options;

    if (!options?.length) {
        return [];
    }

    const mapped = options
        .map((option) => {
            if (typeof option === 'string') {
                const id = normalizeWorkspaceProviderId(option);
                if (!id) {
                    return null;
                }
                const fallback = defaults.find((provider) => provider.id === id);
                return {
                    provider: fallback ?? { id, label: id, icon: '' },
                    selected: false
                };
            }

            const id = normalizeWorkspaceProviderId(option.id);
            if (!id) {
                return null;
            }

            const fallback = defaults.find((provider) => provider.id === id);
            return {
                provider: {
                    id,
                    label: option.name ?? fallback?.label ?? id,
                    icon: option.icon || fallback?.icon || ''
                },
                selected: option.selected === true
            };
        })
        .filter(
            (entry): entry is { provider: WorkspaceProviderOption; selected: boolean } => entry !== null
        );

    if (!mapped.length) {
        return [];
    }

    mapped.sort((left, right) => Number(right.selected) - Number(left.selected));
    return mapped.map((entry) => entry.provider);
}

function mapToolCategories(tools: OnboardingV3ToolsAvailable | undefined): OnboardingWorkToolCategory[] {
    const workEntries = resolveCatalogEntries(tools?.work_tool_options, tools?.work_tools);
    const codeEntries = resolveCatalogEntries(tools?.code_tool_options, tools?.code_tools);

    const categories: OnboardingWorkToolCategory[] = [];

    const workCategory = buildToolCategory(
        defaultWorkToolCategories[0]?.label ?? 'Work tracking',
        defaultWorkToolCategories[0]?.icon ?? 'OnboardingChatsLight',
        workEntries
    );
    if (workCategory) {
        categories.push(workCategory);
    }

    const codeCategory = buildToolCategory(
        defaultWorkToolCategories[1]?.label ?? 'Code',
        defaultWorkToolCategories[1]?.icon ?? 'OnboardingCodeLight',
        codeEntries
    );
    if (codeCategory) {
        categories.push(codeCategory);
    }

    return categories.length ? categories : buildDefaultRemoteConfig().toolCategories;
}

function resolveSelectedToolIdsFromApi(tools: OnboardingV3ToolsAvailable | undefined): string[] {
    if (!tools) {
        return [];
    }

    const explicitSelected = [...(tools.selected?.work_tools ?? []), ...(tools.selected?.code_tools ?? [])].filter(
        Boolean
    );
    if (explicitSelected.length) {
        return explicitSelected;
    }

    const workBucket = parseToolBucket(tools.work_tools);
    const codeBucket = parseToolBucket(tools.code_tools);
    const hasWorkSelectedItems = isToolGroup(tools.work_tools) && 'selected_items' in tools.work_tools;
    const hasCodeSelectedItems = isToolGroup(tools.code_tools) && 'selected_items' in tools.code_tools;

    if (hasWorkSelectedItems || hasCodeSelectedItems) {
        return [
            ...(hasWorkSelectedItems ? workBucket.selectedItems : ['linear']),
            ...(hasCodeSelectedItems ? codeBucket.selectedItems : ['github'])
        ];
    }

    const workEntries = isToolGroup(tools.work_tools)
        ? (tools.work_tools.items ?? tools.work_tools.options ?? [])
        : (tools.work_tools ?? []);
    const codeEntries = isToolGroup(tools.code_tools)
        ? (tools.code_tools.items ?? tools.code_tools.options ?? [])
        : (tools.code_tools ?? []);

    const fromFlags = [...workEntries, ...codeEntries]
        .filter(isToolObject)
        .filter((tool) => tool.selected)
        .map((tool) => tool.id);
    if (fromFlags.length) {
        return fromFlags;
    }

    return [];
}

export function resolvePreselectedToolIds(apiSelected?: string[]): string[] {
    return apiSelected?.length ? apiSelected : [...DEFAULT_PRESELECTED_TOOL_IDS];
}

export function selectedToolsMapFromIds(toolIds: string[]): Record<string, boolean> {
    return Object.fromEntries(toolIds.map((id) => [id, true]));
}

function mapWrapUpTimeOptions(eod: OnboardingV3Eod | undefined): string[] {
    const options = eod?.options?.map(apiWrapUpTimeToDisplay).filter(Boolean);
    return options?.length ? options : buildDefaultRemoteConfig().wrapUpTimeOptions;
}

function resolveWrapUpTime(eod: OnboardingV3Eod | undefined): string | undefined {
    if (typeof eod?.user_time === 'string' && eod.user_time) {
        return apiWrapUpTimeToDisplay(eod.user_time);
    }
    if (typeof eod?.suggested_time === 'string' && eod.suggested_time) {
        return apiWrapUpTimeToDisplay(eod.suggested_time);
    }
    return undefined;
}

export function mapOnboardingV3Response(record: unknown): OnboardingV3MappedResponse {
    const defaults = buildDefaultRemoteConfig();

    if (!record || typeof record !== 'object') {
        return { flowData: { selectedTools: resolvePreselectedToolIds() }, config: defaults };
    }

    const data = record as OnboardingV3Record;
    const flowData: Partial<OnboardingFlowData> = {};

    const workspaceSelection = resolveWorkspaceFromApi(data.workspace);
    if (workspaceSelection) {
        flowData.workspace = workspaceSelection;
    }

    flowData.selectedTools = resolvePreselectedToolIds(resolveSelectedToolIdsFromApi(data.tools_available));

    const wrapUpTime = resolveWrapUpTime(data.eod);
    if (wrapUpTime) {
        flowData.wrapUpTime = wrapUpTime;
    }

    const mappedProviders = mapWorkspaceProviders(data.workspace);

    return {
        flowData,
        config: {
            workspaceProviders: mappedProviders.length ? mappedProviders : defaults.workspaceProviders,
            toolCategories: mapToolCategories(data.tools_available),
            wrapUpTimeOptions: mapWrapUpTimeOptions(data.eod)
        }
    };
}

/** @deprecated Use mapOnboardingV3Response */
export function mapOnboardingV3ResponseToFlowData(record: unknown): Partial<OnboardingFlowData> {
    return mapOnboardingV3Response(record).flowData;
}

export function mergeRemoteFlowData(
    local: OnboardingFlowData,
    remote: Partial<OnboardingFlowData>
): OnboardingFlowData {
    return {
        ...local,
        workspace: local.workspace ?? remote.workspace,
        wrapUpTime: local.wrapUpTime ?? remote.wrapUpTime,
        selectedTools: local.selectedTools?.length ? local.selectedTools : remote.selectedTools,
        selectedRole: local.selectedRole ?? remote.selectedRole,
        wrapUpFromTimePicker: local.wrapUpFromTimePicker ?? remote.wrapUpFromTimePicker,
        // Local OAuth outcomes win — never overwritten by remote config.
        keyAuth: local.keyAuth
    };
}

function collectKnownToolIds(categories: OnboardingWorkToolCategory[]): { work: Set<string>; code: Set<string> } {
    const work = new Set<string>();
    const code = new Set<string>();

    categories.forEach((category, index) => {
        const bucket = index === 0 ? work : code;
        category.tools.forEach((tool) => bucket.add(tool.id));
    });

    return { work, code };
}

export function splitSelectedToolIds(
    toolIds: string[],
    categories: OnboardingWorkToolCategory[] = defaultWorkToolCategories
): { work_tools: string[]; code_tools: string[] } {
    const { work, code } = collectKnownToolIds(categories);
    const workIds = work.size ? work : defaultWorkToolIds;
    const codeIds = code.size ? code : defaultCodeToolIds;

    const work_tools: string[] = [];
    const code_tools: string[] = [];

    toolIds.forEach((id) => {
        if (codeIds.has(id)) {
            code_tools.push(id);
            return;
        }
        if (workIds.has(id)) {
            work_tools.push(id);
        }
    });

    return { work_tools, code_tools };
}

export function selectedToolsMapToIds(selectedTools: Record<string, boolean>): string[] {
    return Object.entries(selectedTools)
        .filter(([, selected]) => selected)
        .map(([id]) => id);
}

export function buildOnboardingV3Payload(
    flowData: OnboardingFlowData,
    selectedTools?: Record<string, boolean>,
    categories: OnboardingWorkToolCategory[] = defaultWorkToolCategories
): OnboardingV3Payload {
    const payload: OnboardingV3Payload = {};

    if (flowData.workspace) {
        payload.workspace = { selected: flowData.workspace };
    }

    const toolIds = flowData.selectedTools?.length
        ? flowData.selectedTools
        : selectedTools
          ? selectedToolsMapToIds(selectedTools)
          : [];

    if (toolIds.length) {
        payload.tools_available = splitSelectedToolIds(toolIds, categories);
    }

    if (flowData.wrapUpTime) {
        payload.eod = { user_time: displayWrapUpTimeToApi(flowData.wrapUpTime) };
    }

    return payload;
}

export function hasOnboardingV3Payload(payload: OnboardingV3Payload): boolean {
    return Boolean(payload.workspace || payload.tools_available || payload.eod);
}

// ponytail: assert-based self-check — fails if API time mapping drifts
if (import.meta.env?.DEV) {
    const sample = mapOnboardingV3Response({
        workspace: {
            connected: true,
            options: [
                {
                    id: 'slack',
                    name: 'Slack',
                    icon: 'https://slack.test/icon.png',
                    selected: true,
                    connected: true
                },
                {
                    id: 'msteams',
                    name: 'Microsoft Teams',
                    icon: 'https://teams.test/icon.ico',
                    selected: false,
                    connected: false
                }
            ]
        },
        tools_available: {
            work_tools: { selected_items: ['notion'] },
            code_tools: { selected_items: ['github'] }
        },
        eod: {
            suggested_time: '19:30',
            user_time: '19:30',
            options: ['18:30', '19:00', '19:30']
        }
    });

    console.assert(sample.flowData.workspace === 'slack', 'workspace should come from selected option');
    console.assert(sample.config.workspaceProviders[0]?.id === 'slack', 'selected workspace should sort first');
    console.assert(sample.config.workspaceProviders[0]?.label === 'Slack', 'workspace label should use API name');
    console.assert(sample.flowData.wrapUpTime === '7:30 PM', 'wrapUpTime should map from API');
    console.assert(sample.config.wrapUpTimeOptions[2] === '7:30 PM', 'wrapUp options should map from API');
    console.assert(buildWrapUpQuestion('7:30 PM').includes('7:30 PM'), 'wrap-up question should use API time');
    console.assert(
        resolvePreselectedToolIds(['notion', 'github']).join(',') === 'notion,github',
        'API selected_items should be used as-is'
    );
    console.assert(
        mapOnboardingV3Response({
            tools_available: {
                work_tools: {
                    items: [{ id: 'linear', name: 'Linear', icon: 'LinearIcon' }]
                }
            }
        }).config.toolCategories[0]?.tools[0]?.label === 'Linear',
        'API tool name should be shown in UI'
    );
}
