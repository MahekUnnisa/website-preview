import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingTrustNote } from './OnboardingTrustNote';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingTrustNote',
    component: OnboardingTrustNote,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingTrustNote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: 'Your data stays private. You can disconnect anytime.' },
};
