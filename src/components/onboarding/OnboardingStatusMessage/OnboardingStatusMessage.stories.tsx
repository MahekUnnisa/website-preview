import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingStatusMessage } from './OnboardingStatusMessage';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingStatusMessage',
    component: OnboardingStatusMessage,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingStatusMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { message: 'Both keys are turned. Starting now…' },
};

export const WithLoadingIcon: Story = {
    args: { message: 'Both keys are turned. Starting now…', loadingIcon: true },
};

export const Prominent: Story = {
    args: { message: 'Analyzing your calendar…', variant: 'prominent', loadingIcon: true },
};
