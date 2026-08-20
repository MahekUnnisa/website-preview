import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingKeysPanel, OnboardingKeysDivider } from './OnboardingKeysPanel';
import { OnboardingKeyItem } from '../OnboardingKeyItem';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingKeysPanel',
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <OnboardingKeysPanel className="max-w-md">
            <OnboardingKeyItem
                keyLabel="KEY 01"
                title="Google Calendar"
                description="Where I understand your day."
                icon="GoogleCalendarIcon"
                iconType="raster"
                iconVariant="brand"
            />
            <OnboardingKeysDivider />
            <OnboardingKeyItem
                keyLabel="KEY 02"
                title="Slack"
                description="Where commitments live."
                iconUrl="https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png"
                iconVariant="brand"
            />
        </OnboardingKeysPanel>
    ),
};
