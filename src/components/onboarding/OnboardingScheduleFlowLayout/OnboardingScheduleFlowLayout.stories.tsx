import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingScheduleFlowLayout } from './OnboardingScheduleFlowLayout';
import { OnboardingCalendarInsightPanel } from '../OnboardingCalendarInsightPanel';
import { mockCalendarEvents, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingScheduleFlowLayout',
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInsightPanel: Story = {
    render: () => (
        <OnboardingScheduleFlowLayout
            scheduleDate={new Date('2026-04-02T09:00:00')}
            calendarEvents={mockCalendarEvents.slice(0, 2)}
            overlay={false}
            showStatus
        >
            <OnboardingCalendarInsightPanel
                embedded
                loading
                headline=""
                date={new Date('2026-04-02T09:00:00')}
            />
        </OnboardingScheduleFlowLayout>
    ),
};
