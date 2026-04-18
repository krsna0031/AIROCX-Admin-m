# AIROCX Admin Dashboard - Test Credentials

## Admin Login
- **URL**: `/admin` or `/admin/dashboard`
- **Password**: `AIROCXIP06`

## API Endpoints
All backend APIs are accessible at: `http://localhost:8001/api/`

### Available Endpoints:
- `GET /api/health` - Health check
- `POST /api/auth/login` - Admin login (requires password)
- `GET /api/characters` - Get all characters
- `POST /api/characters` - Create character (requires auth)
- `PUT /api/characters/{id}` - Update character (requires auth)
- `DELETE /api/characters/{id}` - Delete character (requires auth)
- `GET /api/showcase` - Get all showcase items
- `POST /api/showcase` - Create showcase item (requires auth)
- `PUT /api/showcase/{id}` - Update showcase item (requires auth)
- `DELETE /api/showcase/{id}` - Delete showcase item (requires auth)
- `GET /api/merch` - Get all merch items
- `POST /api/merch` - Create merch item (requires auth)
- `PUT /api/merch/{id}` - Update merch item (requires auth)
- `DELETE /api/merch/{id}` - Delete merch item (requires auth)

## Database
- **MongoDB**: Running on `mongodb://localhost:27017/airocx`
- **Collections**:
  - `characters` (4 pre-seeded)
  - `showcase_items` (8 pre-seeded)
  - `merch_items` (8 pre-seeded)
  - `admin_users`

## Notes
- All data has been migrated from LUMIQ to AIROCX branding
- Admin can edit SVG code directly
- Admin can swap in real images by providing image URLs
- The website automatically fetches data from the backend API
