import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingPreviewFrame } from './OnboardingPreviewFrame';
import { RolePlanEntranceProvider } from '../RolePlanEntranceContext';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingPreviewFrame',
    component: OnboardingPreviewFrame,
    decorators: [
        withOnboardingTheme,
        (Story) => (
            <RolePlanEntranceProvider
                value={{ showPreviewBg: true, showRegularItems: true, showAccentItem: true }}
            >
                <Story />
            </RolePlanEntranceProvider>
        ),
    ],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingPreviewFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: 'Preview',
        children: (
            <div className="flex h-24 items-center justify-center text-xs text-foreground-muted">
                Framed preview
            </div>
        ),
    },
};
