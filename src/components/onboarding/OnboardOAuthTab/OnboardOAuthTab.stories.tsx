import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardOAuthTab } from './OnboardOAuthTab';
import { onboardingFullscreen, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardOAuthTab',
    component: OnboardOAuthTab,
    decorators: [withOnboardingTheme],
    parameters: onboardingFullscreen,
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardOAuthTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
    args: { status: 'loading', countdown: 3, canClose: true },
};

export const Success: Story = {
    args: { status: 'success', countdown: 3, canClose: true, actionLabel: 'Close Window' },
};

export const SuccessSameTab: Story = {
    args: { status: 'success', countdown: 3, canClose: false, actionLabel: 'Continue' },
};

export const Error: Story = {
    args: { status: 'error', countdown: 3, canClose: true, actionLabel: 'Close Window' },
};

export const ErrorAccessDenied: Story = {
    args: {
        status: 'error',
        countdown: 5,
        canClose: true,
        actionLabel: 'Close Window',
        errorTitle: 'Access denied',
        errorDescription: 'Permission was not granted. You can close this window and try again.'
    },
};

export const ErrorEmailMismatch: Story = {
    args: {
        status: 'error',
        countdown: 5,
        canClose: true,
        actionLabel: 'Close Window',
        errorTone: 'warning',
        errorTitle: 'Email mismatch',
        errorDescription: "That account doesn't match the one you're signed in with. Try again with the same email."
    },
};
