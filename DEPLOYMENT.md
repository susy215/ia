# SmartCoop AI - Deployment Guide

## 🚀 Despliegue en Vercel

### Configuración Automática
El proyecto ya está configurado con `vercel.json` optimizado para:
- ✅ SPA routing (React Router)
- ✅ PWA support (Service Worker)
- ✅ Cache optimization
- ✅ Security headers

### Pasos para Desplegar:

1. **Instalar Vercel CLI** (opcional):
```bash
npm i -g vercel
```

2. **Conectar con GitHub** (recomendado):
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio
   - Vercel detectará automáticamente Vite
   - Deploy automático en cada push

3. **Deploy Manual** (alternativa):
```bash
vercel
```

### Variables de Entorno en Vercel:

Agrega estas variables en el dashboard de Vercel:

```
VITE_API_URL=https://tu-backend.com/api
```

### Optimizaciones Incluidas:

#### 📦 **Cache Headers**
- Assets estáticos: 1 año de cache
- Service Worker: Sin cache (siempre actualizado)

#### 🔒 **Security Headers**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: activado
- Referrer-Policy: strict-origin

#### 🎯 **SPA Routing**
- Todas las rutas redirigen a index.html
- Compatible con React Router

#### 📱 **PWA Support**
- Manifest.json con Content-Type correcto
- Service Worker con headers apropiados

### Build Command:
```bash
npm run build
```

### Output Directory:
```
dist/
```

### Node Version:
```
18.x o superior
```

## 🌐 Después del Deploy

1. **Verificar PWA**: Abre DevTools → Application → Manifest
2. **Probar instalación**: En móvil, "Agregar a pantalla de inicio"
3. **Verificar rutas**: Navega por la app y recarga páginas
4. **Probar offline**: Desconecta internet y verifica que funcione

## 🔧 Troubleshooting

### Error 404 en rutas:
- Verifica que `vercel.json` esté en la raíz
- Revisa que el rewrite esté configurado

### Service Worker no funciona:
- Verifica headers en Network tab
- Asegúrate de estar en HTTPS (Vercel lo hace automático)

### Assets no cargan:
- Revisa que las rutas sean relativas
- Verifica el `base` en `vite.config.js` si usas subdirectorio

## 📊 Performance

El proyecto está optimizado para:
- ⚡ Lighthouse Score: 90+
- 🎨 First Contentful Paint: <1.5s
- 📱 Mobile-friendly
- 🔄 Offline-capable (PWA)
