import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingScheduleStatus } from './OnboardingScheduleStatus';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingScheduleStatus',
    component: OnboardingScheduleStatus,
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingScheduleStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rotating: Story = {};

export const FixedHeadline: Story = {
    args: { headline: 'Building your first day with Zero…' },
};
