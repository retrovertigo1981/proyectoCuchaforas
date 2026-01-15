import type { Artesana as BasicArtesanaType } from '@/data/artesanas';
import type { ArtesanaApi } from '@/types/index';

// Mapeo de regiones de la API a regiones de la aplicación
const mapRegionFromApi = (apiRegion: string): BasicArtesanaType['region'] => {
  const region = apiRegion.toLowerCase();

  if (region.includes('arica') || region.includes('tarapacá') ||
      region.includes('antofagasta') || region.includes('atacama') ||
      region.includes('coquimbo') || region.includes('valparaíso') ||
      region.includes('norte')) {
    return 'Norte';
  }

  if (region.includes('metropolitana') || region.includes('maule') ||
      region.includes('ñuble') || region.includes('biobío') ||
      region.includes('araucanía') || region.includes('centro')) {
    return 'Centro';
  }

  if (region.includes('los lagos') || region.includes('los ríos') ||
      region.includes('aysén') || region.includes('magallanes') ||
      region.includes('sur')) {
    return 'Sur';
  }

  // Por defecto Centro si no se puede determinar
  return 'Centro';
};

// Función para generar posición aleatoria en la constelación
const generateRandomPosition = () => {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
  };
};

// Función principal para limpiar y transformar datos de la API
export const transformArtesanaFromApi = (apiArtesana: ArtesanaApi): BasicArtesanaType => {
  const acf = apiArtesana.acf;

  // Generar posición aleatoria para la constelación
  const posicion = generateRandomPosition();

  // Procesar imágenes de trabajo (opcional)
  const imagenesTrabajo = [
    acf.imagenes_trabajo_1,
    acf.imagenes_trabajo_2,
  ].filter(Boolean) as string[]; // Filtrar valores undefined

  return {
    id: apiArtesana.id.toString(),
    nombre: apiArtesana.title.rendered,
    disciplina: acf.disciplina as BasicArtesanaType['disciplina'],
    region: mapRegionFromApi(acf.region),
    biografia: acf.historia_y_vivencia || acf.motivacion_participacion || '',
    imagenUrl: acf.imagen_de_perfil || undefined,
    imagenesTrabajo: imagenesTrabajo.length > 0 ? imagenesTrabajo : undefined,
    posicion,
  };
};

// Función para limpiar array de artesanas de la API
export const transformArtesanasFromApi = (apiArtesanas: ArtesanaApi[]): BasicArtesanaType[] => {
  return apiArtesanas
    .filter(artesana => artesana.acf && artesana.title.rendered)
    .map(transformArtesanaFromApi);
};

// Función para obtener artesanas desde la API con manejo de errores
export const fetchArtesanasFromApi = async (): Promise<BasicArtesanaType[]> => {
  try {
    // Obtener todas las artesanas usando paginación
    const allArtesanas: ArtesanaApi[] = [];
    let page = 1;
    const perPage = 100; // Máximo permitido por WordPress

    while (true) {
      const response = await fetch(`https://api.proyectocuchaforas.cl/wp-json/wp/v2/artesanas?page=${page}&per_page=${perPage}`);

      if (!response.ok) {
        if (response.status === 400 && page > 1) {
          // No hay más páginas
          break;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiArtesanas: ArtesanaApi[] = await response.json();

      if (apiArtesanas.length === 0) {
        break;
      }

      allArtesanas.push(...apiArtesanas);
      page++;

      // Seguridad: evitar bucles infinitos
      if (page > 10) break;
    }

    // Transformar los datos de la API al formato de la aplicación
    return transformArtesanasFromApi(allArtesanas);

  } catch (error) {
    console.error('Error fetching artesanas from API:', error);

    // Fallback a datos estáticos en caso de error
    console.warn('Falling back to static data due to API error');
    const { artesanas } = await import('@/data/artesanas');
    return artesanas;
  }
};

// Función para obtener una artesana específica por ID desde la API
export const fetchArtesanaByIdFromApi = async (id: string): Promise<BasicArtesanaType | null> => {
  try {
    const response = await fetch(`https://api.proyectocuchaforas.cl/wp-json/wp/v2/artesanas/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiArtesana: ArtesanaApi = await response.json();

    return transformArtesanaFromApi(apiArtesana);

  } catch (error) {
    console.error(`Error fetching artesana ${id} from API:`, error);
    return null;
  }
};

// Función para obtener datos completos de una artesana desde la API
export const fetchCompleteArtesanaData = async (id: string) => {
  try {
    const response = await fetch(`https://api.proyectocuchaforas.cl/wp-json/wp/v2/artesanas/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiArtesana: ArtesanaApi = await response.json();
    const acf = apiArtesana.acf;

    return {
      id: apiArtesana.id.toString(),
      nombre: apiArtesana.title.rendered,
      email: acf.email,
      region: acf.region,
      comuna: acf.comuna,
      telefono: acf.telefono,
      disciplina: acf.disciplina,
      historia: acf.historia_y_vivencia,
      motivacion: acf.motivacion_participacion,
      imagenPerfil: acf.imagen_de_perfil,
      imagenesTrabajo: [
        acf.imagenes_trabajo_1,
        acf.imagenes_trabajo_2,
      ].filter(Boolean), // Filtrar valores undefined
    };

  } catch (error) {
    console.error(`Error fetching complete artesana data ${id}:`, error);
    return null;
  }
};

// Cache para mejorar performance
const cache = new Map<string, { data: BasicArtesanaType[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const getCachedArtesanas = async (): Promise<BasicArtesanaType[]> => {
  const cached = cache.get('artesanas');

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const artesanas = await fetchArtesanasFromApi();
  cache.set('artesanas', { data: artesanas, timestamp: Date.now() });

  return artesanas;
};

// Función para limpiar cache (útil para desarrollo)
export const clearArtesanasCache = () => {
  cache.delete('artesanas');
};
