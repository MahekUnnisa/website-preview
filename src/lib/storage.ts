type StorageArea = 'local' | 'sync' | 'session' | 'managed';
type WatchCallback = (newValue: unknown, oldValue: unknown) => void;
type WatchMap = Record<string, WatchCallback>;

type StorageFactoryOptions = {
    area?: StorageArea;
};

/** Match the extension default: `new Storage()` uses sync. Onboarding uses `{ area: 'local' }`. */
const DEFAULT_STORAGE_AREA: StorageArea = 'sync';

const SAME_TAB_EVENT = 'zeroai-storage-change';

type SameTabDetail = {
    prefixedKey: string;
    newValue: unknown;
    oldValue: unknown;
};

const toPrefixedKey = (area: StorageArea, key: string): string => `${area}:${key}`;

const deserializeStoredValue = <T>(value: unknown): T | undefined => {
    if (value == null) {
        return undefined;
    }

    if (typeof value === 'string') {
        try {
            return JSON.parse(value) as T;
        } catch {
            return value as T;
        }
    }

    return value as T;
};

const serializeStoredValue = <T>(value: T): string => JSON.stringify(value);

const readRaw = (prefixedKey: string): string | null => {
    if (typeof localStorage === 'undefined') {
        return null;
    }
    try {
        return localStorage.getItem(prefixedKey);
    } catch {
        return null;
    }
};

const writeRaw = (prefixedKey: string, serialized: string): void => {
    if (typeof localStorage === 'undefined') {
        return;
    }
    localStorage.setItem(prefixedKey, serialized);
};

const removeRaw = (prefixedKey: string): void => {
    if (typeof localStorage === 'undefined') {
        return;
    }
    localStorage.removeItem(prefixedKey);
};

const emitSameTabChange = (detail: SameTabDetail): void => {
    if (typeof window === 'undefined') {
        return;
    }
    window.dispatchEvent(new CustomEvent<SameTabDetail>(SAME_TAB_EVENT, { detail }));
};

/**
 * localStorage adapter with the extension Storage surface used by onboarding:
 * `get`, `set`, `remove`, `watch`.
 *
 * Keys are stored as `{area}:{key}` (e.g. `local:zero_onboarding_v2_state`).
 * `watch` covers other tabs via `storage` and the same tab via a custom event
 * (the browser does not fire `storage` in the tab that wrote).
 */
export class Storage {
    readonly area: StorageArea;

    private readonly unwatchers = new Set<() => void>();

    constructor(options: StorageFactoryOptions = {}) {
        this.area = options.area ?? DEFAULT_STORAGE_AREA;
    }

    async get<T>(key: string): Promise<T | undefined> {
        const parsed = deserializeStoredValue<T>(readRaw(toPrefixedKey(this.area, key)));
        return parsed == null ? undefined : parsed;
    }

    async set<T>(key: string, value: T): Promise<void> {
        const prefixedKey = toPrefixedKey(this.area, key);
        const oldValue = deserializeStoredValue(readRaw(prefixedKey));
        writeRaw(prefixedKey, serializeStoredValue(value));
        emitSameTabChange({ prefixedKey, newValue: value, oldValue });
    }

    async remove(key: string): Promise<void> {
        const prefixedKey = toPrefixedKey(this.area, key);
        const oldValue = deserializeStoredValue(readRaw(prefixedKey));
        removeRaw(prefixedKey);
        emitSameTabChange({ prefixedKey, newValue: undefined, oldValue });
    }

    watch(map: WatchMap): () => void {
        const currentUnwatchers: Array<() => void> = [];

        Object.entries(map).forEach(([key, callback]) => {
            const prefixedKey = toPrefixedKey(this.area, key);

            const onSameTab = (event: Event) => {
                const detail = (event as CustomEvent<SameTabDetail>).detail;
                if (!detail || detail.prefixedKey !== prefixedKey) {
                    return;
                }
                callback(detail.newValue, detail.oldValue);
            };

            const onCrossTab = (event: StorageEvent) => {
                if (event.key !== prefixedKey) {
                    return;
                }
                callback(
                    deserializeStoredValue(event.newValue) ?? undefined,
                    deserializeStoredValue(event.oldValue) ?? undefined
                );
            };

            if (typeof window !== 'undefined') {
                window.addEventListener(SAME_TAB_EVENT, onSameTab);
                window.addEventListener('storage', onCrossTab);
            }

            const cleanup = () => {
                if (typeof window === 'undefined') {
                    return;
                }
                window.removeEventListener(SAME_TAB_EVENT, onSameTab);
                window.removeEventListener('storage', onCrossTab);
            };

            this.unwatchers.add(cleanup);
            currentUnwatchers.push(cleanup);
        });

        return () => {
            currentUnwatchers.forEach((unwatch) => {
                this.unwatchers.delete(unwatch);
                unwatch();
            });
        };
    }

    unwatch(): void {
        this.unwatchers.forEach((unwatch) => {
            unwatch();
        });
        this.unwatchers.clear();
    }
}
