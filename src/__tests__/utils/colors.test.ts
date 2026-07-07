import { describe, it, expect } from 'vitest';
import { COLOR_PALETTE, getColorForArtesana } from '@/utils/colors';

describe('colors', () => {
  describe('COLOR_PALETTE', () => {
    it('should have 12 colors', () => {
      expect(COLOR_PALETTE).toHaveLength(12);
    });

    it('should contain valid hex colors', () => {
      const hexRegex = /^#[0-9a-fA-F]{6}$/;
      COLOR_PALETTE.forEach((color) => {
        expect(color).toMatch(hexRegex);
      });
    });
  });

  describe('getColorForArtesana', () => {
    it('should return a color from the palette', () => {
      const color = getColorForArtesana('test-id');
      expect(COLOR_PALETTE).toContain(color);
    });

    it('should return consistent color for the same ID', () => {
      const id = 'artesana-123';
      const color1 = getColorForArtesana(id);
      const color2 = getColorForArtesana(id);
      expect(color1).toBe(color2);
    });

    it('should return different colors for different IDs', () => {
      const color1 = getColorForArtesana('id-1');
      const color2 = getColorForArtesana('id-2');
      // No es garantizado que sean diferentes, pero para IDs simples debería ser así
      // Este test verifica que la función no siempre retorna el mismo color
      const color3 = getColorForArtesana('abc');
      const color4 = getColorForArtesana('xyz');
      
      // Al menos algunos deben ser diferentes
      const colors = [color1, color2, color3, color4];
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBeGreaterThan(1);
    });

    it('should handle empty string', () => {
      const color = getColorForArtesana('');
      expect(COLOR_PALETTE).toContain(color);
    });

    it('should handle numeric strings', () => {
      const color = getColorForArtesana('12345');
      expect(COLOR_PALETTE).toContain(color);
    });

    it('should handle special characters', () => {
      const color = getColorForArtesana('id-with-special-chars!@#$%');
      expect(COLOR_PALETTE).toContain(color);
    });
  });
});
