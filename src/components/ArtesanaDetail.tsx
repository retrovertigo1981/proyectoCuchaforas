import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin, Star } from 'lucide-react';
import { fetchCompleteArtesanaData } from '@/utils/artesanasApi';

interface CompleteArtesanaData {
  id: string;
  nombre: string;
  email: string;
  region: string;
  comuna: string;
  telefono: string;
  disciplina: string;
  historia: string;
  motivacion: string;
  imagenPerfil: string;
  imagenesTrabajo: string[];
}

interface ArtesanaDetailProps {
  artesanaId: string;
  onBack: () => void;
}

export const ArtesanaDetail = ({ artesanaId, onBack }: ArtesanaDetailProps) => {
  const [artesanaData, setArtesanaData] = useState<CompleteArtesanaData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArtesanaData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCompleteArtesanaData(artesanaId);
        if (data) {
          setArtesanaData(data);
        } else {
          setError('No se pudo cargar la información de la artesana');
        }
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error loading artesana data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (artesanaId) {
      loadArtesanaData();
    }
  }, [artesanaId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl shadow-2xl p-8 text-center"
        >
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando información...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !artesanaData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl shadow-2xl p-8 text-center max-w-md"
        >
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p className="text-muted-foreground mb-6">
            {error || 'No se encontró la artesana'}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Volver
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-md"
        onClick={onBack}
      />

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-4xl bg-card rounded-2xl shadow-2xl texture-grain overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with back button */}
          <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b">
            <div className="flex items-center justify-between p-4 sm:p-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>
              <div className="text-center">
                <h1 className="text-lg sm:text-xl font-display font-bold">
                  {artesanaData.nombre}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {artesanaData.disciplina}
                </p>
              </div>
              <div className="w-20" /> {/* Spacer for centering */}
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-8">
            {/* Profile Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Image and Basic Info */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent">
                    {artesanaData.imagenPerfil ? (
                      <img
                        src={artesanaData.imagenPerfil}
                        alt={artesanaData.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<span class="text-white text-4xl font-display flex items-center justify-center h-full">${artesanaData.nombre.charAt(0)}</span>`;
                        }}
                      />
                    ) : (
                      <span className="text-white text-4xl font-display flex items-center justify-center h-full">
                        {artesanaData.nombre.charAt(0)}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-display font-bold mb-2">
                    {artesanaData.nombre}
                  </h2>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{artesanaData.region}</span>
                    </div>

                    {artesanaData.comuna && (
                      <div className="flex items-center justify-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{artesanaData.comuna}</span>
                      </div>
                    )}

                    {artesanaData.telefono && (
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{artesanaData.telefono}</span>
                      </div>
                    )}

                    {artesanaData.email && (
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="break-all">{artesanaData.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Story and Motivation */}
              <div className="lg:col-span-2 space-y-6">
                {artesanaData.historia && (
                  <div className="bg-background rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
                      Historia y Vivencia
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {artesanaData.historia}
                    </p>
                  </div>
                )}

                {artesanaData.motivacion && (
                  <div className="bg-background rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
                      Motivación para Participar
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {artesanaData.motivacion}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Work Images */}
            {artesanaData.imagenesTrabajo.length > 0 && (
              <div className="bg-background rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-6 text-center">
                  Trabajos Representativos
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {artesanaData.imagenesTrabajo.map((imagen, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50"
                    >
                      <img
                        src={imagen}
                        alt={`Trabajo ${index + 1} de ${artesanaData.nombre}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src =
                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
