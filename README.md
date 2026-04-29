# Disbol

Aplicación web construida con Next.js para gestionar flujos internos del sistema. La ruta principal redirige automáticamente al dashboard.

## Requisitos

- Node.js 20 o superior
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo
- `npm run build`: genera la versión de producción
- `npm run start`: ejecuta la versión compilada
- `npm run lint`: revisa el código con ESLint

## Estructura general

- `app/`: rutas y páginas de la aplicación
- `components/`: componentes reutilizables
- `context/`: contextos globales
- `hooks/`: hooks personalizados
- `lib/` y `utils/`: funciones de apoyo
- `public/`: archivos estáticos

## Notas

El proyecto usa autenticación, protección de rutas y módulos separados por roles, por lo que varias vistas dependen de sesión activa y permisos.
