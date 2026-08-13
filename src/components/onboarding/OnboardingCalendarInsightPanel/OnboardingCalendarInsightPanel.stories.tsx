import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingCalendarInsightPanel } from './OnboardingCalendarInsightPanel';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingCalendarInsightPanel',
    component: OnboardingCalendarInsightPanel,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingCalendarInsightPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
    args: {
        headline: '',
        loading: true,
        embedded: true,
        date: new Date('2026-04-02T09:00:00'),
    },
};

export const Ready: Story = {
    args: {
        headline: 'Your **Thursday** looks clear until 2 PM — I blocked focus time for the launch doc.',
        embedded: true,
        date: new Date('2026-04-02T09:00:00'),
        wrapUpTime: '6:30 PM',
        onOpenZero: () => undefined,
    },
};
