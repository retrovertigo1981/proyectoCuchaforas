import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {BrowserRouter, Routes, Route } from 'react-router';
import Proyecto from "./pages/Proyecto";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/proyecto" element={<Proyecto />} />
      </Routes>
      
      <Footer />
    </>
  );
}

export default App;
