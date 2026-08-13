import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingCalendarDayPreview } from './OnboardingCalendarDayPreview';
import { mockCalendarEvents, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingCalendarDayPreview',
    component: OnboardingCalendarDayPreview,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingCalendarDayPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        date: new Date('2026-04-02T09:00:00'),
        events: mockCalendarEvents,
    },
};

export const Loading: Story = {
    args: {
        date: new Date('2026-04-02T09:00:00'),
        events: [],
        overlay: true,
    },
};
