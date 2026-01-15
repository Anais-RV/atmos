# Session-Gated Alert Persistence Implementation

## Overview
Implemented user-authenticated alert history persistence. Alerts are now saved to MongoDB with user association, and retrieval is gated by session authentication.

## Changes Made

### 1. Backend: AlertDocument Model
**File**: [backend/weather/documents.py](backend/weather/documents.py)

Added a new MongoDB document model for alerts:
- `user_id`: Associates alert with Django User (IntField)
- `city_id`: Links to city (IntField)
- `title`: Alert title (StringField, max 255 chars)
- `type`: Alert type/category (StringField, max 50 chars)
- `message`: Alert message/description (StringField)
- `created_at`: Timestamp when alert created (DateTimeField)
- `updated_at`: Timestamp of last update (DateTimeField)
- **Index**: Composite index on (user_id, -created_at) for efficient filtering

**Key Method**: `to_dict()` - serializes document to JSON-ready dictionary with ISO format timestamps

### 2. Backend: AlertsListView Enhancement
**File**: [backend/weather/views.py](backend/weather/views.py#L501)

Updated the placeholder AlertsListView with full session-gated persistence:

#### GET /api/alerts/
- **Authenticated users**: Returns their alerts sorted by creation date (newest first), serialized via `to_dict()`
- **Anonymous users**: Returns empty list `[]`
- **Status**: 200 OK

#### POST /api/alerts/
- **Authenticated users**: 
  - Accepts JSON payload: `{city_id, title, type, message}`
  - Validates all required fields (400 if missing)
  - Creates AlertDocument with user_id from request.user
  - **Status**: 201 Created (returns created alert)
- **Anonymous users**: 
  - Returns 401 Unauthorized with error message
  - No alert is saved

### 3. Data Seeding

#### Management Command
**File**: [backend/weather/management/commands/seed_alerts.py](backend/weather/management/commands/seed_alerts.py)

Django management command to populate test data:
- Creates or reuses test user `testuser:testpass123`
- Clears existing alerts for user
- Seeds 3 sample Spanish-language alerts:
  1. Temperature extreme warning (Madrid)
  2. Storm warning (Barcelona)
  3. Heavy rain alert (Valencia)

**Usage**: `python manage.py seed_alerts`

#### Script Version
**File**: [backend/scripts/seed_alerts.py](backend/scripts/seed_alerts.py) (legacy, see management command instead)

### 4. Testing
**File**: [backend/test_alerts.py](backend/test_alerts.py)

Comprehensive unit tests verifying:
- AlertDocument creation and persistence
- User-specific alert filtering
- Serialization to dictionary format
- Multiple alert creation
- Data isolation between users

**All tests PASS** ✓

## How It Works

### User Flow: View Alerts
1. User navigates to `/history` page
2. Frontend calls `GET /api/alerts/`
3. Backend checks `request.user.is_authenticated`
   - If authenticated: queries MongoDB for alerts where `user_id == request.user.id`, orders by `-created_at`
   - If anonymous: returns empty list
4. Frontend receives array of alert objects and renders them

### User Flow: Save Alert
1. Frontend calls `POST /api/alerts/` with alert data
2. Backend checks authentication
   - If not authenticated: responds 401 Unauthorized
   - If authenticated: 
     - Validates required fields (city_id, title, type, message)
     - Creates AlertDocument with `user_id = request.user.id`
     - Saves to MongoDB
     - Returns 201 Created with alert object

## Security

✓ **Session-gated access**: Only authenticated users can save alerts
✓ **User isolation**: Each user sees only their own alerts
✓ **Input validation**: Required fields checked before saving
✓ **Error handling**: Graceful error responses with descriptive messages

## Frontend Integration

The existing [frontend/src/components/features/history/WeatherHistory.jsx](../frontend/src/components/features/history/WeatherHistory.jsx) already handles:
- Array and paginated response formats
- Loading/error/empty states
- Display of alert title, type, city, message, and timestamp

No frontend changes needed—it works as-is with the new backend.

## Testing

### Unit Tests
```bash
cd backend
python test_alerts.py
```
**Result**: All tests pass ✓

### Seed Test Data
```bash
python manage.py seed_alerts
```
**Result**: Creates test user and 3 sample alerts ✓

### Manual Testing
1. Log in as `testuser:testpass123` (created by seed command)
2. Navigate to `/history` page
3. Should see 3 sample alerts (newest first):
   - Alerta de lluvia intensa (Valencia)
   - Aviso de tormenta (Barcelona)
   - Alerta de temperatura extrema (Madrid)

## Database Schema

### MongoDB Collection: `alerts`
```javascript
{
  "_id": ObjectId,
  "user_id": 4,                    // Django User.id
  "city_id": 1,                    // City reference
  "title": "Alerta de temperatura extrema",
  "type": "temperature_extreme",
  "message": "Se esperan temperaturas máximas superiores a 40°C en Madrid.",
  "created_at": ISODate("2025-12-22T12:11:18.479Z"),
  "updated_at": ISODate("2025-12-22T12:11:18.480Z")
}
```

**Index**: `(user_id, -created_at)` for fast filtering and sorting

## Summary

✅ **Requirement Met**: "Guardar historial solo si detecta sesion iniciada del usuario"  
✅ **Alerts persist** to MongoDB only for authenticated users  
✅ **Users see only their own** alerts, newest first  
✅ **Anonymous users see empty** list (no errors, graceful UX)  
✅ **Frontend ready** to display real alerts  
✅ **Test data seeded** and tests pass  

The system is production-ready for alert history management with proper session-gating.
