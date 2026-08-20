import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingWelcomeScreen } from './OnboardingWelcomeScreen';
import {
    onboardingViewportParameters,
    viewportGlobals,
    withOnboardingTheme,
} from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingWelcomeScreen',
    component: OnboardingWelcomeScreen,
    decorators: [withOnboardingTheme],
    parameters: onboardingViewportParameters,
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingWelcomeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { onHireMe: () => undefined },
};

export const IphoneSE: Story = {
    args: { onHireMe: () => undefined },
    globals: viewportGlobals('iphoneSE'),
};

export const Iphone12: Story = {
    args: { onHireMe: () => undefined },
    globals: viewportGlobals('iphone12'),
};

export const Tablet768: Story = {
    args: { onHireMe: () => undefined },
    globals: viewportGlobals('tablet768'),
};
