import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getChromeWebStoreUrl } from '../lib/env';

const chromeWebStoreUrl = getChromeWebStoreUrl();

const Home = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Organized meetings',
      description: 'See what is next, prepare quickly, and keep follow-ups from slipping after the call ends.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: 'Simplified tasks',
      description: 'Capture tasks straight from your browser, then open a clean list when it\'s time to build.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: 'Usable notes',
      description: 'Save thoughts, links, and key details from any webpage without breaking focus.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l2.5 2.5M9 2h6m-3 3a7 7 0 107 7 7 7 0 00-7-7zM5 5L3.5 6.5m15-1.5L20 6.5" />
        </svg>
      ),
      title: 'Focus Mode',
      description: 'Start Pomodoro sessions and block distracting websites when it is time to protect deep work.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Quick actions',
      description: 'Use fast slash commands (/) to search docs, take notes, and log tasks without leaving your current tab.',
    }
  ];

  return (
    <div className="relative">
      {/* Grid Overlay */}
      <div className="fixed inset-0 grid-overlay pointer-events-none" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-400/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="container-custom w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-green-950 border border-green-700 rounded-full px-4 py-2 mb-6 animate-slide-down-fade-in">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm text-green-200 font-medium">Chrome Extension • Built for everyday work</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-[-0.04em] animate-slide-down-fade-in">
              <span className="text-foreground-primary">Your work assistant,</span>
              <br />
              <span className="gradient-text">that actually delivers.</span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-foreground-muted mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-down-fade-in">
              ZeroAI brings notes, tasks, meeting summaries, smart prep, and instant actions directly into Chrome, so you never have to leave your workflow.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up-fade-in">
              <a 
                href={chromeWebStoreUrl}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="lg">
                  Add to Chrome
                </Button>
              </a>
              <a href="#features">
                <Button variant="outline" size="lg">
                  See what it does
                </Button>
              </a>
            </div>

            {/* Hero Image/Screenshot */}
            <div className="relative animate-slide-up-fade-in">
              <div className="absolute inset-0 bg-purple-400/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-background-tertiary border border-border rounded-2xl p-1 shadow-2xl shadow-black/30">
                <img 
                  src="/screenshot.png" 
                  alt="ZeroAI Dashboard - Your AI Assistant" 
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-16 md:py-20">
        <div className="container-custom">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground-primary mb-3 tracking-[-0.03em]">
              Useful pieces, kept close
            </h2>
            <p className="text-sm md:text-base text-foreground-muted leading-relaxed">
              ZeroAI is built for the small but frequent moments that slow you down: capturing context, extracting insights, planning next steps, and getting back to deep work.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {features.map((feature, index) => (
              <div key={index} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex">
                <Card className="group relative overflow-hidden bg-background-secondary/80 w-full">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-[0.625rem] border border-border-colored bg-purple-15 text-purple-200 transition-colors group-hover:text-purple-100">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold text-foreground-primary mb-2 tracking-[-0.01em]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 md:py-16">
        <div className="container-custom">
          <Card className="text-center bg-purple-15 border-border-colored relative overflow-hidden">
            <div className="absolute inset-0 bg-purple-400/5 blur-3xl"></div>
            <div className="relative max-w-3xl mx-auto py-6 px-6">
              <h2 className="text-xl md:text-3xl font-bold text-foreground-primary mb-2 tracking-[-0.03em]">
                Bring ZeroAI into Chrome
              </h2>
              <p className="text-sm text-foreground-muted mb-5 leading-relaxed">
                A focused assistant for the tabs, meetings, notes, and tasks.
              </p>
              <a 
                href={chromeWebStoreUrl}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="lg">
                  Install the Extension
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;

