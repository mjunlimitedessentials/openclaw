# 18 — Local Resource Finder Architecture

## Overview

The Local Resource Finder is one of VitalRoot's highest-value features — it connects users to the concrete, community-level support that no amount of digital content can replace. The architecture must handle:
- Zip-code and geolocation-based search
- Multi-type, multi-condition filtering
- Cultural and language filtering
- Insurance/cost filtering
- Data freshness (manual + API-enriched)
- SEO (programmatic city pages)

---

## Resource Types Supported

| Type Key | Display Name | Examples |
|----------|-------------|---------|
| `dietitian` | Registered Dietitian | RD, RDN, Renal Dietitian |
| `diabetes_educator` | Diabetes Educator | CDCES-certified educators |
| `support_group` | Support Group | In-person or virtual diabetes, CKD, heart groups |
| `farmers_market` | Farmers Market | SNAP/EBT accepted priority |
| `park_trail` | Park / Walking Trail | Accessible paths noted |
| `community_health` | Community Health Center | FQHC, CHC |
| `food_bank` | Food Bank / Pantry | Health food pantry programs |
| `faith_center` | Faith/Community Center | Faith-based health programs |
| `assistance_org` | Assistance Organization | Insurance navigation, financial aid |
| `mental_health` | Mental Health Provider | Therapists familiar with chronic illness |
| `telehealth` | Telehealth Provider | Virtual-only options |

---

## Data Model (Extended)

```sql
-- Core resource table (from 07-database-schema.md, extended here)
CREATE TABLE local_resources (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  name                 TEXT NOT NULL,
  organization_name    TEXT,              -- parent org if different
  resource_type        TEXT NOT NULL,     -- enum from types above
  
  -- Address
  address_line1        TEXT,
  address_line2        TEXT,
  city                 TEXT NOT NULL,
  state                TEXT NOT NULL,     -- 2-letter USPS code
  zip_code             TEXT NOT NULL,
  country              TEXT DEFAULT 'US',
  lat                  NUMERIC(10, 7),
  lng                  NUMERIC(10, 7),
  
  -- Contact
  phone                TEXT,
  phone_notes          TEXT,             -- e.g., "Spanish line ext 2"
  email                TEXT,
  website_url          TEXT,
  booking_url          TEXT,             -- Direct appointment URL
  
  -- Service Details
  description          TEXT,
  services_offered     TEXT[],           -- specific services
  conditions_served    TEXT[],           -- condition keys
  languages            TEXT[],           -- ISO language codes
  
  -- Access
  accepts_medicare     BOOLEAN,
  accepts_medicaid     BOOLEAN,
  accepts_chip         BOOLEAN,
  sliding_scale        BOOLEAN DEFAULT FALSE,
  free                 BOOLEAN DEFAULT FALSE,
  cost_notes           TEXT,             -- e.g., "First visit free"
  
  -- Schedule
  hours                JSONB,            -- {mon: "9am-5pm", ...}
  appointment_required BOOLEAN,
  walk_ins_welcome     BOOLEAN,
  virtual_available    BOOLEAN DEFAULT FALSE,
  
  -- Accessibility
  ada_accessible       BOOLEAN,
  public_transit       BOOLEAN,
  parking_available    BOOLEAN,
  
  -- Cultural
  cultural_specialties TEXT[],          -- e.g., ['Latino', 'African American', 'Caribbean']
  faith_affiliated     BOOLEAN DEFAULT FALSE,
  
  -- Data management
  data_source          TEXT NOT NULL,    -- 'manual' | 'google_places' | 'healthgrades' | 'community'
  external_id          TEXT,             -- ID from source API
  verified_at          TIMESTAMPTZ,
  verified_by          TEXT,
  next_review_date     DATE,
  is_active            BOOLEAN DEFAULT TRUE,
  featured             BOOLEAN DEFAULT FALSE,  -- promoted partners (vetted, disclosed)
  
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for geo queries
CREATE INDEX ON local_resources USING GIST (
  ll_to_earth(lat, lng)
);
CREATE INDEX ON local_resources(zip_code);
CREATE INDEX ON local_resources(resource_type);
CREATE INDEX ON local_resources(state, city);
CREATE INDEX ON local_resources(is_active) WHERE is_active = TRUE;
```

---

## Search Query Logic

### Distance-Based Search (Primary)

```sql
-- Earth-distance module (PostgreSQL contrib)
-- Find resources within X miles of a given lat/lng

SELECT 
  r.*,
  ROUND(
    (earth_distance(
      ll_to_earth($lat, $lng),
      ll_to_earth(r.lat, r.lng)
    ) / 1609.34)::numeric, 1
  ) AS distance_miles
FROM local_resources r
WHERE 
  r.is_active = TRUE
  AND earth_box(ll_to_earth($lat, $lng), $radius_meters) @> ll_to_earth(r.lat, r.lng)
  AND ($resource_types IS NULL OR r.resource_type = ANY($resource_types))
  AND ($conditions IS NULL OR r.conditions_served && $conditions)
  AND ($languages IS NULL OR r.languages && $languages)
  AND ($medicaid IS NULL OR r.accepts_medicaid = $medicaid)
  AND ($free_only IS FALSE OR r.free = TRUE OR r.sliding_scale = TRUE)
ORDER BY distance_miles ASC
LIMIT 20;
```

### Zip-Code Fallback (when no lat/lng available)

