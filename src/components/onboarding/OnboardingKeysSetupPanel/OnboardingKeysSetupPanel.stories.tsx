import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingKeysSetupPanel } from './OnboardingKeysSetupPanel';
import { OnboardingKeysPanel, OnboardingKeysDivider } from '../OnboardingKeysPanel';
import { OnboardingKeyItem } from '../OnboardingKeyItem';
import { OnboardingFooterActions } from '../OnboardingFooterActions';
import { OnboardingStatusMessage } from '../OnboardingStatusMessage';
import { OnboardingWorkspacePicker } from '../OnboardingWorkspacePicker';
import { OnboardingScreenShell } from '../OnboardingScreenShell';
import { mockWorkspaceProviders, onboardingViewportParameters, viewportGlobals, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingKeysSetupPanel',
    decorators: [withOnboardingTheme],
    parameters: onboardingViewportParameters,
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <OnboardingScreenShell mainClassName="items-start justify-center pt-[13px]">{children}</OnboardingScreenShell>
);

export const FirstKey: Story = {
    render: () => {
        const [workspace, setWorkspace] = useState<'slack' | 'msteams'>('slack');
        return (
            <Shell>
                <OnboardingKeysSetupPanel
                    title="Two keys and I can start"
                    className="gap-6"
                    contentClassName="gap-6"
                    footer={
                        <OnboardingFooterActions
                            actions={[{ label: 'Turn the first key', icon: 'OnboardingKeyLight', onClick: () => undefined }]}
                        />
                    }
                >
                    <OnboardingKeysPanel>
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
                            description="Where commitments, decisions, and blockers actually live."
                            iconUrl={mockWorkspaceProviders[0].icon}
                            iconVariant="brand"
                            footer={
                                <OnboardingWorkspacePicker
                                    value={workspace}
                                    onChange={setWorkspace}
                                    providers={mockWorkspaceProviders}
                                />
                            }
                        />
                    </OnboardingKeysPanel>
                </OnboardingKeysSetupPanel>
            </Shell>
        );
    },
};

export const BothConnected: Story = {
    render: () => (
        <Shell>
            <OnboardingKeysSetupPanel
                title="Two keys and I can start"
                className="gap-6"
                contentClassName="gap-6"
                entranceComplete
                footer={<OnboardingStatusMessage message="Both keys are turned. Starting now…" loadingIcon />}
            >
                <OnboardingKeysPanel>
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
                        description="Where commitments, decisions, and blockers actually live."
                        iconUrl={mockWorkspaceProviders[0].icon}
                        iconVariant="brand"
                        connected
                        connectedLabel="Connected"
                    />
                </OnboardingKeysPanel>
            </OnboardingKeysSetupPanel>
        </Shell>
    ),
};

export const FirstKeyIphoneSE: Story = {
    ...FirstKey,
    globals: viewportGlobals('iphoneSE'),
};

export const FirstKeyIphone12: Story = {
    ...FirstKey,
    globals: viewportGlobals('iphone12'),
};

export const FirstKeyTablet768: Story = {
    ...FirstKey,
    globals: viewportGlobals('tablet768'),
};
