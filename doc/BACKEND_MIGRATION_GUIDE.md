# Backend Migration Checklist for CodMap Model

## Overview

The frontend now expects map data in a structured format with `tag`, `name`, and `active` properties.

---

## Required Changes

### ✅ Update `/maps.json` Endpoint

**Before:**
```json
{
  "maps": [
    "mp_backlot",
    "mp_crash",
    "mp_convoy"
  ]
}
```

**After:**
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
    }
  ]
}
```

---

## Field Descriptions

### `tag` (string, required)
- **Purpose**: Unique identifier for the map
- **Format**: Usually `mp_<mapname>` for CoD4 maps
- **Usage**: 
  - Used in image URLs: `/usermaps_images/${tag}.jpg`
  - Sent to gametype API endpoint
  - Used as Vue key for rendering

### `name` (string, required)
- **Purpose**: Human-readable display name
- **Format**: Capitalized, user-friendly name
- **Usage**: Shown in UI to users

### `active` (boolean, required)
- **Purpose**: Indicates if map is available for selection
- **Values**: 
  - `true` - Map is active and selectable
  - `false` - Map is inactive (shown grayed out)
- **Usage**: Visual feedback in UI

---

## Implementation Examples

### Node.js/Express

```javascript
app.get('/maps.json', (req, res) => {
  const maps = [
    { tag: 'mp_backlot', name: 'Backlot', active: true },
    { tag: 'mp_crash', name: 'Crash', active: true },
    { tag: 'mp_convoy', name: 'Convoy', active: false },
    { tag: 'mp_strike', name: 'Strike', active: true },
    { tag: 'mp_vacant', name: 'Vacant', active: true }
  ];
  
  res.json({ maps });
});
```

### Python/Flask

```python
@app.route('/maps.json')
def get_maps():
    maps = [
        {"tag": "mp_backlot", "name": "Backlot", "active": True},
        {"tag": "mp_crash", "name": "Crash", "active": True},
        {"tag": "mp_convoy", "name": "Convoy", "active": False},
        {"tag": "mp_strike", "name": "Strike", "active": True},
        {"tag": "mp_vacant", "name": "Vacant", "active": True}
    ]
    
    return jsonify({"maps": maps})
```

### PHP

```php
<?php
header('Content-Type: application/json');

$maps = [
    ["tag" => "mp_backlot", "name" => "Backlot", "active" => true],
    ["tag" => "mp_crash", "name" => "Crash", "active" => true],
    ["tag" => "mp_convoy", "name" => "Convoy", "active" => false],
    ["tag" => "mp_strike", "name" => "Strike", "active" => true],
    ["tag" => "mp_vacant", "name" => "Vacant", "active" => true]
];

