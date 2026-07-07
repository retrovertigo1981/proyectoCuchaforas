import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ArtesanaDetail } from '@/components/ArtesanaDetail';
import * as artesanasApi from '@/utils/artesanasApi';

vi.mock('@/utils/artesanasApi', () => ({
  fetchCompleteArtesanaData: vi.fn(),
}));

const mockFetchCompleteArtesanaData = vi.mocked(artesanasApi.fetchCompleteArtesanaData);

describe('ArtesanaDetail', () => {
  const mockOnBack = vi.fn();
  const mockArtesanaData = {
    id: '1',
    nombre: 'María Ejemplo',
    email: 'maria@example.com',
    region: 'Región Metropolitana',
    comuna: 'Santiago',
    telefono: '+56912345678',
    disciplina: 'Cerámica',
    historia: 'Historia de María con su arte',
    motivacion: 'Motivación de María para participar',
    imagenPerfil: 'https://example.com/maria.jpg',
    imagenesTrabajo: [
      'https://example.com/trabajo1.jpg',
      'https://example.com/trabajo2.jpg',
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    mockFetchCompleteArtesanaData.mockImplementation(
      () => new Promise(() => {}) // Promise que nunca se resuelve
    );

    render(<ArtesanaDetail artesanaId="1" onBack={mockOnBack} />);

    expect(screen.getByText('Cargando información...')).toBeInTheDocument();
  });

  it('should show error state when fetch fails', async () => {
    mockFetchCompleteArtesanaData.mockRejectedValue(new Error('API Error'));

    render(<ArtesanaDetail artesanaId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('Error al cargar los datos')).toBeInTheDocument();
    expect(screen.getByText('Volver')).toBeInTheDocument();
  });

  it('should show error state when data is null', async () => {
    mockFetchCompleteArtesanaData.mockResolvedValue(null);

    render(<ArtesanaDetail artesanaId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('No se pudo cargar la información de la artesana')).toBeInTheDocument();
  });

  it('should show artesana data when fetch succeeds', async () => {
    mockFetchCompleteArtesanaData.mockResolvedValue(mockArtesanaData);

    render(<ArtesanaDetail artesanaId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getAllByText('María Ejemplo').length).toBeGreaterThan(0);
    });

    expect(screen.getByText('Cerámica')).toBeInTheDocument();
    expect(screen.getByText('Región Metropolitana')).toBeInTheDocument();
    expect(screen.getByText('Santiago')).toBeInTheDocument();
    expect(screen.getByText('+56912345678')).toBeInTheDocument();
    expect(screen.getByText('maria@example.com')).toBeInTheDocument();
    expect(screen.getByText('Historia de María con su arte')).toBeInTheDocument();
    expect(screen.getByText('Motivación de María para participar')).toBeInTheDocument();
  });

  it('should call onBack when "Volver" button is clicked in error state', async () => {
    mockFetchCompleteArtesanaData.mockRejectedValue(new Error('API Error'));

    render(<ArtesanaDetail artesanaId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('Volver')).toBeInTheDocument();
    });

    const backButton = screen.getByText('Volver');
    backButton.click();

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('should call onBack when "Volver" button is clicked in success state', async () => {
    mockFetchCompleteArtesanaData.mockResolvedValue(mockArtesanaData);

    render(<ArtesanaDetail artesanaId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getAllByText('María Ejemplo').length).toBeGreaterThan(0);
    });

    const backButton = screen.getByText('Volver');
    backButton.click();

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('should render profile image when available', async () => {
    mockFetchCompleteArtesanaData.mockResolvedValue(mockArtesanaData);

    render(<ArtesanaDetail artesanaId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      const profileImage = screen.getByAltText('María Ejemplo');
      expect(profileImage).toBeInTheDocument();
      expect(profileImage).toHaveAttribute('src', 'https://example.com/maria.jpg');
    });
  });

  it('should render work images when available', async () => {
    mockFetchCompleteArtesanaData.mockResolvedValue(mockArtesanaData);

    render(<ArtesanaDetail artesanaId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('Trabajos Representativos')).toBeInTheDocument();
    });

    const workImage1 = screen.getByAltText('Trabajo 1 de María Ejemplo');
    const workImage2 = screen.getByAltText('Trabajo 2 de María Ejemplo');

    expect(workImage1).toBeInTheDocument();
    expect(workImage1).toHaveAttribute('src', 'https://example.com/trabajo1.jpg');

    expect(workImage2).toBeInTheDocument();
    expect(workImage2).toHaveAttribute('src', 'https://example.com/trabajo2.jpg');
  });

  it('should not render work images section when no images available', async () => {
    const dataWithoutImages = {
      ...mockArtesanaData,
      imagenesTrabajo: [],
    };

    mockFetchCompleteArtesanaData.mockResolvedValue(dataWithoutImages);

    render(<ArtesanaDetail artesanaId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getAllByText('María Ejemplo').length).toBeGreaterThan(0);
    });

    expect(screen.queryByText('Trabajos Representativos')).not.toBeInTheDocument();
  });

  it('should not render historia section when not available', async () => {
    const dataWithoutHistoria = {
      ...mockArtesanaData,
      historia: '',
    };

    mockFetchCompleteArtesanaData.mockResolvedValue(dataWithoutHistoria);

    render(<ArtesanaDetail artesanaId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getAllByText('María Ejemplo').length).toBeGreaterThan(0);
    });

    expect(screen.queryByText('Historia y Vivencia')).not.toBeInTheDocument();
  });

  it('should not render motivacion section when not available', async () => {
    const dataWithoutMotivacion = {
      ...mockArtesanaData,
      motivacion: '',
    };

    mockFetchCompleteArtesanaData.mockResolvedValue(dataWithoutMotivacion);

    render(<ArtesanaDetail artesanaId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getAllByText('María Ejemplo').length).toBeGreaterThan(0);
    });

    expect(screen.queryByText('Motivación para Participar')).not.toBeInTheDocument();
  });

  it('should show first letter of name when no profile image', async () => {
    const dataWithoutImage = {
      ...mockArtesanaData,
      imagenPerfil: '',
    };

    mockFetchCompleteArtesanaData.mockResolvedValue(dataWithoutImage);

    render(<ArtesanaDetail artesanaId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('M')).toBeInTheDocument();
    });
  });

  it('should fetch data for the correct artesanaId', async () => {
    mockFetchCompleteArtesanaData.mockResolvedValue(mockArtesanaData);

    render(<ArtesanaDetail artesanaId="123" onBack={mockOnBack} />);

    expect(mockFetchCompleteArtesanaData).toHaveBeenCalledWith('123');
  });
});
