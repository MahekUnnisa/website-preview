import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingScreenShell } from './OnboardingScreenShell';
import { OnboardingPrimaryButton } from '../OnboardingPrimaryButton';
import { onboardingFullscreen, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingScreenShell',
    decorators: [withOnboardingTheme],
    parameters: onboardingFullscreen,
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <OnboardingScreenShell>
            <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-lg font-medium">Screen shell content</p>
                <OnboardingPrimaryButton>Hire me</OnboardingPrimaryButton>
            </div>
        </OnboardingScreenShell>
    ),
};
