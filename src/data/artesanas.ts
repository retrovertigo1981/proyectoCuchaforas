export interface Artesana {
  id: string;
  nombre: string;
  disciplina: 'Cerámica' | 'Textil' | 'Madera' | 'Cestería' | 'Orfebrería' | 'Tejido';
  region: 'Norte' | 'Centro' | 'Sur' | 'Insular';
  biografia: string;
  imagenUrl?: string;
  imagenesTrabajo?: string[]; // Imágenes de trabajo (opcional)
  // Posición en la constelación (porcentaje de la imagen)
  posicion: {
    x: number; // 0-100
    y: number; // 0-100
  };
}

export const artesanas: Artesana[] = [
  {
    id: '1',
    nombre: 'Rosa Painequeo',
    disciplina: 'Textil',
    region: 'Sur',
    biografia: 'Tejedora mapuche que transmite historias ancestrales en cada witral, entrelazando hilos mientras cuida a sus nietos.',
    imagenUrl: '/src/assets/img/artesana1.jpg',
    imagenesTrabajo: ['/src/assets/img/cucharas-madera.png'],
    posicion: { x: 15, y: 25 }
  },
  {
    id: '2',
    nombre: 'María Elena Cortés',
    disciplina: 'Cerámica',
    region: 'Centro',
    biografia: 'Alfarera de Pomaire que moldea arcilla entre siestas y pañales, manteniendo vivo el oficio de su abuela.',
    imagenUrl: '/src/assets/img/artesana2.jpg',
    imagenesTrabajo: ['/src/assets/img/cucharas-madera-2.png'],
    posicion: { x: 35, y: 40 }
  },
  {
    id: '3',
    nombre: 'Carmen Huerta',
    disciplina: 'Madera',
    region: 'Norte',
    biografia: 'Talladora del Norte Grande que esculpe en algarrobo las formas del desierto mientras sus hijas juegan a sus pies.',
    imagenUrl: '/src/assets/img/artesana3.jpg',
    posicion: { x: 60, y: 30 }
  },
  {
    id: '4',
    nombre: 'Juana Paredes',
    disciplina: 'Cestería',
    region: 'Sur',
    biografia: 'Cestera que teje fibras de ñocha en Chiloé, manteniendo viva la técnica que aprendió de su madre mientras cría sola.',
    posicion: { x: 25, y: 65 }
  },
  {
    id: '5',
    nombre: 'Sofía Maldonado',
    disciplina: 'Orfebrería',
    region: 'Centro',
    biografia: 'Orfebre que forja plata mientras su hija duerme, creando joyas que llevan la memoria de las mujeres de su familia.',
    posicion: { x: 75, y: 55 }
  },
  {
    id: '6',
    nombre: 'Patricia Quintriqueo',
    disciplina: 'Tejido',
    region: 'Sur',
    biografia: 'Tejedora pehuenche que hila lana de oveja criolla, enseñando a sus hijas el valor de la paciencia y la belleza simple.',
    posicion: { x: 50, y: 75 }
  },
  {
    id: '7',
    nombre: 'Andrea Castillo',
    disciplina: 'Cerámica',
    region: 'Norte',
    biografia: 'Ceramista del Valle del Elqui que trabaja el greda entre lactancias, moldeando la tierra como se moldea a sí misma.',
    posicion: { x: 85, y: 20 }
  },
  {
    id: '8',
    nombre: 'Isabel Vargas',
    disciplina: 'Textil',
    region: 'Centro',
    biografia: 'Bordera de Isla Negra que pinta con hilos el mar que ve desde su ventana, mientras sus nietos corren por la casa.',
    posicion: { x: 45, y: 50 }
  }
];

export const disciplinas = ['Cerámica', 'Textil', 'Madera', 'Cestería', 'Orfebrería', 'Tejido'] as const;
export const regiones = ['Norte', 'Centro', 'Sur', 'Insular'] as const;
