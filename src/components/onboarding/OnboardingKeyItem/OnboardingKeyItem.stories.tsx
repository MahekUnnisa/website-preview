import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingKeyItem } from './OnboardingKeyItem';
import { OnboardingKeysPanel, OnboardingKeysDivider } from '../OnboardingKeysPanel';
import { withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingKeyItem',
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
    render: () => (
        <OnboardingKeysPanel className="max-w-md">
            <OnboardingKeyItem
                keyLabel="KEY 01"
                title="Google Calendar"
                description="Where I understand your day and run the plan."
                icon="GoogleCalendarIcon"
                iconType="raster"
                iconVariant="brand"
                connected={false}
                requiredHint="Required"
            />
            <OnboardingKeysDivider />
            <OnboardingKeyItem
                keyLabel="KEY 02"
                title="Slack"
                description="Where commitments and blockers live."
                iconUrl="https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png"
                iconVariant="brand"
                connected={false}
            />
        </OnboardingKeysPanel>
    ),
};

export const Connected: Story = {
    render: () => (
        <OnboardingKeysPanel className="max-w-md">
            <OnboardingKeyItem
                keyLabel="KEY 01"
                title="Google Calendar"
                description="Where I understand your day and run the plan."
                icon="GoogleCalendarIcon"
                iconType="raster"
                iconVariant="brand"
                connected
                connectedLabel="Connected"
            />
            <OnboardingKeysDivider />
            <OnboardingKeyItem
                keyLabel="KEY 02"
                title="Slack"
                description="Where commitments and blockers live."
                iconUrl="https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png"
                iconVariant="brand"
                connected
                connectedLabel="Connected"
            />
        </OnboardingKeysPanel>
    ),
};
