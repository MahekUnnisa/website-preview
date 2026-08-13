import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingMeetingTimelinePreview } from './OnboardingMeetingTimelinePreview';
import { getOnboardingV2MeetingsPreviewBlocks } from '@/utils/onboarding-v2-i18n';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingMeetingTimelinePreview',
    component: OnboardingMeetingTimelinePreview,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingMeetingTimelinePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { blocks: getOnboardingV2MeetingsPreviewBlocks() },
};
