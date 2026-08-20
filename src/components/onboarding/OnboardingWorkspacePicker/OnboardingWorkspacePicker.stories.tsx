import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingWorkspacePicker } from './OnboardingWorkspacePicker';
import { mockWorkspaceProviders, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingWorkspacePicker',
    decorators: [withOnboardingTheme],
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => {
        const [value, setValue] = useState<'slack' | 'msteams'>('slack');
        return (
            <OnboardingWorkspacePicker
                value={value}
                onChange={setValue}
                providers={mockWorkspaceProviders}
            />
        );
    },
};
