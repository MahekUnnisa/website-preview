import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingPlanSteps } from './OnboardingPlanSteps';
import { OnboardingPlanStep } from '../OnboardingPlanStep';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingPlanSteps',
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <OnboardingPlanSteps>
            <OnboardingPlanStep step={1}>Read your calendar and priorities.</OnboardingPlanStep>
            <OnboardingPlanStep step={2}>Schedule work from open threads.</OnboardingPlanStep>
            <OnboardingPlanStep step={3}>Adapt as meetings move.</OnboardingPlanStep>
        </OnboardingPlanSteps>
    ),
};
