import React from 'react';
import { MemoryRouter } from 'react-router';
import Home from './Home';

const landingViewports = {
  desktop1440: {
    name: 'Desktop 1440',
    styles: { width: '1440px', height: '900px' },
    type: 'desktop',
  },
  desktop1280: {
    name: 'Desktop 1280',
    styles: { width: '1280px', height: '900px' },
    type: 'desktop',
  },
  mobile390: {
    name: 'Mobile 390',
    styles: { width: '390px', height: '844px' },
    type: 'mobile',
  },
};

const landingParameters = {
  layout: 'fullscreen',
  backgrounds: { disable: true },
  viewport: { options: landingViewports },
};

/** @type {import('@storybook/react-vite').Meta<typeof Home>} */
const meta = {
  title: 'Pages/Home',
  component: Home,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: landingParameters,
  tags: ['autodocs'],
};

export default meta;

/** Full landing page from Figma. */
export const Default = {};

export const Desktop1440 = {
  globals: { viewport: { value: 'desktop1440', isRotated: false } },
};

export const Desktop1280 = {
  globals: { viewport: { value: 'desktop1280', isRotated: false } },
};

export const Mobile390 = {
  globals: { viewport: { value: 'mobile390', isRotated: false } },
};
