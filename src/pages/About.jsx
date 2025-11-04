import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: 'Mahek Unnisa',
      role: 'Creator & Developer',
      image: '👩‍💻',
      bio: 'Building DevBytes to help developers stay productive and focused.',
    },
    {
      name: 'DevBot',
      role: 'AI Assistant',
      image: '🤖',
      bio: 'Your productivity companion that manages calendar, tasks, and notes.',
    },
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Simplicity First',
      description: 'We believe productivity tools should be simple, not overwhelming. Less friction, more focus.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Developer-Centric',
      description: 'Built by developers, for developers. We understand your workflow and pain points.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Privacy Matters',
      description: 'Your data stays yours. We integrate with Google services securely and respect your privacy.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      title: 'Always Free',
      description: 'Core features will always be free. We are committed to keeping DevBytes accessible to everyone.',
    },
  ];

  const milestones = [
    { year: 'Q1 2025', title: 'Concept & Research', description: 'Identified the productivity pain points developers face daily' },
    { year: 'Q2 2025', title: 'Development Begins', description: 'Started building DevBot with focus on calendar and task management' },
    { year: 'Q3 2025', title: 'Alpha Testing', description: 'Internal testing with core features: calendar, tasks, notes, and TL;DR' },
    { year: 'Nov 2025', title: 'Public Launch 🎉', description: 'Released DevBytes Chrome Extension to the world - available for free!' },
  ];

  return (
    <div className="relative">
      {/* Grid Overlay */}
      <div className="fixed inset-0 grid-overlay pointer-events-none" />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-foreground-primary">About </span>
              <span className="gradient-text">DevBytes</span>
            </h1>
            <p className="text-xl text-foreground-muted mb-8">
              We're building an AI assistant that helps developers and professionals 
              stay organized, productive, and focused on what matters most.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative py-20 bg-background-secondary/50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground-primary mb-8">
              Our Story
            </h2>
            <div className="space-y-6 text-lg text-foreground-muted">
              <p>
                DevBytes started with a simple observation: developers and professionals waste too much time 
                context-switching between calendars, task managers, notes apps, and search tools. We knew there 
                had to be a better way.
              </p>
              <p>
                We built DevBot, an AI assistant that lives in your browser and actually understands your workflow. 
                It manages your Google Calendar, helps you track tasks, captures quick notes, and even summarizes 
                lengthy articles so you can stay focused on what matters.
              </p>
              <p>
                Today marks our launch day. We're excited to share DevBytes with the world as a free Chrome extension, 
                built for developers, by developers. Our goal is simple: make you more productive without adding 
                complexity to your day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20 md:py-32">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground-primary mb-4">
              Our Values
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index}>
                <div className="text-purple-200 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-foreground-muted">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-20 bg-background-secondary/50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground-primary mb-16 text-center">
              Our Journey
            </h2>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-8 items-start">
                  <div className="flex-shrink-0 w-24">
                    <div className="text-3xl font-bold text-purple-200">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <Card>
                      <h3 className="text-xl font-semibold text-foreground-primary mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-foreground-muted">
                        {milestone.description}
                      </p>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20 md:py-32">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground-primary mb-4">
              Meet the Team
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              The humans (and AI) behind DevBytes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <div className="text-6xl mb-4">
                  {member.image}
                </div>
                <h3 className="text-xl font-semibold text-foreground-primary mb-1">
                  {member.name}
                </h3>
                <div className="text-purple-200 text-sm font-medium mb-3">
                  {member.role}
                </div>
                <p className="text-foreground-muted text-sm">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="container-custom">
          <Card className="text-center bg-gradient-to-br from-purple-600/10 to-purple-400/10 border-purple-400/20">
            <div className="max-w-3xl mx-auto py-12">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground-primary mb-6">
                Join Us on This Journey
              </h2>
              <p className="text-xl text-foreground-muted mb-8">
                Whether you're a developer, business, or enthusiast, we'd love to have you as part of our community.
              </p>
              <Link to="/contact">
                <Button variant="primary" size="lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;

