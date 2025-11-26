import { motion } from 'framer-motion';

export default function Equipo() {
    return (

        <div className="min-h-screen bg-[#656293] ">
            <main className="pt-20 sm:pt-24">
                {/* Hero Section */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-12"
                    >
                        Equipo
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8 }}
                        className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4"
                    >
                        <div className="space-y-6 ">
                            
                            <ul className="space-y-3 text-base sm:text-lg text-white mb-12">
                                <li className="flex items-start">
                                    <span className="mr-3">•</span>
                                    <span>
                                        Camila Rojas Contardo,{' '}
                                        <strong>
                                            Responsable del proyecto, Artesana, Dirección de Arte.
                                        </strong>
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3">•</span>
                                    <span>
                                        Isabel Margarita Zambelli Matta,{' '}
                                        <strong>
                                            Curaduría de la obra y relato de Cartografía Artística
                                            Digital.
                                        </strong>
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3">•</span>
                                    <span>
                                        Camila Moraga y Natalia Lozano, <em>Calisma:</em>{' '}
                                        <strong>
                                            Diseño imagen y piezas gráficas, Cartografía Artísitca
                                            Digital y comunicaciones.
                                        </strong>
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3">•</span>
                                    <span>
                                        Alfredo Méndez, <strong>fotografía.</strong>
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3">•</span>
                                    <span>
                                        Alex Daniel Barril Saldivia,{' '}
                                        <strong>Gestor de participación y comunicaciones.</strong>
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3">•</span>
                                    <span>
                                        Alejandro Cofé y Sebastian Peña, <em>Webs4Webs:</em>
                                        <strong> Desarrollo web y soporte técnico.</strong>
                                    </span>
                                </li>
                            </ul>
                            <p className="text-sm sm:text-base text-white leading-relaxed mt-12 text-center">
                                <strong>Proyecto Financiado</strong> por el Fondo Nacional de
                                Desarrollo Cultural y las Artes, ámbito nacional de
                                financiamiento, Convocatoria 2025, del Ministerio de las
                                Culturas, las Artes y el Patrimonio. Gobierno de Chile
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Equipo */}
                
            </main>
        </div>

    );
}