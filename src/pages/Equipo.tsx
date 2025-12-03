import { motion } from 'framer-motion';

const equipo = [
  {
    id: 1,
    nombre: 'Camila Rojas Contardo',
    rol: 'Responsable del proyecto, Artesana, Dirección de Arte',
    bio: '',
    inicial: 'C',
  },
  {
    id: 2,
    nombre: 'Isabel Margarita Zambelli Matta',
    rol: 'Curaduría de la obra y relato de Cartografía Artística Digital',
    bio: '',
    inicial: 'I',
  },
  {
    id: 3,
    nombre: 'Camila Moraga y Natalia Lozano',
    rol: 'Calisma: Diseño imagen y piezas gráficas, Cartografía Artística Digital y comunicaciones',
    bio: '',
    inicial: 'C',
  },
  {
    id: 4,
    nombre: 'Alfredo Méndez',
    rol: 'Fotografía',
    bio: '',
    inicial: 'A',
  },
  {
    id: 5,
    nombre: 'Alex Daniel Barril Saldivia',
    rol: 'Gestor de participación y comunicaciones',
    bio: '',
    inicial: 'A',
  },
  {
    id: 6,
    nombre: 'Alejandro Cofré',
    rol: 'Desarrollo web y soporte técnico',
    bio: '',
    inicial: 'A',
  },
  {
    id: 7,
    nombre: 'Sebastián Peña',
    rol: 'Desarrollo web y soporte técnico',
    bio: '',
    inicial: 'S',
  },
];

export default function Equipo() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 sm:pt-24">
        {/* Hero */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6"
          >
            Quiénes Somos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Un equipo interdisciplinario unido por la pasión de tejer redes y
            honrar historias
          </motion.p>
        </section>

        {/* Team grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {equipo.map((miembro, index) => (
              <motion.div
                key={miembro.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Portrait */}
                  <div className="mb-6 relative">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <span className="text-5xl sm:text-6xl font-display font-bold text-primary-foreground">
                        {miembro.inicial}
                      </span>
                    </div>
                    {/* Decorative circle */}
                    <div className="absolute -inset-2 rounded-full border-2 border-primary/20 group-hover:border-primary/40 transition-colors" />
                  </div>

                  {/* Info */}
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2">
                    {miembro.nombre}
                  </h3>
                  <p className="text-base sm:text-lg text-primary font-medium mb-3">
                    {miembro.rol}
                  </p>
                  <p className="text-sm sm:text-base text-foreground/80 leading-relaxed max-w-xs">
                    {miembro.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Collaboration section */}
        <section className="bg-muted/30 py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
                Proyecto Financiado por el Fondo Nacional de Desarrollo Cultural
                y las Artes, ámbito nacional de financiamiento, Convocatoria
                2025, del Ministerio de las Culturas, las Artes y el Patrimonio.
                Gobierno de Chile
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
