import React from 'react';
import { cn } from '@/lib/utils';

export type WorkspaceProvider = 'slack' | 'msteams';

export type WorkspaceProviderOption = {
    id: WorkspaceProvider;
    label: string;
    /** Provider icon URL from API (same shape as IntegrationApp.icon). */
    icon: string;
};

export interface OnboardingWorkspacePickerProps {
    value: WorkspaceProvider;
    onChange: (provider: WorkspaceProvider) => void;
    providers: WorkspaceProviderOption[];
    className?: string;
}

export const OnboardingWorkspacePicker: React.FC<OnboardingWorkspacePickerProps> = ({
    value,
    onChange,
    providers,
    className
}) => (
    <div
        className={cn(
            'inline-flex w-fit items-center gap-1 rounded-[21px] border border-border p-[5px]',
            className
        )}
        role="tablist"
        aria-label="Workspace provider"
    >
        {providers.map((provider) => {
            const isActive = value === provider.id;

            return (
                <button
                    key={provider.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => onChange(provider.id)}
                    className={cn(
                        'flex h-8 items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-medium leading-[1.45] text-foreground-primary font-instrumentSans transition-colors',
                        isActive ? 'rounded-2xl bg-border-muted' : 'rounded-2xl hover:bg-border-subtle'
                    )}
                >
                    <img src={provider.icon} alt="" className="size-4 shrink-0 object-contain" />
                    {provider.label}
                </button>
            );
        })}
    </div>
);

export default OnboardingWorkspacePicker;
