import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingPrimaryButton } from './OnboardingPrimaryButton';
import { withOnboardingCentered } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingPrimaryButton',
    component: OnboardingPrimaryButton,
    decorators: [withOnboardingCentered],
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingPrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: 'Hire me' },
};

export const WithProgress: Story = {
    args: { children: 'Turn the second key', progress: 0.65 },
};
