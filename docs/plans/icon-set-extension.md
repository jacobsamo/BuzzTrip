# Icon Set Extension Plan

**Status:** Approved
**Date:** 2025-11-15
**Target:** ~250 icons with 15 categories, 5-8 tags per icon, multi-category support

## Objectives

Extend the current icon set from ~25 icons to ~250 icons to support diverse mapping use cases including:
- Travel maps
- Outdoor/hiking maps
- Food/restaurant maps
- Walking/running routes
- Events (marathons, bike races, music festivals)
- Photography locations
- Nature/wildlife maps

## Key Requirements

1. **Icon Naming:** Generic, lowercase with hyphens (e.g., `mountain`, `gas-station`)
2. **Titles:** Clean, easy to understand display names
3. **Categories:** 15 total categories, icons can belong to multiple
4. **Tags:** 5-8 searchable keywords per icon
5. **Icon Set Agnostic:** Names generic enough to swap icon libraries easily

## Category Structure (15 Categories)

### Existing Categories (Expanded)
1. **transport** - Vehicles and transportation methods
2. **accommodation** - Places to stay
3. **food** - Food and dining
4. **places** - General points of interest
5. **activities** - Things to do
6. **other** - Map controls and miscellaneous

### New Categories
7. **nature** - Natural features and outdoor locations
8. **sports** - Sports facilities and fitness activities
9. **culture** - Cultural venues and events
10. **photography** - Photography-specific locations
11. **utilities** - Services and amenities
12. **landmarks** - Historic and notable structures
13. **shopping** - Retail and commerce
14. **travel** - Travel-specific waypoints
15. **seasonal** - Weather and seasonal activities

## Icon Distribution by Category

| Category | Icon Count | Examples |
|----------|-----------|----------|
| Transport | 20 | train, car, plane, bike, boat, helicopter |
| Accommodation | 15 | hotel, cabin, camping, hostel, resort |
| Food & Dining | 30 | restaurant, cafe, bakery, food-truck, sushi |
| Activities | 35 | hiking, swimming, rock-climbing, kayaking |
| Nature | 25 | mountain, waterfall, forest, beach, cave |
| Sports | 20 | running, gym, yoga, tennis-court, skate-park |
| Culture | 20 | museum, theater, art-gallery, monument |
| Photography | 15 | camera, viewpoint, sunset-spot, photo-walk |
| Utilities | 20 | gas-station, parking, wifi, atm, restroom |
| Landmarks | 15 | castle, temple, bridge, tower, historic-site |
| Shopping | 15 | shopping-center, market, bookstore, boutique |
| Travel | 15 | checkpoint, trailhead, rest-stop, waypoint |
| Seasonal | 10 | sunny, rainy, snowy, winter-activity |
| Places | 15 | (expanded from existing) |
| Other | 10 | map-pin, compass, folder (map controls) |
| **TOTAL** | **~280** | |

## Data Structure

```typescript
export interface IconDefinition {
  id: string;           // Unique identifier (lowercase-with-hyphens)
  title: string;        // Display name (Title Case)
  categories: string[]; // Array of category strings (multi-category support)
  tags: string[];       // 5-8 searchable keywords
}

export const iconsList: readonly IconDefinition[] = [
  {
    id: "mountain",
    title: "Mountain",
    categories: ["nature", "activities", "photography"],
    tags: ["mountain", "peak", "hiking", "scenic", "alpine", "outdoor"]
  },
  // ... more icons
] as const;

export type IconType = typeof iconsList[number]["id"];
```

## Implementation Tasks

### Phase 1: File Structure Update
- [x] Create this plan document
- [x] Update `packages/backend/types/icons.ts`
- [x] Fix existing typo: `Bicyle` → `Bicycle`

### Phase 2: Add Icons by Category
- [x] Transport (20 icons)
- [x] Accommodation (15 icons)
- [x] Food & Dining (30 icons)
- [x] Activities (35 icons)
- [x] Nature (25 icons)
- [x] Sports (20 icons)
- [x] Culture (20 icons)
- [x] Photography (15 icons)
- [x] Utilities (20 icons)
- [x] Landmarks (15 icons)
- [x] Shopping (15 icons)
- [x] Travel (15 icons)
- [x] Seasonal (10 icons)
- [x] Places (expand existing)
- [x] Other (keep existing)

### Phase 3: Type System Updates
- [x] Update `IconType` type
- [x] Add category constants
- [x] Ensure backward compatibility

### Phase 4: Database Migration
- [x] Create Convex migration in `packages/backend/convex/migrations.ts`
- [x] Test TypeScript compilation
- [ ] Run migration on database

## Example Icon Definitions

