import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingActionCard } from './OnboardingActionCard';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingActionCard',
    component: OnboardingActionCard,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingActionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: 'Focus time',
        description: 'Protect two hours each morning for deep work.',
        icon: 'OnboardingRoleTarget',
    },
};
