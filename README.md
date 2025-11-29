# OLG Website

Vue 3 + TypeScript + Vite frontend application with runtime configuration support.

## Features

- ⚡ **Vue 3** with Composition API and `<script setup>`
- 🎨 **TypeScript** for type safety
- 🚀 **Vite** for fast development and optimized builds
- 🔧 **Runtime Configuration** - Deploy once, configure anywhere
- 🗺️ **CodMap Model** - Type-safe map data structure
- 🎯 **Smart Interactions** - Only centered slides are clickable

## Quick Start

### Development

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Runtime Configuration

This application supports **runtime configuration**, allowing you to deploy the same build to multiple environments without rebuilding.

### Configuration Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `MAPS_JSON_URL` | URL to fetch maps data | `/maps.json` |
| `IMAGES_PREFIX` | Prefix for image URLs | `/usermaps_images/` |
| `GAMETYPE_SET_ENDPOINT` | API endpoint for gametype mapping | `/api/public/v1/server/gametype_map` |

### Build-Time Configuration (Optional)

Set environment variables before building:

```bash
export VITE_MAPS_JSON_URL="https://api.example.com/maps.json"
export VITE_IMAGES_PREFIX="https://cdn.example.com/images/"
export VITE_GAMETYPE_SET_ENDPOINT="https://api.example.com/v1/gametype"
npm run build
```

### Runtime Configuration (Recommended)

After deploying your build, update `config.json` in the deployment directory:

```bash
# Using the provided script
./scripts/update-config.sh dist

# Or manually
cat > dist/config.json << EOF
{
  "MAPS_JSON_URL": "https://api.production.com/maps.json",
  "IMAGES_PREFIX": "https://cdn.production.com/images/",
  "GAMETYPE_SET_ENDPOINT": "https://api.production.com/v1/gametype"
}
EOF
```

## Documentation

All documentation is organized in the `/doc` folder:

- 📖 [Documentation Index](./doc/DOCUMENTATION_INDEX.md) - Complete guide to all documentation
- 🎯 [Implementation Checklist](./doc/IMPLEMENTATION_CHECKLIST.md) - See what was implemented
- 📋 [CodMap Model Guide](./doc/CODMAP_MODEL_IMPLEMENTATION.md) - Data model documentation
- 🎨 [Visual States Guide](./doc/CODMAP_VISUAL_STATES.md) - Visual design and states
- 📚 [Quick Reference](./doc/CODMAP_QUICK_REFERENCE.md) - Quick usage guide
- 🚀 [Backend Migration Guide](./doc/BACKEND_MIGRATION_GUIDE.md) - API changes for backend team
- 🐳 [Docker Deployment](./Dockerfile.example) - Multi-stage Docker build example

## Project Structure

```
src/
├── components/       # Vue components
├── models/          # TypeScript models
│   ├── map.ts       # CodMap model
│   ├── api.ts       # API types
│   └── index.ts     # Model exports
├── services/        # API and configuration services
│   ├── api.ts       # API client
│   └── config.ts    # Runtime configuration
├── App.vue          # Root component
└── main.ts          # Application entry point

scripts/
├── generate-config.js    # Generate config.json from env vars
├── update-config.sh      # Update config.json interactively
└── docker-entrypoint.sh  # Docker startup script

public/
├── config.json          # Runtime configuration file
└── config.template.json # Configuration template

doc/
├── DOCUMENTATION_INDEX.md           # Complete documentation index
├── CODMAP_MODEL_IMPLEMENTATION.md   # CodMap model guide
├── CODMAP_VISUAL_STATES.md          # Visual design guide
├── CODMAP_QUICK_REFERENCE.md        # Quick reference
├── BACKEND_MIGRATION_GUIDE.md       # Backend API guide
├── IMPLEMENTATION_CHECKLIST.md      # Implementation status
└── README.md                        # Documentation folder index
```

## Benefits of Runtime Configuration

✅ **Single Build Artifact** - Build once, deploy to multiple environments  
✅ **No Rebuild Required** - Change configuration without recompiling  
✅ **Docker/Kubernetes Ready** - Perfect for containerized deployments  
✅ **CI/CD Friendly** - Simplifies deployment pipelines  

## CodMap Model

The application uses a type-safe `CodMap` model for all map data:

```typescript
interface CodMap {
  tag: string;      // Unique identifier (e.g., "mp_backlot")
  name: string;     // Display name (e.g., "Backlot")
  active: boolean;  // Is map available?
}
```

**Features:**
- Type-safe throughout the application
- Visual feedback for inactive maps (grayscale + reduced opacity)
- Clear separation between identifier and display name

See [CodMap documentation](./doc/CODMAP_MODEL_IMPLEMENTATION.md) for details.

## Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
- [Vite Documentation](https://vitejs.dev/)

