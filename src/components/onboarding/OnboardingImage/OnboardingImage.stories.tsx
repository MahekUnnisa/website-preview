import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from './OnboardingImage';
import { withOnboardingCentered } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingImage',
    component: Image,
    decorators: [withOnboardingCentered],
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VectorDevbot: Story = {
    args: {
        src: 'DevbotIcon',
        alt: 'Devbot',
        type: 'vector',
        style: { width: 32, height: 32, color: 'var(--accent-200)' },
    },
};

export const RasterCalendar: Story = {
    args: {
        src: 'GoogleCalendarIcon',
        alt: 'Google Calendar',
        type: 'raster',
        style: { width: 32, height: 32 },
    },
};
