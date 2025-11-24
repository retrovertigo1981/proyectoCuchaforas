import { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, Network } from 'lucide-react';
import { Constellation } from '@/components/Costellation';
import { ArtesanaModal } from '@/components/ArtesanaModal';
import { artesanas, disciplinas, regiones } from '@/data/artesanas';
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

  return (
    <div className="min-h-screen bg-background">
      <main className="">
        {/* Header with filters */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 sm:top-20 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* View toggles */}
              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('constellation')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'constellation'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Network className="w-4 h-4" />
                  Constelación
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

              {/* Filters */}
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
                  onChange={(e) => setSelectedRegion(e.target.value || null)}
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
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'constellation' ? (
          <Constellation />
        ) : (
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
                    <div className="aspect-square bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-6xl text-primary-foreground font-display">
                        {artesana.nombre.charAt(0)}
                      </span>
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
      </main>

      {selectedArtesana && viewMode === 'gallery' && (
        <ArtesanaModal
          artesana={selectedArtesana}
          onClose={() => setSelectedArtesana(null)}
        />
      )}
    </div>
  );
}
