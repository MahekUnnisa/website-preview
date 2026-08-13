import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingWelcomeScreen } from './OnboardingWelcomeScreen';
import { onboardingFullscreen, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingWelcomeScreen',
    component: OnboardingWelcomeScreen,
    decorators: [withOnboardingTheme],
    parameters: onboardingFullscreen,
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingWelcomeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { onHireMe: () => undefined },
};