echo json_encode(["maps" => $maps]);
```

### Static JSON File

If using a static file:

```json
{
  "maps": [
    { "tag": "mp_backlot", "name": "Backlot", "active": true },
    { "tag": "mp_crash", "name": "Crash", "active": true },
    { "tag": "mp_convoy", "name": "Convoy", "active": false },
    { "tag": "mp_strike", "name": "Strike", "active": true },
    { "tag": "mp_vacant", "name": "Vacant", "active": true },
    { "tag": "mp_overgrown", "name": "Overgrown", "active": true },
    { "tag": "mp_pipeline", "name": "Pipeline", "active": true },
    { "tag": "mp_showdown", "name": "Showdown", "active": true },
    { "tag": "mp_bloc", "name": "Bloc", "active": true },
    { "tag": "mp_countdown", "name": "Countdown", "active": true }
  ]
}
```

---

## Database Schema Example

### SQL

```sql
CREATE TABLE maps (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tag VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO maps (tag, name, active) VALUES
  ('mp_backlot', 'Backlot', TRUE),
  ('mp_crash', 'Crash', TRUE),
  ('mp_convoy', 'Convoy', FALSE);
```

### MongoDB

```javascript
{
  _id: ObjectId("..."),
  tag: "mp_backlot",
  name: "Backlot",
  active: true,
  createdAt: ISODate("2024-01-01T00:00:00Z")
}
```

---

## Dynamic Map Status

### Example: Check Server for Active Maps

```javascript
app.get('/maps.json', async (req, res) => {
  const allMaps = await db.maps.find();
  
  // Check which maps are active on game server
  const serverMaps = await checkGameServer();
  
  const maps = allMaps.map(map => ({
    tag: map.tag,
    name: map.name,
    active: serverMaps.includes(map.tag)
  }));
  
  res.json({ maps });
});
```

---

## Validation

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["maps"],
  "properties": {
    "maps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["tag", "name", "active"],
        "properties": {
          "tag": {
            "type": "string",
            "pattern": "^mp_[a-z0-9_]+$"
          },
          "name": {
            "type": "string",
            "minLength": 1
          },
          "active": {
            "type": "boolean"
          }
        }
      }
    }
  }
}
```

---

## Testing

### cURL Test

```bash
curl http://localhost:3000/maps.json | jq
```

**Expected output:**
```json
{
  "maps": [
    {
      "tag": "mp_backlot",
      "name": "Backlot",
      "active": true
    }
  ]
}
```

### Validation Checklist

- [ ] Response has `maps` array
- [ ] Each map has `tag` field (string)
- [ ] Each map has `name` field (string)
- [ ] Each map has `active` field (boolean)
- [ ] No extra/missing fields (optional fields OK)
- [ ] Content-Type is `application/json`
- [ ] CORS headers set if needed

---

## Common CoD4 Maps Reference

```json
[
  { "tag": "mp_backlot", "name": "Backlot", "active": true },
  { "tag": "mp_bloc", "name": "Bloc", "active": true },
  { "tag": "mp_bog", "name": "Bog", "active": true },
  { "tag": "mp_countdown", "name": "Countdown", "active": true },
  { "tag": "mp_crash", "name": "Crash", "active": true },
  { "tag": "mp_crossfire", "name": "Crossfire", "active": true },
  { "tag": "mp_citystreets", "name": "District", "active": true },
  { "tag": "mp_convoy", "name": "Ambush", "active": true },
  { "tag": "mp_farm", "name": "Downpour", "active": true },
  { "tag": "mp_overgrown", "name": "Overgrown", "active": true },
  { "tag": "mp_pipeline", "name": "Pipeline", "active": true },
  { "tag": "mp_shipment", "name": "Shipment", "active": true },
  { "tag": "mp_showdown", "name": "Showdown", "active": true },
  { "tag": "mp_strike", "name": "Strike", "active": true },
  { "tag": "mp_vacant", "name": "Vacant", "active": true },
  { "tag": "mp_cargoship", "name": "Wet Work", "active": true }
]
```

---

## Migration Script Example

### Convert Existing String Array

```javascript
// Old format
const oldMaps = ["mp_backlot", "mp_crash", "mp_convoy"];

// Convert to new format
const newMaps = oldMaps.map(tag => ({
  tag: tag,
  name: tag.replace('mp_', '').charAt(0).toUpperCase() + 
        tag.replace('mp_', '').slice(1),
  active: true
}));

console.log(JSON.stringify({ maps: newMaps }, null, 2));
```

---

## Rollback Plan

If needed to rollback, the frontend can be temporarily patched:

```typescript
// Temporary adapter in api.ts
async fetchMaps(): Promise<CodMap[]> {
  const response = await fetch(config.MAPS_JSON_URL);
  const data = await response.json();
  
  // Check if old format
  if (Array.isArray(data.maps) && typeof data.maps[0] === 'string') {
    // Convert old format to new
    return data.maps.map(tag => ({
      tag,
      name: tag.replace('mp_', ''),
      active: true
    }));
  }
  
  // New format
  return data.maps;
}
```

---

## Questions?

Contact frontend team or refer to:
- `CODMAP_MODEL_IMPLEMENTATION.md` - Full implementation details
- `CODMAP_QUICK_REFERENCE.md` - Quick usage guide

---

**Priority**: HIGH  
**Impact**: Required for frontend to work correctly  
**Deadline**: Before next deployment

