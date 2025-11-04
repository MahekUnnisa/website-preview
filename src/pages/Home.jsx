import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

const Home = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Smart Calendar Management',
      description: 'Manage your calendar, schedule events, and get smart reminders. ZeroAI helps you stay organized and never miss a meeting.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: 'Task Management',
      description: 'Create, track, and complete tasks effortlessly. Get smart nudges to boost productivity and clear your to-do list faster.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: 'Quick Notes',
      description: 'Capture ideas instantly with our note-taking feature. Save, organize, and access your thoughts whenever you need them.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Content Summarization',
      description: 'Summarize lengthy articles with AI-powered TL;DR. Get quick, useful insights from any web page. You read less, learn more.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Quick Search',
      description: 'Search across Google, YouTube, GitHub, Stack Overflow, and more with slash commands. Find what you need, faster.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'AI-Powered Productivity',
      description: 'ZeroAI preps you for scrums, helps clear tasks, and boosts deep work. Your AI assistant that actually delivers.',
    },
  ];

  const stats = [
    { value: 'Free', label: 'Forever' },
    { value: 'Chrome', label: 'Extension' },
    { value: 'AI-Powered', label: 'Assistant' },
    { value: 'Open', label: 'Beta' },
  ];

  return (
    <div className="relative mt-20">
      {/* Grid Overlay */}
      <div className="fixed inset-0 grid-overlay pointer-events-none" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="container-custom w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-purple-15 border border-border-colored rounded-full px-4 py-2 mb-6 animate-slide-down-fade-in">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-purple-200 font-medium">Chrome Extension • Now Available</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-down-fade-in">
              <span className="text-foreground-primary">Your AI Assistant</span>
              <br />
              <span className="gradient-text">That Actually Delivers</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-foreground-muted mb-8 max-w-3xl mx-auto animate-slide-down-fade-in">
              Manage your calendar, notes, and tasks with ZeroAI. 
              Supercharge your workflow — you focus on building, we take care of the rest.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up-fade-in">
              <a 
                href="https://chromewebstore.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="lg">
                  Add to Chrome - It's Free
                </Button>
              </a>
              <a href="#features">
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </a>
            </div>

            {/* Hero Image/Placeholder */}
            <div className="relative animate-slide-up-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-background-tertiary border border-border rounded-2xl p-6 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-background-secondary to-background rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <p className="text-base text-foreground-muted">Your AI Dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-10 md:py-12">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground-primary mb-2">
              Powerful Features
            </h2>
            <p className="text-sm text-foreground-muted max-w-2xl mx-auto">
              Everything you need to build amazing AI-powered applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group cursor-pointer">
                <div className="text-purple-200 mb-4 group-hover:text-purple-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-foreground-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-foreground-muted">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-10 md:py-12">
        <div className="container-custom">
          <Card className="text-center bg-gradient-to-br from-purple-600/10 to-purple-400/10 border-purple-400/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 to-purple-600/5 blur-3xl"></div>
            <div className="relative max-w-3xl mx-auto py-6 px-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground-primary mb-2">
                Ready to Supercharge Your Workflow?
              </h2>
              <p className="text-sm text-foreground-muted mb-5">
                Join developers who are boosting productivity with ZeroAI
              </p>
              <a 
                href="https://chromewebstore.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="lg">
                  Install ZeroAI Extension
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

