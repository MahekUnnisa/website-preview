import type { Meta, StoryObj } from '@storybook/react-vite';
import { WebAuthProvider } from '@/context/WebAuthProvider';
import OnboardingV2 from './OnboardingV2';
import { onboardingFullscreen, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingV2',
    component: OnboardingV2,
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
} satisfies Meta<typeof OnboardingV2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
