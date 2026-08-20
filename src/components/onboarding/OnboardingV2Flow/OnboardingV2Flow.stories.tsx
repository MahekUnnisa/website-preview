import type { Meta, StoryObj } from '@storybook/react-vite';
import { WebAuthProvider } from '@/context/WebAuthProvider';
import OnboardingV2Flow from './OnboardingV2Flow';
import { onboardingFullscreen, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingV2Flow',
    component: OnboardingV2Flow,
    decorators: [
        withOnboardingTheme,
        (Story) => (
            <WebAuthProvider>
                <Story />
            </WebAuthProvider>
        ),
    ],
    parameters: onboardingFullscreen,
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingV2Flow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
