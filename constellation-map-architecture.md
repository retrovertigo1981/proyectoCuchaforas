# Arquitectura: Constellation Map Navegable

## Visión General
Transformar el componente Constellation actual en un mapa navegable tipo Google Maps que soporte 365 artesanas con navegación fluida, filtros dinámicos y optimizaciones móviles.

## 1. Sistema de Coordenadas Expandido

### Coordenadas del Mundo
```typescript
// Dimensiones del mundo (mucho más grande que la pantalla)
const WORLD_DIMENSIONS = {
  width: 4000,   // px
  height: 3000,  // px
};

// Estado de la cámara/viewport
interface ViewState {
  x: number;     // Posición X de la cámara
  y: number;     // Posición Y de la cámara
  scale: number; // Zoom level (0.1 a 3.0)
}

// Transformación de coordenadas
const worldToScreen = (worldX: number, worldY: number, viewState: ViewState) => {
  const screenX = (worldX - viewState.x) * viewState.scale;
  const screenY = (worldY - viewState.y) * viewState.scale;
  return { x: screenX, y: screenY };
};
```

## 2. Sistema de Navegación

### Controles de Navegación
```typescript
// Hook personalizado para manejar navegación
interface NavigationControls {
  // Movimiento del mapa (drag)
  onMouseDown: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onMouseUp: () => void;
  
  // Zoom
  onWheel: (e: WheelEvent) => void;
  onDoubleClick: (e: MouseEvent) => void;
  
  // Touch/móvil
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
}
```

## 3. Sistema de Filtros Dinámicos

### Filtros por Categorías
```typescript
interface FilterState {
  disciplinas: Set<string>;    // ['Cerámica', 'Textil', ...]
  regiones: Set<string>;       // ['Norte', 'Centro', 'Sur', 'Insular']
  showConnections: boolean;    // Mostrar líneas de conexión
}

const filters = {
  // Animar la aparición/desaparición de puntos
  animateFilterChange: (newFilter: FilterState, previousFilter: FilterState) => {
    // Animar puntos que aparecen (fade in + scale)
    // Animar puntos que desaparecen (fade out + scale down)
    // Animar líneas de conexión
  }
};
```

## 4. Sistema de Conexiones por Afinidad

### Algoritmo de Conexiones
```typescript
const calculateConnections = (artesanas: Artesana[], visibleFilter: FilterState) => {
  const connections = [];
  
  for (let i = 0; i < artesanas.length; i++) {
    for (let j = i + 1; j < artesanas.length; j++) {
      const a = artesanas[i];
      const b = artesanas[j];
      
      // Calcular afinidad basada en múltiples factores
      const affinity = calculateAffinity(a, b);
      
      if (affinity > 0.6) { // Solo conectar si hay alta afinidad
        connections.push({
          from: a,
          to: b,
          strength: affinity,
          type: getConnectionType(a, b) // 'region', 'discipline', 'both'
        });
      }
    }
  }
  
  return connections.sort((a, b) => b.strength - a.strength);
};

const calculateAffinity = (a: Artesana, b: Artesana) => {
  let score = 0;
  
  // Misma disciplina = +0.4
  if (a.disciplina === b.disciplina) score += 0.4;
  
  // Misma región = +0.3
  if (a.region === b.region) score += 0.3;
  
  // Distancia física cercana = +0.3
  const distance = Math.sqrt(
    Math.pow(a.posicion.x - b.posicion.x, 2) + 
    Math.pow(a.posicion.y - b.posicion.y, 2)
  );
  const proximityScore = Math.max(0, 1 - distance / 200);
  score += proximityScore * 0.3;
  
  return score;
};
```

## 5. Optimización Móvil

### Virtualización de Puntos
```typescript
// Solo renderizar puntos visibles en el viewport actual
const getVisiblePoints = (artesanas: Artesana[], viewState: ViewState) => {
  const margin = 200; // Margen extra para animaciones
  const viewport = {
    left: viewState.x - margin,
    top: viewState.y - margin,
    right: viewState.x + window.innerWidth + margin,
    bottom: viewState.y + window.innerHeight + margin
  };
  
  return artesanas.filter(point => 
    point.x >= viewport.left && 
    point.x <= viewport.right &&
    point.y >= viewport.top && 
    point.y <= viewport.bottom
  );
};
```

## 6. Componentes Necesarios

### Estructura de Componentes
```
ConstellationMap/                     # Componente principal
├── ConstellationMap.tsx             # Container principal
├── NavigationControls/              # Sistema de navegación
│   ├── useNavigation.ts             # Hook de navegación
│   ├── PanControls.tsx              # Controles de pan
│   ├── ZoomControls.tsx             # Controles de zoom
│   └── TouchGestures.tsx            # Gestos táctiles
├── WorldCanvas/                     # Canvas del mundo
│   ├── WorldCanvas.tsx              # Canvas SVG principal
│   ├── PointRenderer.tsx            # Renderizado de puntos
│   ├── ConnectionRenderer.tsx       # Renderizado de conexiones
│   └── BackgroundRenderer.tsx       # Fondo y textura
├── FilterSystem/                    # Sistema de filtros
│   ├── FilterPanel.tsx              # Panel de filtros
│   ├── FilterAnimations.tsx         # Animaciones de filtros
│   └── FilterLogic.ts               # Lógica de filtrado
└── MobileOptimizations/             # Optimizaciones móviles
    ├── Virtualization.tsx           # Virtualización de puntos
    ├── PerformanceMonitor.tsx       # Monitoreo de performance
    └── GestureHandlers.tsx          # Manejo de gestos
```

## 7. Flujo de Implementación Sugerido

### Fase 1: Base Navegable
1. Implementar sistema de coordenadas expandido
2. Añadir controles de navegación básicos
3. Optimizar para renderizado de muchos puntos

### Fase 2: Sistema de Filtros
1. Panel de filtros dinámico
2. Animaciones de filtrado
3. Agrupación por afinidades

### Fase 3: Optimización Móvil
1. Gestos táctiles
2. Virtualización
3. Performance monitoring

### Fase 4: Pulimiento
1. Animaciones fluidas
2. Feedback visual
3. Testing en dispositivos reales

---

## Beneficios de Esta Arquitectura

✅ **Escalabilidad**: Soporta 365+ puntos sin problemas de performance
✅ **Navegación Intuitiva**: Experiencia familiar tipo mapa
✅ **Filtros Poderosos**: Organización visual por múltiples criterios
✅ **Mobile-First**: Optimizado para dispositivos móviles
✅ **Animaciones Fluidas**: Transiciones suaves y naturales
✅ **Performance**: Virtualización y optimizaciones integradas
✅ **Extensibilidad**: Fácil añadir nuevas características
