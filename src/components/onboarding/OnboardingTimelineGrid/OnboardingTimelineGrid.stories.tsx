import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimelineGrid } from './OnboardingTimelineGrid';
import { mockCalendarEvents, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/TimelineGrid',
    component: TimelineGrid,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof TimelineGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        date: new Date('2026-04-02T09:00:00'),
        events: mockCalendarEvents,
        fillHeight: true,
    },
};
