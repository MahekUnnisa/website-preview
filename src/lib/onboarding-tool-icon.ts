export type ResolvedOnboardingToolIcon = {
    iconKey?: string;
    iconUrl?: string;
};

export function resolveOnboardingToolIcon(input: {
    id: string;
    icon?: string;
    fallbackIconKey?: string;
    fallbackIconUrl?: string;
}): ResolvedOnboardingToolIcon {
    if (input.icon?.startsWith('http://') || input.icon?.startsWith('https://')) {
        return { iconUrl: input.icon };
    }

    if (input.icon) {
        return {
            iconKey: input.icon,
            iconUrl: input.fallbackIconUrl,
        };
    }

    if (input.fallbackIconKey) {
        return {
            iconKey: input.fallbackIconKey,
            iconUrl: input.fallbackIconUrl,
        };
    }

    return { iconUrl: input.fallbackIconUrl ?? '' };
}
