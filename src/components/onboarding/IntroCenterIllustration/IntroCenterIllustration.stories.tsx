import type { Meta, StoryObj } from '@storybook/react-vite';
import { IntroCenterIllustration } from './IntroCenterIllustration';
import { onboardingFullscreen, withOnboardingCentered } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/IntroCenterIllustration',
    component: IntroCenterIllustration,
    decorators: [withOnboardingCentered],
    parameters: onboardingFullscreen,
    tags: ['autodocs'],
} satisfies Meta<typeof IntroCenterIllustration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithEntrance: Story = {
    args: { animateEntrance: true },
};

export const CustomLabels: Story = {
    args: {
        dateLabel: 'Today, 22 July',
        notesTitle: 'Sprint planning notes',
        notificationCount: 5,
    },
};
