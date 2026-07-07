import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router';
import { Footer } from '@/components/Footer';

describe('Footer', () => {
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
  };

  it('should render footer element', () => {
    renderWithRouter();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should render "Explora" heading', () => {
    renderWithRouter();
    expect(screen.getByText('Explora')).toBeInTheDocument();
  });

  it('should render all navigation links', () => {
    renderWithRouter();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('El Proyecto')).toBeInTheDocument();
    expect(screen.getByText('Las Creadoras')).toBeInTheDocument();
    expect(screen.getByText('Quiénes Somos')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  it('should render navigation links with correct hrefs', () => {
    renderWithRouter();
    
    const inicioLink = screen.getByText('Inicio').closest('a');
    expect(inicioLink).toHaveAttribute('href', '/');
    
    const proyectoLink = screen.getByText('El Proyecto').closest('a');
    expect(proyectoLink).toHaveAttribute('href', '/proyecto');
    
    const creadorasLink = screen.getByText('Las Creadoras').closest('a');
    expect(creadorasLink).toHaveAttribute('href', '/creadoras');
    
    const equipoLink = screen.getByText('Quiénes Somos').closest('a');
    expect(equipoLink).toHaveAttribute('href', '/equipo');
    
    const contactoLink = screen.getByText('Contacto').closest('a');
    expect(contactoLink).toHaveAttribute('href', '/contacto');
  });

  it('should render Cuchaforas logo', () => {
    renderWithRouter();
    const logo = screen.getByAltText('Logo Cuchaforas');
    expect(logo).toBeInTheDocument();
    expect(logo.tagName).toBe('IMG');
  });

  it('should render mission text', () => {
    renderWithRouter();
    expect(
      screen.getByText(/Preservando la artesanía chilena/)
    ).toBeInTheDocument();
  });

  it('should render "Proyecto financiado por" text', () => {
    renderWithRouter();
    expect(screen.getByText('Proyecto financiado por')).toBeInTheDocument();
  });

  it('should render MCAP logo', () => {
    renderWithRouter();
    const mcapLogo = screen.getByAltText(/Ministerio de las Culturas/);
    expect(mcapLogo).toBeInTheDocument();
  });

  it('should render Fondart credits', () => {
    renderWithRouter();
    expect(screen.getByText('Fondart 2025, Línea Artesanía')).toBeInTheDocument();
    expect(
      screen.getByText('Ministerio de las Culturas, las Artes y el Patrimonio')
    ).toBeInTheDocument();
    expect(screen.getByText('Gobierno de Chile')).toBeInTheDocument();
  });

  it('should render copyright with current year', () => {
    renderWithRouter();
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Cuchaforas. Todos los derechos reservados.`)
    ).toBeInTheDocument();
  });

  it('should have logo link to home', () => {
    renderWithRouter();
    const logo = screen.getByAltText('Logo Cuchaforas');
    const logoLink = logo.closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });
});
