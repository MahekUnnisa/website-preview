import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingPlanPreviewCard } from './OnboardingPlanPreviewCard';
import { OnboardingPlanStep } from '../OnboardingPlanStep';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingPlanPreviewCard',
    component: OnboardingPlanPreviewCard,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingPlanPreviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        preview: (
            <div className="flex h-32 flex-1 items-center justify-center text-sm text-foreground-muted">
                Preview slot
            </div>
        ),
        steps: (
            <>
                <OnboardingPlanStep step={1}>Understand your calendar.</OnboardingPlanStep>
                <OnboardingPlanStep step={2}>Schedule work from threads.</OnboardingPlanStep>
            </>
        ),
    },
};
