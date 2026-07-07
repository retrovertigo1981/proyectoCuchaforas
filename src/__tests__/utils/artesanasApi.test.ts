import { describe, it, expect } from 'vitest';
import {
  transformArtesanaFromApi,
  transformArtesanasFromApi,
} from '@/utils/artesanasApi';
import type { ArtesanaApi } from '@/types/index';

describe('artesanasApi', () => {
  describe('transformArtesanaFromApi', () => {
    it('should transform API data to app format', () => {
      const apiData: ArtesanaApi = {
        id: 123,
        title: { rendered: 'María Ejemplo' },
        acf: {
          email: 'maria@example.com',
          region: 'Región Metropolitana',
          comuna: 'Santiago',
          telefono: '+56912345678',
          disciplina: 'Cerámica',
          historia_y_vivencia: 'Historia de María',
          motivacion_participacion: 'Motivación de María',
          imagen_de_perfil: 'https://example.com/maria.jpg',
          imagenes_trabajo_1: 'https://example.com/trabajo1.jpg',
          imagenes_trabajo_2: 'https://example.com/trabajo2.jpg',
        },
      };

      const result = transformArtesanaFromApi(apiData);

      expect(result.id).toBe('123');
      expect(result.nombre).toBe('María Ejemplo');
      expect(result.disciplina).toBe('Cerámica');
      expect(result.region).toBe('Central');
      expect(result.biografia).toBe('Historia de María');
      expect(result.imagenUrl).toBe('https://example.com/maria.jpg');
      expect(result.imagenesTrabajo).toEqual([
        'https://example.com/trabajo1.jpg',
        'https://example.com/trabajo2.jpg',
      ]);
      expect(result.posicion).toHaveProperty('x');
      expect(result.posicion).toHaveProperty('y');
      expect(result.posicion.x).toBeGreaterThanOrEqual(0);
      expect(result.posicion.x).toBeLessThanOrEqual(100);
      expect(result.posicion.y).toBeGreaterThanOrEqual(0);
      expect(result.posicion.y).toBeLessThanOrEqual(100);
    });

    it('should map regions correctly', () => {
      const testCases = [
        { region: 'Arica', expected: 'Norte' },
        { region: 'Tarapacá', expected: 'Norte' },
        { region: 'Antofagasta', expected: 'Norte' },
        { region: 'Atacama', expected: 'Norte' },
        { region: 'Coquimbo', expected: 'Norte' },
        { region: 'Valparaíso', expected: 'Norte' },
        { region: 'Región Metropolitana', expected: 'Central' },
        { region: 'Maule', expected: 'Central' },
        { region: 'Ñuble', expected: 'Central' },
        { region: 'Biobío', expected: 'Central' },
        { region: 'Araucanía', expected: 'Central' },
        { region: 'Los Lagos', expected: 'Sur' },
        { region: 'Los Ríos', expected: 'Sur' },
        { region: 'Aysén', expected: 'Sur' },
        { region: 'Magallanes', expected: 'Sur' },
        { region: 'Internacional', expected: 'Internacional' },
      ];

      testCases.forEach(({ region, expected }) => {
        const apiData: ArtesanaApi = {
          id: 1,
          title: { rendered: 'Test' },
          acf: {
            email: '',
            region,
            comuna: '',
            telefono: '',
            disciplina: '',
            historia_y_vivencia: '',
            motivacion_participacion: '',
            imagen_de_perfil: '',
            imagenes_trabajo_1: '',
            imagenes_trabajo_2: '',
          },
        };

        const result = transformArtesanaFromApi(apiData);
        expect(result.region).toBe(expected);
      });
    });

    it('should default to Central for unknown regions', () => {
      const apiData: ArtesanaApi = {
        id: 1,
        title: { rendered: 'Test' },
        acf: {
          email: '',
          region: 'Región Desconocida',
          comuna: '',
          telefono: '',
          disciplina: '',
          historia_y_vivencia: '',
          motivacion_participacion: '',
          imagen_de_perfil: '',
          imagenes_trabajo_1: '',
          imagenes_trabajo_2: '',
        },
      };

      const result = transformArtesanaFromApi(apiData);
      expect(result.region).toBe('Central');
    });

    it('should use motivacion_participacion if historia_y_vivencia is empty', () => {
      const apiData: ArtesanaApi = {
        id: 1,
        title: { rendered: 'Test' },
        acf: {
          email: '',
          region: '',
          comuna: '',
          telefono: '',
          disciplina: '',
          historia_y_vivencia: '',
          motivacion_participacion: 'Motivación',
          imagen_de_perfil: '',
          imagenes_trabajo_1: '',
          imagenes_trabajo_2: '',
        },
      };

      const result = transformArtesanaFromApi(apiData);
      expect(result.biografia).toBe('Motivación');
    });

    it('should handle missing images', () => {
      const apiData: ArtesanaApi = {
        id: 1,
        title: { rendered: 'Test' },
        acf: {
          email: '',
          region: '',
          comuna: '',
          telefono: '',
          disciplina: '',
          historia_y_vivencia: '',
          motivacion_participacion: '',
          imagen_de_perfil: '',
          imagenes_trabajo_1: '',
          imagenes_trabajo_2: '',
        },
      };

      const result = transformArtesanaFromApi(apiData);
      expect(result.imagenUrl).toBeUndefined();
      expect(result.imagenesTrabajo).toBeUndefined();
    });

    it('should handle partial work images', () => {
      const apiData: ArtesanaApi = {
        id: 1,
        title: { rendered: 'Test' },
        acf: {
          email: '',
          region: '',
          comuna: '',
          telefono: '',
          disciplina: '',
          historia_y_vivencia: '',
          motivacion_participacion: '',
          imagen_de_perfil: '',
          imagenes_trabajo_1: 'https://example.com/trabajo1.jpg',
          imagenes_trabajo_2: '',
        },
      };

      const result = transformArtesanaFromApi(apiData);
      expect(result.imagenesTrabajo).toEqual(['https://example.com/trabajo1.jpg']);
    });
  });

  describe('transformArtesanasFromApi', () => {
    it('should transform array of artesanas', () => {
      const apiData: ArtesanaApi[] = [
        {
          id: 1,
          title: { rendered: 'Artesana 1' },
          acf: {
            email: '',
            region: 'Metropolitana',
            comuna: '',
            telefono: '',
            disciplina: 'Cerámica',
            historia_y_vivencia: '',
            motivacion_participacion: '',
            imagen_de_perfil: '',
            imagenes_trabajo_1: '',
            imagenes_trabajo_2: '',
          },
        },
        {
          id: 2,
          title: { rendered: 'Artesana 2' },
          acf: {
            email: '',
            region: 'Valparaíso',
            comuna: '',
            telefono: '',
            disciplina: 'Textil',
            historia_y_vivencia: '',
            motivacion_participacion: '',
            imagen_de_perfil: '',
            imagenes_trabajo_1: '',
            imagenes_trabajo_2: '',
          },
        },
      ];

      const result = transformArtesanasFromApi(apiData);

      expect(result).toHaveLength(2);
      expect(result[0].nombre).toBe('Artesana 1');
      expect(result[0].region).toBe('Central');
      expect(result[1].nombre).toBe('Artesana 2');
      expect(result[1].region).toBe('Norte');
    });

    it('should filter out invalid artesanas', () => {
      const apiData: ArtesanaApi[] = [
        {
          id: 1,
          title: { rendered: 'Artesana Válida' },
          acf: {
            email: '',
            region: '',
            comuna: '',
            telefono: '',
            disciplina: '',
            historia_y_vivencia: '',
            motivacion_participacion: '',
            imagen_de_perfil: '',
            imagenes_trabajo_1: '',
            imagenes_trabajo_2: '',
          },
        },
        {
          id: 2,
          title: { rendered: '' },
          acf: {
            email: '',
            region: '',
            comuna: '',
            telefono: '',
            disciplina: '',
            historia_y_vivencia: '',
            motivacion_participacion: '',
            imagen_de_perfil: '',
            imagenes_trabajo_1: '',
            imagenes_trabajo_2: '',
          },
        },
        {
          id: 3,
          title: { rendered: 'Sin ACF' },
          acf: null as any,
        },
      ];

      const result = transformArtesanasFromApi(apiData);

      expect(result).toHaveLength(1);
      expect(result[0].nombre).toBe('Artesana Válida');
    });

    it('should handle empty array', () => {
      const result = transformArtesanasFromApi([]);
      expect(result).toEqual([]);
    });
  });
});
