import { useState, useEffect, useMemo } from 'react';
import { getCachedArtesanas, clearArtesanasCache } from '@/utils/artesanasApi';
import type { Artesana } from '@/data/artesanas';

interface UseArtesanasReturn {
  artesanas: Artesana[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filteredArtesanas: (filters: {
    disciplina?: string | null;
    region?: string | null;
  }) => Artesana[];
  clearCache: () => void;
  disciplinas: string[];
}

export const useArtesanas = (): UseArtesanasReturn => {
  const [artesanas, setArtesanas] = useState<Artesana[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArtesanas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCachedArtesanas();
      setArtesanas(data);
    } catch (err) {
      console.error('Error loading artesanas:', err);
      setError('Error al cargar las artesanas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtesanas();
  }, []);

  // Función para refetch manual
  const refetch = async () => {
    await loadArtesanas();
  };

  // Función memoizada para filtrar artesanas
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

  // Disciplinas únicas extraídas de las artesanas
  const disciplinas = useMemo(() => {
    const set = new Set(artesanas.map(a => a.disciplina));
    return Array.from(set).sort();
  }, [artesanas]);

  // Función para limpiar cache
  const clearCache = () => {
    clearArtesanasCache();
  };

  return {
    artesanas,
    loading,
    error,
    refetch,
    filteredArtesanas,
    clearCache,
    disciplinas,
  };
};
