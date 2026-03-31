import React from 'react';
import Card from '../components/Card';

const Support = () => {
  const sections = [
    {
      title: 'How to get support',
      content: [
        'Email us with a short description of the issue and (if possible) a screenshot.',
        'If something is broken, include steps to reproduce and the approximate time it occurred.',
        'We aim to respond within 2–5 business days.',
      ],
    },
    {
      title: 'Common install issues',
      content: [
        'Slack: “Add to Slack” button not working — confirm your browser allows redirects and popups, then try again.',
        'Slack: permission errors after install — reinstall to grant required permissions (optional permissions can be granted later if supported).',
        'Slack: app installed but not usable — ensure you’re in the correct workspace and that the app is allowed by workspace admins.',
        'Chrome extension: can’t find the extension — pin it from the Extensions menu and refresh the page.',
        'Chrome extension: features not working — ensure you’re signed in, then disable/re-enable the extension and refresh.',
      ],
    },
    {
      title: 'Security & privacy requests',
      content: [
        'For privacy questions (access, export, or deletion requests), email our privacy address.',
        'Do not include sensitive personal data in support emails unless it is necessary to resolve your request.',
      ],
    },
  ];

  return (
    <div className="relative">
      <div className="fixed inset-0 grid-overlay pointer-events-none" />

      <section className="relative py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground-primary">Support </span>
              <span className="gradient-text">Center</span>
            </h1>
            <p className="text-sm text-foreground-muted mb-6">
              Need help with ZeroAI? Contact us and we’ll get back to you as soon as we can.
            </p>

            <Card className="bg-purple-15 border-border-colored">
              <div className="space-y-3">
                <p className="text-sm text-foreground-muted">
                  Reach us directly by email — no additional account or sign-up is required.
                </p>
                <p className="text-sm text-foreground-muted">
                  We aim to respond within <strong>2–5 business days</strong>.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative pb-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold text-foreground-primary mb-4">
                  {index + 1}. {section.title}
                </h2>
                <Card>
                  <ul className="space-y-4">
                    {section.content.map((item) => (
                      <li key={item} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                        <span className="text-sm text-foreground-muted flex-grow">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}

            <div>
              <h2 className="text-xl font-bold text-foreground-primary mb-4">Contact</h2>
              <Card className="bg-gradient-to-br from-purple-600/10 to-purple-400/10 border-purple-400/20">
                <div className="space-y-3 text-foreground-primary">
                  <p className="text-sm text-foreground-muted">
                    Email is the fastest way to reach us. We aim to reply within 2–5 business days.
                  </p>
                  <p>
                    <strong>Support:</strong>{' '}
                    <a href="mailto:support@zeroai.co.in" className="text-purple-200 hover:text-purple-100">
                      support@zeroai.co.in
                    </a>
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;

