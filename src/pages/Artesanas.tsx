import { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, Map, Network } from 'lucide-react';
import ConstellationMapImproved from '@/components/ConstellationMapImproved';
import { ArtesanaModal } from '@/components/ArtesanaModal';
import { regiones } from '@/data/artesanas';
import { useArtesanas } from '@/hooks/useArtesanas';
import type { Artesana } from '@/data/artesanas';

type ViewMode = 'constellation' | 'gallery';

export default function Artesanas() {
  const [viewMode, setViewMode] = useState<ViewMode>('constellation');
  const [selectedDisciplina, setSelectedDisciplina] = useState<string | null>(
    null
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedArtesana, setSelectedArtesana] = useState<Artesana | null>(
    null
  );

  // Usar el hook personalizado para manejo de datos
  const { artesanas, loading, error, disciplinas } = useArtesanas();

  // Filtrar artesanas (solo para la vista de galería)
  const filteredArtesanas = artesanas.filter((artesana) => {
    if (selectedDisciplina && artesana.disciplina !== selectedDisciplina)
      return false;
    if (selectedRegion && artesana.region !== selectedRegion) return false;
    return true;
  });

  const resetFilters = () => {
    setSelectedDisciplina(null);
    setSelectedRegion(null);
  };

  const disciplinaColors: Record<string, string> = {
    Cerámica: 'from-red-400 to-red-600',
    Textil: 'from-purple-400 to-purple-600',
    Madera: 'from-yellow-500 to-yellow-700',
    Cestería: 'from-orange-400 to-orange-600',
    Orfebrería: 'from-yellow-300 to-yellow-500',
    Tejido: 'from-indigo-400 to-indigo-600',
  };

  // Función para obtener un color aleatorio
  const getRandomColor = () => {
    const colors = Object.values(disciplinaColors);
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando artesanas...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Network className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Error al cargar</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Content - Only show when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Header con filtros - SOLO visible en modo galería */}
            <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 sm:top-20 z-40">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Toggles de vista */}
                  <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('constellation')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'constellation'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Map className="w-4 h-4" />
                      Cartografía
                    </button>
                    <button
                      onClick={() => setViewMode('gallery')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'gallery'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                      Galería
                    </button>
                  </div>

                  {/* Filtros - SOLO en vista galería */}
                  {viewMode === 'gallery' && (
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={selectedDisciplina || ''}
                        onChange={(e) =>
                          setSelectedDisciplina(e.target.value || null)
                        }
                        className="px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Todas las disciplinas</option>
                        {disciplinas.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedRegion || ''}
                        onChange={(e) =>
                          setSelectedRegion(e.target.value || null)
                        }
                        className="px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Todas las regiones</option>
                        {regiones.map((r) => (
                          <option key={r} value={r}>
                            Región {r}
                          </option>
                        ))}
                      </select>

                      {(selectedDisciplina || selectedRegion) && (
                        <button
                          onClick={resetFilters}
                          className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Limpiar filtros
                        </button>
                      )}

                      <span className="text-sm text-muted-foreground ml-2">
                        {filteredArtesanas.length} artesanas
                      </span>
                    </div>
                  )}

                  {/* Panel de filtros para modo constelación */}
                  {viewMode === 'constellation' && (
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={selectedDisciplina || ''}
                        onChange={(e) =>
                          setSelectedDisciplina(e.target.value || null)
                        }
                        className="px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Todas las disciplinas</option>
                        {disciplinas.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedRegion || ''}
                        onChange={(e) =>
                          setSelectedRegion(e.target.value || null)
                        }
                        className="px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Todas las regiones</option>
                        {regiones.map((r) => (
                          <option key={r} value={r}>
                            Región {r}
                          </option>
                        ))}
                      </select>

                      {(selectedDisciplina || selectedRegion) && (
                        <button
                          onClick={resetFilters}
                          className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Limpiar filtros
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contenido */}
            {viewMode === 'constellation' ? (
              // Modo Constelación - Pasamos los filtros como props
              <ConstellationMapImproved
                artesanas={artesanas}
                selectedDisciplina={selectedDisciplina}
                selectedRegion={selectedRegion}
              />
            ) : (
              // Modo Galería
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredArtesanas.map((artesana, index) => (
                    <motion.div
                      key={artesana.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedArtesana(artesana)}
                      className="group cursor-pointer"
                    >
                      <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        {/* Portrait placeholder */}
                        <div
                          className={`aspect-square bg-gradient-to-br ${
                            getRandomColor() || 'from-gray-400 to-gray-600'
                          } flex items-center justify-center`}
                        >
                          {artesana.imagenUrl ? (
                            <img
                              src={artesana.imagenUrl}
                              alt={artesana.nombre}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `<span class="text-6xl text-white font-display font-bold">${artesana.nombre.charAt(0)}</span>`;
                              }}
                            />
                          ) : (
                            <span className="text-6xl text-white font-display font-bold">
                              {artesana.nombre.charAt(0)}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                            {artesana.nombre}
                          </h3>
                          <p className="text-sm text-primary font-medium mb-2">
                            {artesana.disciplina}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Región {artesana.region}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal - Usando componente original */}
      {selectedArtesana && viewMode === 'gallery' && (
        <ArtesanaModal
          artesana={selectedArtesana}
          onClose={() => setSelectedArtesana(null)}
        />
      )}
    </div>
  );
}
