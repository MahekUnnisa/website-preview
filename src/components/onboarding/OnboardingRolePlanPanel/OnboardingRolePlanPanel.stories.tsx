import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingRolePlanPanel } from './OnboardingRolePlanPanel';
import { OnboardingPlanStep } from '../OnboardingPlanStep';
import { OnboardingSchedulePreview } from '../OnboardingSchedulePreview';
import { OnboardingFooterActions } from '../OnboardingFooterActions';
import { OnboardingTrustNote } from '../OnboardingTrustNote';
import { OnboardingScreenShell } from '../OnboardingScreenShell';
import { getOnboardingV2FocusPreviewEvents, getOnboardingV2RolePlanCopy } from '@/utils/onboarding-v2-i18n';
import { getRoleChoiceLabels } from '@/lib/onboarding-flow';
import { onboardingViewportParameters, viewportGlobals, withOnboardingTheme } from '../_storybook/onboardingMeta';

const meta = {
    title: 'Onboarding/OnboardingRolePlanPanel',
    decorators: [withOnboardingTheme],
    parameters: onboardingViewportParameters,
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const copy = getOnboardingV2RolePlanCopy();

export const FocusPlan: Story = {
    render: () => (
        <OnboardingScreenShell mainClassName="items-start justify-center pt-[13px]">
            <OnboardingRolePlanPanel
                userChoice={getRoleChoiceLabels().focus}
                botMessage={copy.botMessage}
                preview={<OnboardingSchedulePreview events={getOnboardingV2FocusPreviewEvents()} />}
                steps={
                    <>
                        {copy.focusSteps.map((stepCopy, index) => (
                            <OnboardingPlanStep key={stepCopy.lead} step={index + 1}>
                                {stepCopy.rest}
                            </OnboardingPlanStep>
                        ))}
                    </>
                }
                actions={[
                    { label: copy.goBack, variant: 'back', onClick: () => undefined },
                    { label: copy.connectTools, icon: 'OnboardingKeyLight', onClick: () => undefined },
                ]}
                trustNote={copy.trustNote}
            />
        </OnboardingScreenShell>
    ),
};

export const FocusPlanIphoneSE: Story = {
    ...FocusPlan,
    globals: viewportGlobals('iphoneSE'),
};

export const FocusPlanIphone12: Story = {
    ...FocusPlan,
    globals: viewportGlobals('iphone12'),
};

export const FocusPlanTablet768: Story = {
    ...FocusPlan,
    globals: viewportGlobals('tablet768'),
};