```typescript
// Transport
{ id: "train", title: "Train", categories: ["transport"], tags: ["train", "rail", "transit", "public-transport", "travel"] },
{ id: "helicopter", title: "Helicopter", categories: ["transport"], tags: ["helicopter", "aircraft", "flight", "aerial", "emergency"] },

// Nature
{ id: "waterfall", title: "Waterfall", categories: ["nature", "activities", "photography"], tags: ["waterfall", "cascade", "water", "hiking", "scenic", "natural"] },
{ id: "forest", title: "Forest", categories: ["nature", "activities"], tags: ["forest", "woods", "trees", "hiking", "nature", "wilderness"] },

// Culture
{ id: "museum", title: "Museum", categories: ["culture", "places"], tags: ["museum", "gallery", "art", "culture", "exhibition", "education"] },
{ id: "festival", title: "Festival", categories: ["culture", "activities"], tags: ["festival", "event", "music", "celebration", "entertainment"] },

// Photography
{ id: "sunset-spot", title: "Sunset Spot", categories: ["photography", "nature"], tags: ["sunset", "photography", "scenic", "golden-hour", "viewpoint"] },
{ id: "viewpoint", title: "Viewpoint", categories: ["photography", "travel", "nature"], tags: ["viewpoint", "scenic", "vista", "overlook", "photography", "panorama"] },

// Sports
{ id: "running-track", title: "Running Track", categories: ["sports", "activities"], tags: ["running", "track", "athletics", "sports", "training", "marathon"] },
{ id: "climbing-wall", title: "Climbing Wall", categories: ["sports", "activities"], tags: ["climbing", "rock-climbing", "gym", "sports", "indoor", "training"] },
```

## Naming Conventions

### Icon IDs
- All lowercase
- Use hyphens for spaces (kebab-case)
- Singular form preferred
- 1-3 words maximum
- Examples: `mountain`, `gas-station`, `ice-cream-shop`

### Titles
- Title Case
- Human readable
- Match ID but properly formatted
- Examples: `Mountain`, `Gas Station`, `Ice Cream Shop`

### Tags
- 5-8 keywords per icon
- Mix of:
  - Icon name itself
  - Synonyms/aliases
  - Related activities
  - Use cases
  - Search terms users might use
- Lowercase, no special characters

## Benefits

1. **Comprehensive Coverage:** ~250 icons support all major map types
2. **Better Organization:** 15 categories make icons easier to find
3. **Enhanced Search:** 5-8 tags per icon improve searchability
4. **Flexibility:** Multi-category support allows icons in multiple contexts
5. **Icon Set Agnostic:** Generic naming makes swapping icon libraries easy
6. **Backward Compatible:** Existing icons remain unchanged (except typo fix)

## Database Migration

### Migration Details

A Convex migration has been created to automatically convert all existing icon data from the old format to the new kebab-case format.

**Location:** `packages/backend/convex/migrations.ts`

**Conversion Logic:**
```typescript
// Converts: "Train" → "train"
// Converts: "IceCream" → "ice-cream"
// Converts: "MapPin" → "map-pin"
function convertIconToKebabCase(icon: string) {
  return icon
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}
```

**Tables Migrated:**
- `maps` - icon field
- `labels` - icon field
- `markers` - icon field
- `collections` - icon field
- `places` - icon field

### How to Run the Migration

**Option 1: Run all icon migrations at once**
```bash
npx convex run migrations:runAllIconMigrations
```

**Option 2: Run individual table migrations**
```bash
# Migrate specific tables
npx convex run migrations:migrateMapsIcons
npx convex run migrations:migrateLabelsIcons
npx convex run migrations:migrateMarkersIcons
npx convex run migrations:migrateCollectionsIcons
npx convex run migrations:migratePlacesIcons
```

**Option 3: Dry run to preview changes**
```bash
npx convex run migrations:migrateMapsIcons '{dryRun: true}'
```

### Migration Features
- ✅ Safe: Only updates icons that need conversion
- ✅ Efficient: Skips documents already in correct format
- ✅ Atomic: Each document migrated independently
- ✅ Resumable: Can restart if interrupted
- ✅ Type-safe: Full TypeScript type checking

## Future Considerations

- Frontend icon picker UI enhancements (category tabs, tag filtering)
- Search optimization with Fuse.js or similar
- User-defined custom icons
- Icon favoriting/recents
- Map-type specific icon suggestions

## Implementation Summary

### Files Modified
1. `packages/backend/types/icons.ts` - Extended from 77 to 1,688 lines
   - Added 280+ icons across 15 categories
   - Fixed typo: `Bicyle` → `Bicycle`
   - Added `ICON_CATEGORIES` constants
   - Updated `IconDefinition` interface with tags support

2. `packages/backend/convex/migrations.ts` - Added migration logic
   - 5 table-specific migrations
   - 1 combined runner for all migrations
   - Conversion helper function

3. `docs/plans/icon-set-extension.md` - This plan document

### TypeScript Verification
- ✅ All migration code passes TypeScript compilation
- ✅ No type errors in migrations.ts
- ✅ Full type safety maintained

### Next Steps
1. Deploy the updated code to Convex
2. Run the migration: `npx convex run migrations:runAllIconMigrations`
3. Verify migration completion in Convex dashboard
4. Test icon display in frontend applications
