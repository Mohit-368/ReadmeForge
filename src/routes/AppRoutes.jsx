import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const LandingPage = lazy(() => import('../pages/Landing/LandingPage'));
const ReadmeMaker = lazy(() => import('../pages/ReadmeMaker/ReadmeMaker'));
const HowToUsePage = lazy(() => import('../pages/HowToUse/HowToUsePage'));
const CommunityShowcasePage = lazy(() => import('../pages/CommunityShowcase/CommunityShowcasePage'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="spin" style={{ width: 32, height: 32, borderWidth: 3 }} />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/readme-maker" element={<ReadmeMaker />} />
        <Route path="/how-to-use" element={<HowToUsePage />} />
        <Route path="/showcase" element={<CommunityShowcasePage />} />
      </Routes>
    </Suspense>
  );
}
