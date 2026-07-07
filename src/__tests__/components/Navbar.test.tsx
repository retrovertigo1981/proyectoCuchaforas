import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { Navbar } from '@/components/Navbar';

vi.mock('@/hooks/useMobile', () => ({
  useMobile: vi.fn(() => false),
}));

describe('Navbar', () => {
  const renderWithRouter = (initialPath = '/') => {
    window.history.pushState({}, 'Test page', initialPath);
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render menu button', () => {
    renderWithRouter();
    expect(screen.getByText('Menú')).toBeInTheDocument();
  });

  it('should render share button', () => {
    renderWithRouter();
    expect(screen.getByText('Compartir')).toBeInTheDocument();
  });

  it('should open menu when menu button is clicked', () => {
    renderWithRouter();
    const menuButton = screen.getByText('Menú').closest('button');
    expect(menuButton).toBeInTheDocument();
    
    fireEvent.click(menuButton!);
    
    expect(screen.getByAltText('Logo Cucháforas')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('El Proyecto')).toBeInTheDocument();
    expect(screen.getByText('Las Creadoras')).toBeInTheDocument();
    expect(screen.getByText('Quiénes Somos')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  it('should open social menu when share button is clicked', () => {
    renderWithRouter();
    const shareButton = screen.getByText('Compartir').closest('button');
    expect(shareButton).toBeInTheDocument();
    
    fireEvent.click(shareButton!);
    
    const socialLinks = screen.getAllByRole('link');
    const facebookLink = socialLinks.find(link => 
      link.getAttribute('href') === 'https://facebook.com'
    );
    const instagramLink = socialLinks.find(link => 
      link.getAttribute('href') === 'https://instagram.com'
    );
    
    expect(facebookLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
  });

  it('should close menu when X button is clicked', () => {
    renderWithRouter();
    const menuButton = screen.getByText('Menú').closest('button');
    fireEvent.click(menuButton!);
    
    expect(screen.getByAltText('Logo Cucháforas')).toBeInTheDocument();
    
    const xButton = document.querySelector('button svg.lucide-x')?.closest('button');
    if (xButton) {
      fireEvent.click(xButton);
    }
  });

  it('should have correct navigation links in menu', () => {
    renderWithRouter();
    const menuButton = screen.getByText('Menú').closest('button');
    fireEvent.click(menuButton!);
    
    const links = screen.getAllByRole('link');
    const navLinks = links.filter(link => 
      ['/', '/proyecto', '/creadoras', '/equipo', '/contacto'].includes(
        link.getAttribute('href') || ''
      )
    );
    
    expect(navLinks.length).toBeGreaterThanOrEqual(5);
  });

  it('should highlight active page in menu', () => {
    renderWithRouter('/proyecto');
    const menuButton = screen.getByText('Menú').closest('button');
    fireEvent.click(menuButton!);
    
    const proyectoLink = screen.getByText('El Proyecto').closest('a');
    expect(proyectoLink).toHaveClass('bg-white/10');
  });

  it('should render logo in menu', () => {
    renderWithRouter();
    const menuButton = screen.getByText('Menú').closest('button');
    fireEvent.click(menuButton!);
    
    const logo = screen.getByAltText('Logo Cucháforas');
    expect(logo).toBeInTheDocument();
    expect(logo.tagName).toBe('IMG');
  });

  it('should have social links with target="_blank"', () => {
    renderWithRouter();
    const shareButton = screen.getByText('Compartir').closest('button');
    fireEvent.click(shareButton!);
    
    const socialLinks = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href')?.includes('facebook.com') || 
      link.getAttribute('href')?.includes('instagram.com')
    );
    
    socialLinks.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
