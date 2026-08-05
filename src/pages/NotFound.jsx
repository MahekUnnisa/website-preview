import React from 'react';
import { Link } from 'react-router';
import Card from '../components/Card';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="relative mt-20">
      <div className="fixed inset-0 grid-overlay pointer-events-none" />

      <section className="relative min-h-[70vh] flex items-center">
        <div className="container-custom w-full">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-foreground-primary mb-2">
              404
            </h1>
            <p className="text-xl text-foreground-muted mb-6">
              Page not found
            </p>
            <Card className="bg-background-tertiary border-border mb-8">
              <p className="text-sm text-foreground-muted mb-6">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <Link to="/">
                <Button variant="primary" size="lg">
                  Back to Home
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
