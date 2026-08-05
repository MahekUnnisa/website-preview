import React from 'react';
import { Link } from 'react-router';
import Card from '../components/Card';
import Button from '../components/Button';

const SlackLanding = () => {
  const highlights = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: 'Create events',
      description: 'Create calendar events from Slack, then stay on top of what’s next with gentle reminders.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      title: 'Tasks from Slack',
      description: 'Turn messages into actionable tasks and keep your to-do list moving forward.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      title: 'Notes in context',
      description: 'Capture quick notes from Slack so important details don’t get lost.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Message scheduling',
      description: 'Schedule messages in Slack so updates arrive at the right time — not instantly.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: 'Smart reminders',
      description: 'Get low-noise follow-ups so tasks and events don’t slip through the cracks.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      title: 'AI-powered content summarizer',
      description: 'Summarize long messages and content into clear takeaways and next steps.',
    },
  ];

  const inSlackExamples = [
    {
      title: 'Direct message onboarding',
      content: [
        'After installation, ZeroAI sends you a DM with setup and next steps.',
        'Connect your account (if needed) and confirm your workspace connection.',
        'Configure reminders so you only get what you want.',
      ],
    },
    {
      title: 'Reminders and follow-ups',
      content: [
        'Get lightweight reminders and follow-ups delivered to your DM.',
        'Adjust frequency and timing so notifications stay helpful, not distracting.',
      ],
    },
    {
      title: 'Workspace connection management',
      content: [
        'See which workspaces are connected and disconnect anytime.',
        'If something needs attention, we guide you with clear, actionable messages.',
      ],
    },
  ];

  const installSteps = [
    'Click “Add to Slack” to start the OAuth install flow.',
    'Choose a workspace and approve requested permissions.',
    'After install, you’ll land on an “Installed” page with next steps (connect account and configure reminders).',
    'Need help? Visit our Support page for contact options and response expectations.',
  ];

  return (
    <div className="relative mt-20">
      <div className="fixed inset-0 grid-overlay pointer-events-none" />

      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="container-custom w-full">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-6 animate-slide-down-fade-in">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-green-400 font-medium">Slack App • Marketplace-ready landing</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-down-fade-in">
              <span className="text-foreground-primary">Connect Slack to</span>
              <br />
              <span className="gradient-text">ZeroAI</span>
            </h1>

            <p className="text-lg md:text-xl text-foreground-muted mb-8 max-w-3xl mx-auto animate-slide-down-fade-in">
              Securely connect your workspace to send reminders, automate tasks, and more.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-slide-up-fade-in">
              <a href="#">
                <Button variant="primary" size="lg">
                  Add to Slack
                </Button>
              </a>

              <Link to="/support">
                <Button variant="outline" size="lg">
                  Get Support
                </Button>
              </Link>
            </div>

            <div className="relative mt-10 animate-slide-up-fade-in">
              <div className="absolute inset-0 bg-linear-to-r from-purple-400/20 to-purple-600/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-background-tertiary border border-border rounded-2xl p-1 shadow-2xl">
                <img
                  src="/slack.png"
                  alt="Connect Slack to ZeroAI"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-10 md:py-12">
        <div className="container-custom">
          <div className="text-center mb-8 animate-slide-down-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-foreground-primary mb-2">What you get</h2>
            <p className="text-sm text-foreground-muted max-w-2xl mx-auto">
              A Slack-first experience that helps teams get work done more easily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <Card
                key={item.title}
                className="group cursor-pointer animate-slide-up-fade-in"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="text-purple-200 mb-4 group-hover:text-purple-100 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-foreground-primary mb-2">{item.title}</h3>
                <p className="text-sm text-foreground-muted">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-10 md:py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground-primary mb-2">How it works in Slack</h2>
              <p className="text-sm text-foreground-muted">
                Here are common workflows you’ll see after installing ZeroAI.
              </p>
            </div>

            <div className="space-y-6">
              {inSlackExamples.map((section, index) => (
                <div key={section.title}>
                  <h3 className="text-lg font-bold text-foreground-primary mb-3">
                    {index + 1}. {section.title}
                  </h3>
                  <Card>
                    <ul className="space-y-3">
                      {section.content.map((line) => (
                        <li key={line} className="flex items-start space-x-3">
                          <span className="shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                          <span className="text-sm text-foreground-muted grow">{line}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-10 md:py-12">
        <div className="container-custom">
          <Card className="bg-linear-to-br from-purple-600/10 to-purple-400/10 border-purple-400/20 relative overflow-hidden animate-slide-up-fade-in">
            <div className="absolute inset-0 bg-linear-to-r from-purple-400/5 to-purple-600/5 blur-3xl"></div>
            <div className="relative max-w-4xl mx-auto py-6 px-6">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground-primary mb-2">Install & get started</h2>
                <p className="text-sm text-foreground-muted">
                  Connect Slack to ZeroAI and keep reminders and follow-ups in one focused place.
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <ul className="space-y-3 text-left">
                  {installSteps.map((step) => (
                    <li key={step} className="flex items-start space-x-3">
                      <span className="shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                      <span className="text-sm text-foreground-muted grow">{step}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 justify-center">
                  <a href="#">
                    <Button variant="primary" size="lg">
                      Add to Slack
                    </Button>
                  </a>
                  <Link to="/support">
                    <Button variant="outline" size="lg">
                      Support & contact
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default SlackLanding;

