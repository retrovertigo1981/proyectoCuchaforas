import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import NotFound from '@/pages/NotFound';

describe('NotFound', () => {
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
  };

  it('should render 404 heading', () => {
    renderWithRouter();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render "Página no encontrada" message', () => {
    renderWithRouter();
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
  });

  it('should render description text', () => {
    renderWithRouter();
    expect(
      screen.getByText(/Lo sentimos, la página que buscas no existe/)
    ).toBeInTheDocument();
  });

  it('should render "Volver al inicio" link', () => {
    renderWithRouter();
    const link = screen.getByText('Volver al inicio');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });

  it('should render "Página anterior" button', () => {
    renderWithRouter();
    const button = screen.getByText('Página anterior');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should call window.history.back when "Página anterior" is clicked', () => {
    const backMock = vi.fn();
    window.history.back = backMock;

    renderWithRouter();
    const button = screen.getByText('Página anterior');
    button.click();

    expect(backMock).toHaveBeenCalled();
  });

  it('should render decorative dots', () => {
    const { container } = renderWithRouter();
    const dots = container.querySelectorAll('.rounded-full');
    expect(dots.length).toBeGreaterThan(0);
  });
});
