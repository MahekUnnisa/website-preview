import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingUserBubble } from './OnboardingUserBubble';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingUserBubble',
    component: OnboardingUserBubble,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingUserBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: 'Keep my mornings clear for deep work.' },
};
