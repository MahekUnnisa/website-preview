import React from 'react';
import Card from '../components/Card';

const Privacy = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us.',
        'Personal information may include your name, email address, phone number, and payment information.',
        'We automatically collect certain information about your device and how you interact with our services, including IP address, browser type, and usage data.',
      ],
    },
    {
      title: 'How We Use Your Information',
      content: [
        'To provide, maintain, and improve our services',
        'To process transactions and send related information',
        'To send you technical notices, updates, security alerts, and support messages',
        'To respond to your comments, questions, and customer service requests',
        'To monitor and analyze trends, usage, and activities in connection with our services',
      ],
    },
    {
      title: 'Information Sharing and Disclosure',
      content: [
        'We do not share your personal information with third parties except as described in this policy.',
        'We may share information with vendors, consultants, and other service providers who need access to perform work on our behalf.',
        'We may disclose information if required by law or if we believe it\'s necessary to protect our rights or the rights of others.',
      ],
    },
    {
      title: 'Data Security',
      content: [
        'We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.',
        'We use industry-standard encryption protocols to protect data in transit and at rest.',
        'However, no security system is impenetrable, and we cannot guarantee the absolute security of our systems.',
      ],
    },
    {
      title: 'Your Rights and Choices',
      content: [
        'You can access, update, or delete your account information at any time through your account settings.',
        'You can opt out of receiving promotional communications by following the instructions in those messages.',
        'You may request that we delete your personal information, subject to certain exceptions prescribed by law.',
      ],
    },
    {
      title: 'Cookies and Tracking Technologies',
      content: [
        'We use cookies and similar tracking technologies to collect and track information about your use of our services.',
        'You can control cookies through your browser settings and other tools.',
        'Some features of our services may not function properly if you disable cookies.',
      ],
    },
    {
      title: 'Children\'s Privacy',
      content: [
        'Our services are not intended for children under the age of 13.',
        'We do not knowingly collect personal information from children under 13.',
        'If we learn we have collected information from a child under 13, we will delete that information promptly.',
      ],
    },
    {
      title: 'WhatsApp Business Messaging',
      content: [
        'ZeroAI may communicate with you via WhatsApp Business messaging operated by Candela Labs Private Limited through the WhatsApp Business API.',
        'By providing your WhatsApp number and explicitly opting in, you consent to receive transactional messages, product updates, and support communications from ZeroAI via WhatsApp.',
        'You may opt out of WhatsApp messages at any time by replying "STOP" to any message, or by contacting us at support@zeroai.co.in. Opt-out requests are processed within 24 hours.',
        'We do not use WhatsApp to send promotional or marketing messages without your explicit prior consent.',
        'All WhatsApp communications are conducted in accordance with Meta\'s WhatsApp Business Policy and applicable data protection laws.',
      ],
    },
    {
      title: 'Changes to This Policy',
      content: [
        'We may update this privacy policy from time to time.',
        'We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.',
        'Your continued use of our services after changes become effective constitutes acceptance of the updated policy.',
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
              <span className="text-foreground-primary">Privacy </span>
              <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-sm text-foreground-muted mb-6">
              Last Updated: November 4, 2025
            </p>
            <Card className="bg-purple-15 border-border-colored">
              <p className="text-sm text-foreground-muted mb-3">
                At ZeroAI, we take your privacy seriously. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our Chrome extension and services.
                Please read this policy carefully to understand our practices regarding your personal data.
              </p>
              <p className="text-sm text-foreground-muted">
                ZeroAI is a product of <strong className="text-foreground-primary">Candela Labs Private Limited</strong>, a company incorporated under the laws of Singapore.
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
                Contact Us
              </h2>
              <Card className="bg-gradient-to-br from-purple-600/10 to-purple-400/10 border-purple-400/20">
                <p className="text-sm text-foreground-muted mb-4">
                  If you have any questions or concerns about this Privacy Policy or our data practices, 
                  please contact us at:
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
                    <a href="mailto:privacy@zeroai.com" className="text-purple-200 hover:text-purple-100">
                      privacy@zeroai.com
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

export default Privacy;

