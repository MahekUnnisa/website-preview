import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingRoleSelectScreen } from './OnboardingRoleSelectScreen';
import { onboardingFullscreen, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingRoleSelectScreen',
    component: OnboardingRoleSelectScreen,
    decorators: [withOnboardingTheme],
    parameters: onboardingFullscreen,
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingRoleSelectScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { onSelect: () => undefined },
};
