import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingInstallScreen } from './OnboardingInstallScreen';
import { onboardingViewportParameters, viewportGlobals, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingInstallScreen',
    component: OnboardingInstallScreen,
    decorators: [withOnboardingTheme],
    parameters: onboardingViewportParameters,
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingInstallScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IphoneSE: Story = {
    globals: viewportGlobals('iphoneSE'),
};

export const Iphone12: Story = {
    globals: viewportGlobals('iphone12'),
};

export const Tablet768: Story = {
    globals: viewportGlobals('tablet768'),
};
