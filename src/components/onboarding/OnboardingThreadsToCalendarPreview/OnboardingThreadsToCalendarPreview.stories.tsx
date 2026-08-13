import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingThreadsToCalendarPreview } from './OnboardingThreadsToCalendarPreview';
import { getOnboardingV2CommitmentsPreviewItems } from '@/utils/onboarding-v2-i18n';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingThreadsToCalendarPreview',
    component: OnboardingThreadsToCalendarPreview,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingThreadsToCalendarPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { items: getOnboardingV2CommitmentsPreviewItems() },
};
