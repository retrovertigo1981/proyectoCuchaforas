import { motion } from 'framer-motion';
import { Banner } from '@/components/Banner';
import { Footer } from '@/components/Footer';

export default function Proceso() {
  return (
    <div className="min-h-screen bg-background">
      <Banner />
      <main id="main-content" className="pt-20 sm:pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center gap-5 text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6"
          >
            <div className="w-9 h-9 bg-foreground rounded-full"></div>
            El Proceso
          </motion.h1>
        </section>

        {/* Sección 1: Introducción */}
        <div className="space-y-20 sm:space-y-32 pb-20">
          <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="space-y-4 text-base sm:text-lg text-foreground leading-relaxed">
                <p>
                  La artesanía se presenta en mí como una mezcla de oficios. Se
                  entrelaza con otros oficios aprendidos para encontrar
                  soluciones mixtas o profundizar búsquedas de formas y
                  volúmenes que me habitan y necesitan salir de mí.
                </p>
                <p>
                  Aprendí primero joyería hace más de veinte años, por lo mismo
                  mi hacer está ligado profundamente a la joya como sentido
                  final. Y lo digo desde lo construcción de una pieza, no desde
                  el sentido de la joya como arquetipo último de belleza. Tal
                  vez ahora, estrictamente, no hago joyas, –objetos portables
                  para otros–, pero trabajo mis objetos de cerámica y madera
                  como si lo fueran, porque así aprendí a construir una pieza,
                  entonces sí terminan siendo un objeto único, una joya.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
              >
                <span className="text-foreground/50 text-sm">
                  Foto: Mezcla de oficios
                </span>
              </motion.div>
            </motion.div>
          </section>

          {/* Sección 2: Tallado */}
          <section className="bg-muted/30 py-16 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="container mx-auto px-4 sm:px-6 lg:px-8"
            >
              <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
                <div>
                  <div className="space-y-4 text-base sm:text-lg text-foreground leading-relaxed">
                    <p>
                      En el intento de explicar los procesos de Cuchaforas,
                      diría que el tallado de maderas también nace desde la
                      joyería y se complementa con el hacer cerámico. Empecé con
                      pequeñas piezas para portar y –suspendida en el tiempo de
                      la Pandemia–, tallé mis primeras cucharas ocupando también
                      la lógica de la joyería, pero no era suficiente. Así fui
                      entendiendo que tallar es el arte del sacado, de devastar.
                      Mientras en joyería se construye el volumen, en el tallado
                      se desmembra para dar sentido a las formas.
                    </p>
                    <p className="text-lg sm:text-xl italic font-medium text-foreground/90 border-l-4 border-primary pl-4">
                      En cerámica sumo, en el tallado resto.
                    </p>
                    <p>
                      Mi mano se endurece para guiar la gubia, para sostener el
                      cuchillo. Resto pedacitos a veces ínfimos, lonjas de
                      madera que nadie ve, viruta que cae al piso, restos que
                      sumadas conforman al final una cuchara, un objeto. Es un
                      ejercicio profundamente lento para mí, me aquieto para
                      tallar o tal vez es el tallado el que me aquieta. No puedo
                      apurarme porque me corto, o porque la pieza curiosamente
                      frágil, se rompe. El tallado demanda presencia, o un
                      transe, tal vez.
                    </p>
                  </div>
                </div>
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center"
                  >
                    <span className="text-foreground/50 text-sm">
                      Foto: Tallado de madera
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Sección 3: Creación */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start"
            >
              <div className="order-2 md:order-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                >
                  <span className="text-foreground/50 text-sm">
                    Foto: Proceso de creación
                  </span>
                </motion.div>
              </div>
              <div className="order-1 md:order-2">
                <div className="space-y-4 text-base sm:text-lg text-foreground leading-relaxed">
                  <p>
                    Cuando comenzó el dolor en las manos, dejé de hacer tallado
                    tradicional. Ahora ocupo maquinas para facilitar ciertos
                    procesos de corte. Al comienzo pensaba que los dioses del
                    tallado estarían muy decepcionados de mí, pero aprendí a
                    cuidar mis manos y cada una trabaja como puede y como
                    quiere. También dejé de creer en dioses y empecé a creer en
                    la madera.
                  </p>
                  <p>
                    En la tabla lisa dibujo casi sin pensar la forma de la
                    cuchara que se acomode más al espacio que tengo, ninguna
                    tabla es igual a otra, ninguna cuchara es igual a la otra.
                    Una vez dibujadas trabajo en el espacio cóncavo de las
                    cucharas con gubias curvas especiales para este tipo de
                    formas. La sierra huincha la uso para delimitar la forma de
                    la cuchara que anteriormente fue dibujada. Cuando ya está
                    cortada, comienza el tallado con cuchillos, quizá siempre
                    con el mismo cuchillo. El gesto se acomoda a la mano y el
                    cuchillo al gesto. Cada herramienta demanda un movimiento
                    particular, quizá por eso siempre termina siendo el mismo
                    cuchillo. Busco primero encontrar, tallar, sacar, descubrir
                    las curvas de la cuchara y cuando las encuentro y las
                    delimito, solo las profundizo hasta que la mano sienta que
                    es una cuchara.
                  </p>
                  <p className="text-lg sm:text-xl italic font-medium text-foreground/90 border-l-4 border-primary pl-4">
                    No es la vista la que determina si es una cuchara o no, es
                    la mano, mis dedos me guían.
                  </p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Sección 4: Lijado */}
          <section className="bg-muted/30 py-16 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="container mx-auto px-4 sm:px-6 lg:px-8"
            >
              <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
                <div>
                  <div className="space-y-4 text-base sm:text-lg text-foreground leading-relaxed">
                    <p>
                      Luego lijo, le quito todas las huellas y los surcos que
                      las herramientas anteriormente dejaron. Me esmero en ello,
                      como si no quisiera que descubran cómo la hice. A veces me
                      gusta que los surcos se vean, pero para este proyecto me
                      importó más intencionar la veta de la madera que el
                      movimiento de las manos.
                    </p>
                    <p>
                      Podría lijar con una máquina, lo sé, pero no es lo mismo,
                      la lija a mano es también una manera de moldear la pieza.
                      Cuando no quedan surcos ni rastro de herramienta alguna,
                      paso a la lija fina. Luego a la más fina y a la más fina.
                    </p>
                  </div>
                </div>
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center"
                  >
                    <span className="text-foreground/50 text-sm">
                      Foto: Lijado manual
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Sección 5: Yakisugi */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="space-y-4 text-base sm:text-lg text-foreground leading-relaxed">
                <p>
                  Una vez terminadas, las quemo, como el recuerdo del fuego
                  transformador en todas nosotras. Uso una técnica japonesa que
                  se llama Yakisugi, esta técnica es utilizada para proteger la
                  madera de distintos factores. Para mí, este último acto
                  artesanal es la gran metáfora.
                </p>
                <p className="text-lg sm:text-xl italic font-medium text-foreground/90 border-l-4 border-primary pl-4">
                  Con el Yakisugi queda expuesta la veta, la que nos recuerda
                  los años y los caminos de cada una de las mujeres a las que
                  serán entregadas estas cucharas. Pero también es fuego
                  transformador para cada una y es un gesto de protección hacia
                  ellas y sus haceres.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
              >
                <span className="text-foreground/50 text-sm">
                  Foto: Técnica Yakisugi
                </span>
              </motion.div>
            </motion.div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
