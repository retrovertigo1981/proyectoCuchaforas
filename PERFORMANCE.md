# Performance Budgets - Proyecto Cuchaforas

## 📊 Métricas Objetivo

### Core Web Vitals

| Métrica | Objetivo | Descripción |
|---------|----------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Tiempo de carga del elemento más grande |
| **FID** (First Input Delay) | < 100ms | Tiempo de respuesta a la primera interacción |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Estabilidad visual del layout |

### Performance Scores

| Categoría | Score Mínimo | Herramienta |
|-----------|--------------|-------------|
| **Performance** | ≥ 90 | Lighthouse |
| **Accessibility** | ≥ 95 | Lighthouse |
| **Best Practices** | ≥ 90 | Lighthouse |
| **SEO** | ≥ 90 | Lighthouse |

### Bundle Size Limits

| Tipo | Límite | Actual |
|------|--------|--------|
| **JS Total** | < 500KB | ~523KB (gzip: 166KB) |
| **CSS Total** | < 50KB | ~30KB (gzip: 6KB) |
| **Imágenes** | < 2MB total | Optimizadas con Sharp |
| **HTML** | < 10KB | ~2KB |

## 🚀 Comandos de Performance

```bash
# Auditoría de performance (build + análisis)
npm run test:perf:audit

# Lighthouse CI (requiere Chrome)
npm run test:perf

# Análisis de bundle
npm run build:analyze

# Optimización de imágenes
npm run optimize:images

# Tests unitarios
npm run test:run
```

## ✅ Checklist de Performance

### Imágenes
- [x] Todas las imágenes optimizadas con Sharp
- [x] Formatos modernos (WebP cuando sea posible)
- [x] Lazy loading implementado
- [x] Favicon optimizado (< 10KB)

### JavaScript
- [x] Code splitting con lazy loading
- [x] Tree shaking habilitado
- [x] Console.logs removidos en producción
- [x] TanStack Query para caching

### CSS
- [x] Tailwind CSS purge habilitado
- [x] CSS mínimo en producción (~30KB)
- [x] Sin CSS innecesario

### Fuentes
- [x] Preload de fuentes críticas
- [x] font-display: swap
- [x] Solo los pesos necesarios (300-700)

### React
- [x] Virtualización del mapa (Canvas 2D)
- [x] Memoización con useMemo/useCallback
- [x] Lazy loading de rutas
- [x] TanStack Query para datos

## 📈 Monitoreo

### Local
```bash
# Ejecutar auditoría
npm run test:perf:audit

# Ver resultados de Lighthouse
# Abrir Chrome DevTools → Lighthouse → Generate report
```

### Producción
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/
- **Chrome UX Report**: https://chromeuxreport.web.app/

## 🔧 Optimizaciones Implementadas

### Fase 1: Performance
1. ✅ Optimización de imágenes (-67% peso promedio)
2. ✅ Code splitting con lazy loading
3. ✅ Migración a TanStack Query
4. ✅ Eliminación de console.logs en producción
5. ✅ Visualizer solo en modo análisis

### Fase 2: Canvas 2D
1. ✅ Migración de DOM a Canvas para el mapa
2. ✅ Virtualización de puntos (solo visibles)
3. ✅ Optimización de líneas de conexión
4. ✅ requestAnimationFrame para animaciones

### Fase 3: UI/UX
1. ✅ Open Graph meta tags
2. ✅ Preload de fuentes
3. ✅ Skeleton loaders (eliminados por preferencia)
4. ✅ Accesibilidad mejorada

## ⚠️ Problemas Conocidos

### Lighthouse CI en WSL
- **Problema**: Chrome no se conecta correctamente en WSL
- **Solución**: Usar `npm run test:perf:audit` para auditoría local
- **Alternativa**: Probar en https://pagespeed.web.dev/

### API Externa
- **Problema**: Llamadas a api.proyectocuchaforas.cl pueden ser lentas
- **Solución**: TanStack Query con staleTime de 5 minutos
- **Impacto**: Primera carga puede ser más lenta

## 📝 Notas

- Los budgets se actualizan según el proyecto evoluciona
- Monitorear regularmente con Lighthouse
- Priorizar Core Web Vitals sobre scores generales
- Optimizar para mobile-first

---

**Última actualización**: 2026-07-07
**Status**: ✅ Fase 1-3 completadas, Performance optimizado
