# CodMap Quick Reference

## Model Definition

```typescript
interface CodMap {
  tag: string;      // Unique identifier (e.g., "mp_backlot")
  name: string;     // Display name (e.g., "Backlot")
  active: boolean;  // Is map available?
}
```

---

## Import

```typescript
import type { CodMap } from '@/models/map';
// or
import type { CodMap } from '@/models';
```

---

## API Response Format

```json
{
  "maps": [
    { "tag": "mp_backlot", "name": "Backlot", "active": true },
    { "tag": "mp_crash", "name": "Crash", "active": true },
    { "tag": "mp_convoy", "name": "Convoy", "active": false }
  ]
}
```

---

## Usage Examples

### Display Map Name
```vue
<h3>{{ map.name }}</h3>
```

### Load Map Image
```typescript
const imageUrl = `${config.IMAGES_PREFIX}${map.tag}.jpg`;
```

### API Call
```typescript
await api.setGametypeMap(gametype, map.tag);
```

### Check Status
```typescript
if (map.active) {
  // Map is available
} else {
  // Map is inactive
}
```

### Conditional Styling
```vue
<div :class="{ 'is-inactive': !map.active }">
```

---

## Visual States

| Property | Active | Inactive |
|----------|--------|----------|
| Color | ✅ Full color | 🎨 Grayscale |
| Opacity | 100% | 50% |
| Text Color | White | Gray (#666) |
| Clickable | ✅ Yes | ✅ Yes* |

*Can be changed if needed

---

## Files Using CodMap

- ✅ `src/models/map.ts` - Definition
- ✅ `src/models/api.ts` - API types
- ✅ `src/services/api.ts` - API service
- ✅ `src/App.vue` - Main app
- ✅ `src/components/Slideshow.vue` - Slideshow
- ✅ `src/components/MapSlide.vue` - Individual slides

---

## Quick Test

```typescript
const testMap: CodMap = {
  tag: 'mp_test',
  name: 'Test Map',
  active: true
};

console.log(testMap.name);  // "Test Map"
console.log(testMap.tag);   // "mp_test"
console.log(testMap.active); // true
```

---

**Documentation**: See `CODMAP_MODEL_IMPLEMENTATION.md` for full details.

