# CodMap Active/Inactive States - Visual Guide

## Active Map State

```
┌─────────────────────────────────┐
│                                 │
│      [COLOR MAP IMAGE]          │  ← Full color
│                                 │  ← Opacity: 100%
│                                 │  ← Filter: none
│                                 │
└─────────────────────────────────┘
│     BACKLOT (white text)        │  ← Normal background
└─────────────────────────────────┘

Cursor: pointer (when centered)
Hover: Zoom 1.02x + green highlight
```

## Inactive Map State

```
┌─────────────────────────────────┐
│                                 │
│   [GRAYSCALE MAP IMAGE]         │  ← Grayscale filter
│                                 │  ← Opacity: 50%
│                                 │  ← Dimmed appearance
│                                 │
└─────────────────────────────────┘
│  CONVOY (gray #666 text)        │  ← Darker background
└─────────────────────────────────┘

Cursor: default
Hover: No special effects
```

---

## Side-by-Side Comparison

### Active Map
- ✅ **Opacity**: 100%
- ✅ **Filter**: None (full color)
- ✅ **Text Color**: White (#fff)
- ✅ **Background**: rgba(0, 0, 0, 0.8)
- ✅ **Clickable**: Yes (when centered)
- ✅ **Hover Effects**: Scale + green highlight

### Inactive Map
- ⚫ **Opacity**: 50%
- ⚫ **Filter**: grayscale(100%)
- ⚫ **Text Color**: Gray (#666)
- ⚫ **Background**: rgba(0, 0, 0, 0.9)
- ⚫ **Clickable**: Still clickable (opens modal)
- ⚫ **Hover Effects**: Same as active (when centered)

---

## CSS Implementation

```scss
.map-slide {
  // Base styles
  opacity: 1;
  filter: none;
  transition: all 0.3s ease;

  // Inactive state
  &.is-inactive {
    opacity: 0.5;              // 50% transparent
    filter: grayscale(100%);   // Remove all colors
    
    .map-info {
      background: rgba(0, 0, 0, 0.9);  // Darker
      
      h3 {
        color: #666;           // Gray text
      }
    }
  }

  // Active (centered) slide
  &.is-active {
    cursor: pointer;

    &:hover {
      transform: scale(1.02);
      
      .map-info {
        background: rgba(0, 255, 136, 0.2);  // Green tint
        
        h3 {
          color: #00ff88;      // Green text
        }
      }
    }
  }
}
```

---

## User Experience Flow

### Scenario 1: Active Map (Normal Flow)
```
User sees colored map
    ↓
Hovers over centered slide
    ↓
Sees pointer cursor + zoom + green
    ↓
Clicks
    ↓
Modal opens
    ↓
Selects gametype
    ↓
Success ✓
```

### Scenario 2: Inactive Map
```
User sees grayscale dimmed map
    ↓
Recognizes it's not available
    ↓
Can still click (if centered)
    ↓
Modal opens
    ↓
Could show "Map not available" message
    (Future enhancement)
```

---

## Example API Response

```json
{
  "maps": [
    {
      "tag": "mp_backlot",
      "name": "Backlot",
      "active": true
    },
    {
      "tag": "mp_crash",
      "name": "Crash",
      "active": true
    },
    {
      "tag": "mp_convoy",
      "name": "Convoy",
      "active": false
    },
    {
      "tag": "mp_strike",
      "name": "Strike",
      "active": true
    },
    {
      "tag": "mp_bog",
      "name": "Bog",
      "active": false
    }
  ]
}
```

### Visual Representation in Slideshow

```
[GRAYSCALE] [🎨 COLOR] [🎨 COLOR] [GRAYSCALE] ...
   Convoy      Backlot    Crash       Bog
  (inactive)   (active)   (active)  (inactive)
```

---

## Implementation Details

### Template Binding

```vue
<div 
  class="map-slide" 
  :class="{
    'is-active': isActive,      // Centered slide
    'is-inactive': !map.active   // Inactive map
  }"
>
```

### Combined States

| Centered | Active | CSS Classes | Appearance |
|----------|--------|-------------|------------|
| ✅ Yes | ✅ Yes | `is-active` | Color, clickable, hover |
| ✅ Yes | ❌ No | `is-active is-inactive` | Grayscale, clickable, hover |
| ❌ No | ✅ Yes | (none) | Color, not clickable |
| ❌ No | ❌ No | `is-inactive` | Grayscale, not clickable |

---

## Future Enhancements

### Option 1: Prevent Clicking Inactive Maps

```typescript
const handleSlideClick = (map: CodMap, index: number) => {
  if (index === activeIndex.value) {
    if (!map.active) {
      // Show tooltip: "This map is not available"
      return;
    }
    emit('mapClick', map);
  }
};
```

### Option 2: Show Status Badge

```vue
<div class="map-info">
  <h3>{{ map.name }}</h3>
  <span v-if="!map.active" class="badge">Unavailable</span>
</div>
```

### Option 3: Different Inactive Styles

```scss
// Subtle approach
&.is-inactive {
  opacity: 0.7;
  filter: grayscale(50%);  // Partial grayscale
}

// Strong approach
&.is-inactive {
  opacity: 0.3;
  filter: grayscale(100%) blur(2px);
  pointer-events: none;  // Not clickable at all
}
```

---

## Browser Support

The filters used are supported in all modern browsers:

| Property | Chrome | Firefox | Safari | Edge |
|----------|--------|---------|--------|------|
| `opacity` | ✅ All | ✅ All | ✅ All | ✅ All |
| `filter: grayscale()` | ✅ 18+ | ✅ 35+ | ✅ 9.1+ | ✅ 79+ |
| `transition` | ✅ All | ✅ All | ✅ All | ✅ All |

**Fallback**: If filters aren't supported, only opacity will apply (still provides visual distinction).

---

## Testing Checklist

- [ ] Active maps show in full color
- [ ] Inactive maps show in grayscale
- [ ] Inactive maps are 50% transparent
- [ ] Text color differs (white vs gray)
- [ ] Both active and inactive maps are clickable when centered
- [ ] Hover effects work on both (when centered)
- [ ] Smooth transitions between states
- [ ] Works across different browsers

---

## Design Rationale

### Why Grayscale?
- ✅ Universal visual indicator of "disabled" state
- ✅ Doesn't require color vision to distinguish
- ✅ Maintains image recognizability
- ✅ Professional appearance

### Why 50% Opacity?
- ✅ Strong enough to be noticeable
- ✅ Not so strong that image is invisible
- ✅ Works well with grayscale
- ✅ Standard disabled UI pattern

### Why Still Clickable?
- ✅ User might want to see details
- ✅ Future: Could show "coming soon" info
- ✅ Doesn't break navigation flow
- ✅ Can be changed easily if needed

---

## Accessibility Notes

### Screen Readers
The inactive state is visual only. For screen readers, consider:

```vue
<div 
  class="map-slide" 
  :aria-label="`${map.name}${map.active ? '' : ' - Not available'}`"
>
```

### Keyboard Navigation
Ensure keyboard users can still navigate through inactive maps:
- Tab order should include all maps
- Visual focus indicator should be visible
- Enter key should work same as click

---

**Status**: Visual feedback fully implemented! 🎨

