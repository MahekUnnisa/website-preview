import React from 'react';
import Card from '../components/Card';
import { Link } from 'react-router';

const About = () => {
  return (
    <div className="relative">
      <div className="fixed inset-0 grid-overlay pointer-events-none" />

      {/* Hero Section */}
      <section className="relative py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground-primary">About </span>
              <span className="gradient-text">Candela Labs</span>
            </h1>
            <p className="text-sm text-foreground-muted mb-6">
              Building digital media platforms for the next generation
            </p>
            <Card className="bg-purple-15 border-border-colored">
              <p className="text-sm text-foreground-muted">
                Candela Labs Private Limited is a technology and digital media company building platforms
                that inform, educate, and empower audiences globally. We develop products that combine
                AI-powered intelligence with intuitive design to help people work smarter and stay better informed.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Details + ZeroAI Attribution */}
      <section className="relative pb-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8">

            <div>
              <h2 className="text-xl font-bold text-foreground-primary mb-4">Company Information</h2>
              <Card>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-foreground-muted">
                  <div>
                    <p className="text-foreground-primary font-semibold mb-1">Registered Name</p>
                    <p>Candela Labs Private Limited</p>
                  </div>
                  <div>
                    <p className="text-foreground-primary font-semibold mb-1">Incorporated In</p>
                    <p>Singapore</p>
                  </div>
                  <div>
                    <p className="text-foreground-primary font-semibold mb-1">Registered Address</p>
                    <p>105 The Octagon, #07-02 Cecil Street, Singapore</p>
                  </div>
                  <div>
                    <p className="text-foreground-primary font-semibold mb-1">Contact Email</p>
                    <a href="mailto:legal@devbytes.co.in" className="text-purple-200 hover:text-purple-100">
                      legal@devbytes.co.in
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground-primary mb-4">About ZeroAI</h2>
              <Card className="bg-linear-to-br from-purple-600/10 to-purple-400/10 border-purple-400/20">
                <p className="text-sm text-foreground-muted mb-3">
                  <strong className="text-foreground-primary">ZeroAI</strong> is a product developed and operated by{' '}
                  <strong className="text-foreground-primary">Candela Labs Private Limited</strong>. All services,
                  communications (including WhatsApp Business messaging), and support provided under the ZeroAI
                  brand are the responsibility of Candela Labs Private Limited.
                </p>
                <p className="text-sm text-foreground-muted">
                  For any questions about ZeroAI, please refer to our{' '}
                  <Link to="/privacy" className="text-purple-200 hover:text-purple-100">Privacy Policy</Link>,{' '}
                  <Link to="/terms" className="text-purple-200 hover:text-purple-100">Terms of Service</Link>, or{' '}
                  <Link to="/support" className="text-purple-200 hover:text-purple-100">Support Center</Link>.
                </p>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
