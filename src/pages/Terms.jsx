import React from 'react';
import Card from '../components/Card';

const Terms = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: [
        'By accessing or using ZeroAI\'s services, you agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, please do not use our services.',
        'We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.',
      ],
    },
    {
      title: 'Description of Service',
      content: [
        'ZeroAI provides AI-powered tools and services to help individuals and businesses leverage artificial intelligence.',
        'We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.',
        'Some features may be subject to additional terms or require a subscription.',
      ],
    },
    {
      title: 'User Accounts',
      content: [
        'You must create an account to access certain features of our services.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to provide accurate, current, and complete information during registration.',
        'You must notify us immediately of any unauthorized use of your account.',
      ],
    },
    {
      title: 'Acceptable Use',
      content: [
        'You agree to use our services only for lawful purposes and in accordance with these terms.',
        'You may not use our services to transmit harmful, offensive, or illegal content.',
        'You may not attempt to gain unauthorized access to our systems or interfere with service operations.',
        'You may not use our services to compete with us or develop similar products.',
      ],
    },
    {
      title: 'Intellectual Property',
      content: [
        'All content, features, and functionality of our services are owned by ZeroAI and protected by intellectual property laws.',
        'You may not copy, modify, distribute, or create derivative works without our explicit permission.',
        'You retain ownership of any content you submit to our services.',
        'By submitting content, you grant us a license to use, store, and process it to provide our services.',
      ],
    },
    {
      title: 'Payments and Subscriptions',
      content: [
        'Some features require payment of fees as described in our pricing page.',
        'All fees are non-refundable unless otherwise stated.',
        'We may change our fees at any time with advance notice.',
        'You authorize us to charge your payment method for all fees incurred.',
      ],
    },
    {
      title: 'Disclaimer of Warranties',
      content: [
        'Our services are provided "as is" without warranties of any kind, express or implied.',
        'We do not warrant that our services will be uninterrupted, error-free, or secure.',
        'We make no guarantees about the accuracy, reliability, or completeness of any content or results.',
      ],
    },
    {
      title: 'Limitation of Liability',
      content: [
        'To the maximum extent permitted by law, ZeroAI shall not be liable for any indirect, incidental, or consequential damages.',
        'Our total liability shall not exceed the amount you paid us in the twelve months preceding the claim.',
        'Some jurisdictions do not allow certain limitations, so these may not apply to you.',
      ],
    },
    {
      title: 'Indemnification',
      content: [
        'You agree to indemnify and hold harmless ZeroAI from any claims arising from your use of our services.',
        'This includes claims related to your violation of these terms or infringement of any rights.',
      ],
    },
    {
      title: 'Termination',
      content: [
        'We may terminate or suspend your account at any time for violations of these terms.',
        'You may terminate your account at any time through your account settings.',
        'Upon termination, your right to use our services will immediately cease.',
        'Certain provisions of these terms will survive termination.',
      ],
    },
    {
      title: 'Governing Law',
      content: [
        'These terms shall be governed by the laws of Singapore, without regard to conflict of law principles.',
        'Any disputes shall be resolved in the courts of Singapore.',
        'You agree to submit to the personal jurisdiction of the Singapore courts.',
      ],
    },
    {
      title: 'Miscellaneous',
      content: [
        'These terms constitute the entire agreement between you and ZeroAI regarding our services.',
        'If any provision is found to be unenforceable, the remaining provisions will continue in effect.',
        'Our failure to enforce any right or provision shall not constitute a waiver.',
        'You may not assign these terms without our prior written consent.',
      ],
    },
  ];

  return (
    <div className="relative">
      {/* Grid Overlay */}
      <div className="fixed inset-0 grid-overlay pointer-events-none" />

      {/* Hero Section */}
      <section className="relative py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground-primary">Terms of </span>
              <span className="gradient-text">Service</span>
            </h1>
            <p className="text-sm text-foreground-muted mb-6">
              Last Updated: November 4, 2025
            </p>
            <Card className="bg-purple-15 border-border-colored">
              <p className="text-sm text-foreground-muted mb-3">
                These Terms of Service govern your access to and use of ZeroAI's Chrome extension and services,
                including our website and any related services. By using our services,
                you agree to be bound by these terms.
              </p>
              <p className="text-sm text-foreground-muted">
                ZeroAI is a product of <strong className="text-foreground-primary">Candela Labs Private Limited</strong>, a company incorporated under the laws of Singapore. References to "ZeroAI", "we", "us", or "our" in these terms refer to Candela Labs Private Limited.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="relative pb-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-bold text-foreground-primary mb-4">
                  {index + 1}. {section.title}
                </h2>
                <Card>
                  <ul className="space-y-4">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                        <span className="text-sm text-foreground-muted flex-grow">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}

            {/* Contact Section */}
            <div>
              <h2 className="text-xl font-bold text-foreground-primary mb-4">
                Questions About These Terms?
              </h2>
              <Card className="bg-gradient-to-br from-purple-600/10 to-purple-400/10 border-purple-400/20">
                <p className="text-sm text-foreground-muted mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="space-y-2 text-foreground-primary">
                  <p>
                    <strong>Company:</strong>{' '}
                    <span className="text-foreground-muted">Candela Labs Private Limited</span>
                  </p>
                  <p>
                    <strong>Address:</strong>{' '}
                    <span className="text-foreground-muted">105 The Octagon, #07-02 Cecil Street, Singapore</span>
                  </p>
                  <p>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:legal@zeroai.com" className="text-purple-200 hover:text-purple-100">
                      legal@zeroai.com
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

export default Terms;

