import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingLoadingIcon } from './OnboardingLoadingIcon';
import { withOnboardingCentered } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingLoadingIcon',
    component: OnboardingLoadingIcon,
    decorators: [withOnboardingCentered],
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingLoadingIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = { args: { size: 20 } };
export const Medium: Story = { args: { size: 38 } };
export const Large: Story = { args: { size: 72 } };
