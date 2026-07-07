import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router';
import { Suspense, lazy } from 'react';
import Inicio from '@/pages/Inicio';

const Proyecto = lazy(() => import('@/pages/Proyecto'));
const Artesanas = lazy(() => import('@/pages/Artesanas'));
const ArtesanaDetailPage = lazy(() => import('@/pages/ArtesanaDetailPage'));
const Equipo = lazy(() => import('@/pages/Equipo'));
const Contacto = lazy(() => import('@/pages/Contacto'));

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
      <Sonner />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/proyecto" element={<Suspense fallback={<LoadingFallback />}><Proyecto /></Suspense>} />
        <Route path="/creadoras" element={<Suspense fallback={<LoadingFallback />}><Artesanas /></Suspense>} />
        <Route path="/creadoras/:id" element={<Suspense fallback={<LoadingFallback />}><ArtesanaDetailPage /></Suspense>} />
        <Route path="/equipo" element={<Suspense fallback={<LoadingFallback />}><Equipo /></Suspense>} />
        <Route path="/contacto" element={<Suspense fallback={<LoadingFallback />}><Contacto /></Suspense>} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
