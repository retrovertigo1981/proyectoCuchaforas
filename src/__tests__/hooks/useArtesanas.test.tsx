import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useArtesanas } from '@/hooks/useArtesanas';
import type { Artesana } from '@/data/artesanas';
import type { ReactNode } from 'react';

vi.mock('@/utils/artesanasApi', () => ({
  fetchArtesanasFromApi: vi.fn(),
}));

import { fetchArtesanasFromApi } from '@/utils/artesanasApi';

const mockFetchArtesanasFromApi = vi.mocked(fetchArtesanasFromApi);

const mockArtesanas: Artesana[] = [
  {
    id: '1',
    nombre: 'María Ejemplo',
    disciplina: 'Cerámica',
    region: 'Central',
    biografia: 'Biografía de María',
    posicion: { x: 10, y: 20 },
  },
  {
    id: '2',
    nombre: 'Juan Test',
    disciplina: 'Textil',
    region: 'Sur',
    biografia: 'Biografía de Juan',
    posicion: { x: 30, y: 40 },
  },
  {
    id: '3',
    nombre: 'Ana Demo',
    disciplina: 'Cerámica',
    region: 'Norte',
    biografia: 'Biografía de Ana',
    posicion: { x: 50, y: 60 },
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe('useArtesanas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockFetchArtesanasFromApi.mockImplementation(
      () => new Promise(() => {}) // Promise que nunca se resuelve
    );

    const { result } = renderHook(() => useArtesanas(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.artesanas).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should return artesanas after successful fetch', async () => {
    mockFetchArtesanasFromApi.mockResolvedValue(mockArtesanas);

    const { result } = renderHook(() => useArtesanas(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.artesanas).toEqual(mockArtesanas);
    expect(result.current.error).toBe(null);
  });

  it('should return error state when fetch fails', async () => {
    mockFetchArtesanasFromApi.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useArtesanas(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error al cargar las artesanas');
    expect(result.current.artesanas).toEqual([]);
  });

  it('should filter artesanas by disciplina', async () => {
    mockFetchArtesanasFromApi.mockResolvedValue(mockArtesanas);

    const { result } = renderHook(() => useArtesanas(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const filtered = result.current.filteredArtesanas({ disciplina: 'Cerámica' });
    expect(filtered).toHaveLength(2);
    expect(filtered[0].nombre).toBe('María Ejemplo');
    expect(filtered[1].nombre).toBe('Ana Demo');
  });

  it('should filter artesanas by region', async () => {
    mockFetchArtesanasFromApi.mockResolvedValue(mockArtesanas);

    const { result } = renderHook(() => useArtesanas(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const filtered = result.current.filteredArtesanas({ region: 'Sur' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].nombre).toBe('Juan Test');
  });

  it('should filter artesanas by multiple criteria', async () => {
    mockFetchArtesanasFromApi.mockResolvedValue(mockArtesanas);

    const { result } = renderHook(() => useArtesanas(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const filtered = result.current.filteredArtesanas({
      disciplina: 'Cerámica',
      region: 'Central',
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].nombre).toBe('María Ejemplo');
  });

  it('should return all artesanas when no filters applied', async () => {
    mockFetchArtesanasFromApi.mockResolvedValue(mockArtesanas);

    const { result } = renderHook(() => useArtesanas(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const filtered = result.current.filteredArtesanas({});
    expect(filtered).toHaveLength(3);
  });

  it('should extract unique disciplinas sorted alphabetically', async () => {
    mockFetchArtesanasFromApi.mockResolvedValue(mockArtesanas);

    const { result } = renderHook(() => useArtesanas(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.disciplinas).toEqual(['Cerámica', 'Textil']);
  });

  it('should provide refetch function', async () => {
    mockFetchArtesanasFromApi.mockResolvedValue(mockArtesanas);

    const { result } = renderHook(() => useArtesanas(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');
  });
});
