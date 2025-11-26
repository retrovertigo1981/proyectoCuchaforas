import { motion } from 'framer-motion';

export default function Proyecto() {
  return (
    <div className="min-h-screen bg-[#656293] ">
      <main className="pt-20 sm:pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
          >
            Proyecto
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white max-w-3xl mx-auto"
          >
            Cucháforas: objetos poéticos de artesanía para la resistencia & la
            crianza.
          </motion.p>
        </section>

        {/* Story Sections */}
        <div className="space-y-20 sm:space-y-32 pb-20">
          {/* ¿Qué es Cuchaforas? */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              <div className="order-2 md:order-1">
                <div className="space-y-4 text-base sm:text-lg text-white leading-relaxed italic">
                  <p>
                    “Este proyecto emerge –sin saberlo– el mismo día en que mi
                    hijo nació, hace diez años. Y se cristaliza hoy, cuando
                    puedo mirar atrás, revisar nuestra historia y darme cuenta
                    de la importancia de visibilizar las maternidades diversas,
                    la crianza y los espacios de cuidado en soledad. Criar o
                    cuidar a alguien sin apoyo de otro, te lleva a desarrollar
                    una fortaleza profunda desde el amor, pero también genera
                    una tensión y un tedio con la rutina de lo cotidiano. Y con
                    ello, un cansancio físico, emocional y creativo. A nivel
                    personal, fue en ese contexto de entrega y de imposibilidad
                    de tiempos creativos, cuando la mirada comenzó a enfocarse
                    en algunos elementos cotidianos que me acompañaban. Así́ que,
                    para resistir, comencé́ a dotarlos de una complejidad
                    creativa. La cuchara de palo emergió́ como símbolo claro y
                    sólido de resistencia creativa, y comencé́ a re-observarlas
                    desde mi oficio de artesana con el fin de intentar
                    transformarla”. (Camila Rojas Contardo, artesana).
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-white">Imagen: Cucharas talladas</span>
                </div>
              </div>
            </motion.div>
          </section>

          {/* El Contexto 1 */}
          <section className="bg-muted/30 py-16 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="container mx-auto px-4 sm:px-6 lg:px-8"
            >
              <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div>
                  <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                    <span className="text-white">
                      Imagen: Artesana trabajando
                    </span>
                  </div>
                </div>
                <div>
                  <div className="space-y-4 text-base sm:text-lg text-white leading-relaxed">
                    <p>
                      Este proyecto se soñó siempre como un regalo, porque
                      queríamos/queremos y buscamos, visibilizar a distintas
                      mujeres artesanas/artistas/hacedoras de oficios, que hayan
                      pasado o estén pasando por la etapa de criar y crear al
                      mismo tiempo. Nos moviliza la idea de conocer sus
                      historias, nos preguntamos cómo lo han hecho o cómo lo
                      están haciendo para que esa creatividad no se pierda en
                      los haceres de lo cotidiano, en el cansancio, en la falta
                      de recursos diarios. Saber incluso ¿cómo habrán nutrido su
                      creación a partir de la crianza? Las buscamos porque nos
                      queremos unir a ese flujo materno-creativo para dejar de
                      sentirnos solas.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
          <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              <div className="order-2 md:order-1">
                <div className="space-y-4 text-base sm:text-lg text-white leading-relaxed italic">
                  <p>
                    ¿Cómo podemos las mujeres artesanas crear en las etapas de
                    crianza? ¿Cómo podemos crear en medio de la desigualdad
                    parental? ¿Cómo podemos crear desde lo cotidiano? ¿A cuántas
                    mujeres artesanas/artistas más les pasa algo similar? ¿Dónde
                    están? ¿Cómo lograron gestionar lo cotidiano y su
                    oficio?{' '}
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-white">Imagen: Cucharas talladas</span>
                </div>
              </div>
            </motion.div>

            {/* El Regalo */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="mt-12"
            >
              <div className="space-y-4 text-base sm:text-lg text-white leading-relaxed text-justify">
                <p>
                  Explorando el cómo compatibilizar el estado creativo con el
                  estado criando, llegamos a la necesidad de regalar un objeto
                  hecho a mano para cada una de ellas, como una ofrenda. Una
                  ofrenda por haber seguido o seguir creando, jugando y
                  cuestionándose, por haber mantenido e insistido con ese
                  llamado creativo. Regalamos cucharas. Regalamos Cuchaforas,
                  cucharas y metáforas devenidas en objeto.
                </p>
                <p>
                  ¿Pero por qué lo hacemos? La cuchara la invocamos como una
                  mezcla de símbolo y de gesto de lo cotidiano. No es la cuchara
                  vista desde el estereotipo de símbolo de la cocina, es más
                  bien la cuchara como herramienta de lo nutricio, del objeto
                  más usado de la casa, esa cuchara que sirve para todo, que va
                  de la sopa al golpe duro de una cacerola en protesta. La
                  cuchara que se vuelve metáfora y nos iguala y nos hermana.
                </p>
                <p>
                  Este proyecto, por lo tanto, pretende ser una contribución a
                  visibilizar las historias de vida y amor de seres que se sanan
                  a través de la artesanía y que logran transformar sus pasos
                  cotidianos en arte.
                </p>
                <p>
                  Contribuir, asimismo, a visibilizar –a través de la creación
                  de una Cartografía Artística Digital– el oficio y los procesos
                  creativos de mujeres artesanas/artistas a cargo de espacios de
                  crianza y cuidado, presentes en diversos territorios.
                </p>
              </div>
            </motion.div>
          </section>

        </div>
      </main>
    </div>
  );
}