```sql
-- Geocode zip to lat/lng server-side (Google Geocoding API or local zip table)
-- Then run the above query

-- Zip code coordinate table (loaded from free USPS/Census data)
CREATE TABLE zip_coordinates (
  zip_code   TEXT PRIMARY KEY,
  city       TEXT,
  state      TEXT,
  lat        NUMERIC(10, 7),
  lng        NUMERIC(10, 7),
  county     TEXT,
  timezone   TEXT
);
```

---

## API Endpoint (Detailed)

```
GET /local-resources
  ?zip=77001
  &lat=29.7604&lng=-95.3698  (preferred if available — client geolocation)
  &type=dietitian,support_group
  &condition=diabetes,ckd
  &language=es
  &accepts_medicaid=true
  &free=false
  &max_distance_miles=10
  &page=1
  &limit=20
```

### Response
```json
{
  "searchCenter": { "lat": 29.7604, "lng": -95.3698, "city": "Houston", "state": "TX" },
  "total": 47,
  "page": 1,
  "results": [
    {
      "id": "uuid",
      "name": "Harris County Community Health Center",
      "organizationName": "Harris Health System",
      "resourceType": "community_health",
      "resourceTypeDisplay": "Community Health Center",
      "address": {
        "line1": "2525 Holly Hall St",
        "city": "Houston",
        "state": "TX",
        "zip": "77054"
      },
      "distanceMiles": 1.3,
      "phone": "713-566-6400",
      "websiteUrl": "https://...",
      "bookingUrl": "https://...",
      "description": "Full-service community health center offering diabetes care, nutrition counseling, and care management.",
      "conditionsServed": ["diabetes", "heart_disease", "obesity"],
      "languages": ["en", "es", "vi"],
      "acceptsMedicaid": true,
      "acceptsMedicare": true,
      "slidingScale": true,
      "free": false,
      "virtualAvailable": true,
      "adaAccessible": true,
      "publicTransit": true,
      "hours": {
        "mon": "8am–6pm", "tue": "8am–6pm", "wed": "8am–6pm",
        "thu": "8am–8pm", "fri": "8am–5pm", "sat": "9am–1pm"
      },
      "appointmentRequired": false,
      "walkInsWelcome": true,
      "verifiedAt": "2026-02-15",
      "featured": false
    }
  ]
}
```

---

## Geo Resolution Flow

```
User enters zip code OR grants geolocation
          │
          ├── Geolocation granted → lat/lng direct to API
          │
          └── Zip code entered:
              → Server-side: lookup zip in zip_coordinates table
              → Get lat/lng for zip centroid
              → Run geo search with radius
              → Cache result in Redis: key=local_resources:{zip}:{types}:{conditions}
                TTL: 6 hours
```

---

## Data Sources & Enrichment

### MVP: Manual Entry (Sanity CMS)
- Staff curates top 500–1,000 resources in target launch markets
- Priority markets: Atlanta, Houston, Los Angeles, Chicago, Birmingham, Memphis, Miami, New York
- Resources with Spanish/language support and Medicaid acceptance prioritized

### Phase 2: API Enrichment
- **Google Places API:** Enrich manual entries with photos, hours, reviews
- **Healthgrades API:** Provider credentials, specialties, insurance
- **HRSA FQHC locator:** Federally Qualified Health Centers (free data)
- **USDA SNAP retailer locator:** Farmers markets accepting EBT
- **National Diabetes Education Program (NDEP):** Diabetes class finder

### Phase 3: Community Submissions
- Users can submit resources via form
- All submissions go to admin moderation queue
- Verified by staff before going live
- Community-submitted badge shown (not "verified")

### Data Freshness Protocol
- Manual resources: reviewed every 6 months (automated reminder to staff)
- API-enriched: re-synced weekly
- "Needs verification" flag shown to users if resource not verified in 12 months
- Users can report stale info (flags for staff review)

---

## Programmatic SEO Pages (Phase 2)

### Pattern
`/find-help/[state]/[city]`

Example: `/find-help/texas/houston`

### Page Structure
```
H1: "Health Support Resources in Houston, TX"

Intro copy (unique per city):
"Houston is home to a diverse community managing diabetes, heart disease, 
and other chronic conditions. Here are trusted local resources..."

[Local Resource Finder widget — pre-filtered to city]

[Results list — top 10 shown + "Load more"]

[City health context section]:
"In Harris County, approximately 1 in 8 adults has diabetes..."
(Source: CDC data, updated annually)

[Related resources]:
"Also in Houston: Farmers Markets | Support Groups | Dietitians"

[Schema: LocalBusiness for each resource]
```

### City Page Data Requirements
- Minimum 5 verified resources to generate page (avoid thin content)
- Unique intro copy required per city (no templated duplicate)
- City health stats pulled from CDC PLACES API (public data)

---

## Map Integration

### MVP: Leaflet.js (open source, no cost)
- Tile layer: OpenStreetMap (free)
- Markers: custom SVG icons by resource type
- Clustered markers at low zoom
- Mobile: map toggleable (list view default)

### Phase 2: Google Maps Platform
- Places Autocomplete for address input
- Street View integration for resource cards
- Better satellite/hybrid tile quality
- Directions integration (native maps deep link)

---

## Accessibility for Local Finder

- Search results announced via ARIA live region
- Map is fully keyboard navigable (tab to each marker)
- Screen-reader-friendly result cards
- "Skip to results" link
- Resource type icons have text alternatives
- Distance displayed in both miles and approximate drive/walk time
- Phone numbers are `tel:` links for one-tap calling on mobile
