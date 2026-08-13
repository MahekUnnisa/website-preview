import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingFooterActions } from './OnboardingFooterActions';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingFooterActions',
    component: OnboardingFooterActions,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingFooterActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryOnly: Story = {
    args: {
        actions: [{ label: 'Turn the first key', icon: 'OnboardingKeyLight', onClick: () => undefined }],
    },
};

export const WithBack: Story = {
    args: {
        actions: [
            { label: 'Go back', variant: 'back', onClick: () => undefined },
            { label: 'Connect my tools', icon: 'OnboardingKeyLight', onClick: () => undefined },
        ],
    },
};

export const WithProgress: Story = {
    args: {
        actions: [
            {
                label: 'Turn the second key',
                icon: 'OnboardingKeyLight',
                progress: 0.45,
                onClick: () => undefined,
            },
        ],
    },
};
