import type { Artesana as BasicArtesanaType } from '@/data/artesanas';
import type { ArtesanaApi } from '@/types/index';

const mapRegionFromApi = (apiRegion: string): BasicArtesanaType['region'] => {
  const region = apiRegion.toLowerCase();

  if (
    region.includes('arica') ||
    region.includes('tarapacá') ||
    region.includes('antofagasta') ||
    region.includes('atacama') ||
    region.includes('coquimbo') ||
    region.includes('valparaíso') ||
    region.includes('norte')
  ) {
    return 'Norte';
  }

  if (
    region.includes('metropolitana') ||
    region.includes('maule') ||
    region.includes('ñuble') ||
    region.includes('biobío') ||
    region.includes('araucanía') ||
    region.includes('centro')
  ) {
    return 'Central';
  }

  if (
    region.includes('los lagos') ||
    region.includes('los ríos') ||
    region.includes('aysén') ||
    region.includes('magallanes') ||
    region.includes('sur')
  ) {
    return 'Sur';
  }

  if (region.includes('internacional')) {
    return 'Internacional';
  }

  return 'Central';
};

const generateRandomPosition = () => {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
  };
};

export const transformArtesanaFromApi = (
  apiArtesana: ArtesanaApi
): BasicArtesanaType => {
  const acf = apiArtesana.acf;

  const posicion = generateRandomPosition();

  const imagenesTrabajo = [
    acf.imagenes_trabajo_1,
    acf.imagenes_trabajo_2,
  ].filter(Boolean) as string[];

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

export const transformArtesanasFromApi = (
  apiArtesanas: ArtesanaApi[]
): BasicArtesanaType[] => {
  return apiArtesanas
    .filter((artesana) => artesana.acf && artesana.title.rendered)
    .map(transformArtesanaFromApi);
};

export const fetchArtesanasFromApi = async (): Promise<BasicArtesanaType[]> => {
  try {
    const allArtesanas: ArtesanaApi[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const response = await fetch(
        `https://api.proyectocuchaforas.cl/wp-json/wp/v2/artesanas?page=${page}&per_page=${perPage}`
      );

      if (!response.ok) {
        if (response.status === 400 && page > 1) {
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

      if (page > 10) break;
    }

    return transformArtesanasFromApi(allArtesanas);
  } catch (error) {
    console.error('Error fetching artesanas from API:', error);
    return [];
  }
};

export const fetchArtesanaByIdFromApi = async (
  id: string
): Promise<BasicArtesanaType | null> => {
  try {
    const response = await fetch(
      `https://api.proyectocuchaforas.cl/wp-json/wp/v2/artesanas/${id}`
    );

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

export const fetchCompleteArtesanaData = async (id: string) => {
  try {
    const response = await fetch(
      `https://api.proyectocuchaforas.cl/wp-json/wp/v2/artesanas/${id}`
    );

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
      imagenesTrabajo: [acf.imagenes_trabajo_1, acf.imagenes_trabajo_2].filter(
        Boolean
      ),
    };
  } catch (error) {
    console.error(`Error fetching complete artesana data ${id}:`, error);
    return null;
  }
};
