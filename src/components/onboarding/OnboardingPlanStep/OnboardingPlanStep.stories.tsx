import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingPlanStep } from './OnboardingPlanStep';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingPlanStep',
    component: OnboardingPlanStep,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingPlanStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
    args: {
        step: 1,
        children: 'Zero reads your calendar and understands your day.',
    },
};
