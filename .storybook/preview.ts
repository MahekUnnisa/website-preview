import type { Preview } from '@storybook/react-vite';
import '../src/index.css';
import { onboardingViewports } from '../src/components/onboarding/_storybook/onboardingMeta';

const preview: Preview = {
    tags: ['autodocs'],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: { disable: true },
        docs: {
            codePanel: true,
        },
        viewport: {
            options: onboardingViewports,
        },
    },
};

export default preview;
