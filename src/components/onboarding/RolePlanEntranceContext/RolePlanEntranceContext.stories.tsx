import type { Meta, StoryObj } from '@storybook/react-vite';
import { RolePlanEntranceProvider } from './RolePlanEntranceContext';
import { OnboardingPreviewFrame } from '../OnboardingPreviewFrame';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/RolePlanEntranceContext',
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {
    render: () => (
        <RolePlanEntranceProvider
            value={{ showPreviewBg: true, showRegularItems: true, showAccentItem: true }}
        >
            <OnboardingPreviewFrame title="Preview">
                <div className="flex h-24 items-center justify-center text-xs text-foreground-muted">
                    Entrance provider on
                </div>
            </OnboardingPreviewFrame>
        </RolePlanEntranceProvider>
    ),
};
