import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingSchedulePreview } from './OnboardingSchedulePreview';
import { getOnboardingV2FocusPreviewEvents } from '@/utils/onboarding-v2-i18n';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingSchedulePreview',
    component: OnboardingSchedulePreview,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingSchedulePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { events: getOnboardingV2FocusPreviewEvents() },
};
