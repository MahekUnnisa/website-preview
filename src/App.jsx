import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

// Home stays in the entry bundle — it is the landing route, so lazy-loading it
// would cost an extra round trip before first paint. Every other page is split
// into its own chunk and fetched on navigation.
const SlackLanding = lazy(() => import('./pages/SlackLanding'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Support = lazy(() => import('./pages/Support'));
const About = lazy(() => import('./pages/About'));
const Claim = lazy(() => import('./pages/Claim'));
const PartnerSuccess = lazy(() => import('./pages/PartnerSuccess'));
const PartnerSuccessDemo = lazy(() => import('./pages/PartnerSuccessDemo'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Holds the viewport height while a page chunk loads so the footer does not jump.
const PageFallback = () => <div className="min-h-[60vh]" aria-busy="true" />;

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col dark">
        <Navbar />
        <main className="flex-grow pt-16">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/slack" element={<SlackLanding />} />
              <Route path="/support" element={<Support />} />
              <Route path="/claim" element={<Claim />} />
              <Route path="/partner/success/demo" element={<PartnerSuccessDemo />} />
              <Route path="/partner/success" element={<PartnerSuccess />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
