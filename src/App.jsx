import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollManager from './components/ScrollManager';
import { RouteProgressProvider, RouteProgressFallback } from './components/RouteProgress';
import { WebAuthProvider } from './context/WebAuthProvider';
import Home from './pages/Home';

const SlackLanding = lazy(() => import('./pages/SlackLanding'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Support = lazy(() => import('./pages/Support'));
const About = lazy(() => import('./pages/About'));
const Claim = lazy(() => import('./pages/Claim'));
const PartnerSuccess = lazy(() => import('./pages/PartnerSuccess'));
const PartnerSuccessDemo = lazy(() => import('./pages/PartnerSuccessDemo'));
const NotFound = lazy(() => import('./pages/NotFound'));
const OnboardOAuthCallback = lazy(() => import('./pages/OnboardOAuthCallback'));
const OnboardOAuthError = lazy(() => import('./pages/OnboardOAuthError'));
const Onboard = lazy(() => import('./pages/Onboard'));
const SlackOpenTest = lazy(() => import('./pages/SlackOpenTest'));

function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col dark">
      <Navbar />
      <main className="grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <WebAuthProvider>
        <ScrollManager />
        <RouteProgressProvider>
          <Suspense fallback={<RouteProgressFallback />}>
            <Routes>
              <Route path="/onboard/oauth/callback" element={<OnboardOAuthCallback />} />
              <Route path="/onboard/oauth/error" element={<OnboardOAuthError />} />
              <Route path="/onboard/slack-open-test" element={<SlackOpenTest />} />
              <Route path="/onboard" element={<Onboard />} />
              <Route path="/" element={<Home />} />
              <Route element={<SiteLayout />}>
                <Route path="/slack" element={<SlackLanding />} />
                <Route path="/support" element={<Support />} />
                <Route path="/claim" element={<Claim />} />
                <Route path="/partner/success/demo" element={<PartnerSuccessDemo />} />
                <Route path="/partner/success" element={<PartnerSuccess />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </RouteProgressProvider>
      </WebAuthProvider>
    </Router>
  );
}

export default App;
