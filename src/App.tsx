// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
// import Index from "./pages/Index";
import Proyecto from './pages/Proyecto';
import Artesanas from './pages/Artesanas';
// import Proceso from "./pages/Proceso";
import Equipo from "./pages/Equipo";
// import Contacto from "./pages/Contacto";
// import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* <Toaster /> */}
      <Sonner />
      <Header />
      <Routes>
        {/* <Route path="/" element={<Index />} /> */}
        <Route path="/proyecto" element={<Proyecto />} />
        <Route path="/artesanas" element={<Artesanas />} />
        {/* <Route path="/proceso" element={<Proceso />} /> */}
        <Route path="/equipo" element={<Equipo />} />
        {/* <Route path="/contacto" element={<Contacto />} /> */}
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <Footer />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

// import { Header } from '@/components/Header';
// import { Footer } from '@/components/Footer';
// import {BrowserRouter, Routes, Route } from 'react-router';
// import Proyecto from "./pages/Proyecto";

// function App() {
//   return (
//     <>
//       <Header />
//       <Routes>
//         <Route path="/proyecto" element={<Proyecto />} />
//       </Routes>

//       <Footer />
//     </>
//   );
// }

// export default App;
