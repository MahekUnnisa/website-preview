import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingAllSetScreen } from './OnboardingAllSetScreen';
import { onboardingViewportParameters, viewportGlobals, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingAllSetScreen',
    component: OnboardingAllSetScreen,
    decorators: [withOnboardingTheme],
    parameters: onboardingViewportParameters,
    tags: ['autodocs'],
} satisfies Meta<typeof OnboardingAllSetScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TakingYouToSlack: Story = {
    args: { workspace: 'slack', workspaceLabel: 'Slack', autoOpen: false },
};

export const SlackDidNotOpen: Story = {
    args: { workspace: 'slack', workspaceLabel: 'Slack', autoOpen: false },
};

export const TakingYouToSlackIphoneSE: Story = {
    args: { workspace: 'slack', workspaceLabel: 'Slack', autoOpen: false },
    globals: viewportGlobals('iphoneSE'),
};

export const TakingYouToSlackIphone12: Story = {
    args: { workspace: 'slack', workspaceLabel: 'Slack', autoOpen: false },
    globals: viewportGlobals('iphone12'),
};

export const TakingYouToSlackTablet768: Story = {
    args: { workspace: 'slack', workspaceLabel: 'Slack', autoOpen: false },
    globals: viewportGlobals('tablet768'),
};
