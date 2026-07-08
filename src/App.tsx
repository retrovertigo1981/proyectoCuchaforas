import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router';
import { Suspense, lazy } from 'react';
import Inicio from '@/pages/Inicio';
import { LoadingScreen } from '@/components/LoadingScreen';

const Proyecto = lazy(() => import('@/pages/Proyecto'));
const Proceso = lazy(() => import('@/pages/Proceso'));
const Artesanas = lazy(() => import('@/pages/Artesanas'));
const ArtesanaDetailPage = lazy(() => import('@/pages/ArtesanaDetailPage'));
const Equipo = lazy(() => import('@/pages/Equipo'));
const Contacto = lazy(() => import('@/pages/Contacto'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
      <p className="text-muted-foreground text-sm">Cargando...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LoadingScreen />
      <Sonner />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none"
      >
        Saltar al contenido principal
      </a>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/proyecto" element={<Suspense fallback={<LoadingFallback />}><Proyecto /></Suspense>} />
        <Route path="/proceso" element={<Suspense fallback={<LoadingFallback />}><Proceso /></Suspense>} />
        <Route path="/creadoras" element={<Suspense fallback={<LoadingFallback />}><Artesanas /></Suspense>} />
        <Route path="/creadoras/:id" element={<Suspense fallback={<LoadingFallback />}><ArtesanaDetailPage /></Suspense>} />
        <Route path="/equipo" element={<Suspense fallback={<LoadingFallback />}><Equipo /></Suspense>} />
        <Route path="/contacto" element={<Suspense fallback={<LoadingFallback />}><Contacto /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
