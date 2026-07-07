import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchArtesanasFromApi } from '@/utils/artesanasApi';
import type { Artesana } from '@/data/artesanas';

interface UseArtesanasReturn {
  artesanas: Artesana[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  filteredArtesanas: (filters: {
    disciplina?: string | null;
    region?: string | null;
  }) => Artesana[];
  disciplinas: string[];
}

export const useArtesanas = (): UseArtesanasReturn => {
  const { data: artesanas = [], isLoading, error, refetch } = useQuery({
    queryKey: ['artesanas'],
    queryFn: fetchArtesanasFromApi,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const filteredArtesanas = useMemo(() => {
    return (filters: { disciplina?: string | null; region?: string | null }) => {
      return artesanas.filter((artesana) => {
        if (filters.disciplina && artesana.disciplina !== filters.disciplina) {
          return false;
        }
        if (filters.region && artesana.region !== filters.region) {
          return false;
        }
        return true;
      });
    };
  }, [artesanas]);

  const disciplinas = useMemo(() => {
    const set = new Set(artesanas.map(a => a.disciplina));
    return Array.from(set).sort();
  }, [artesanas]);

  return {
    artesanas,
    loading: isLoading,
    error: error ? 'Error al cargar las artesanas' : null,
    refetch: () => { refetch(); },
    filteredArtesanas,
    disciplinas,
  };
};
