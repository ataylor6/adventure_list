# Gram

Instagram-style mobile app skeleton: **Expo (TypeScript)** frontend + **FastAPI (Python)** backend.

```
gram/
├── backend/          # FastAPI API with in-memory seed data
└── mobile/           # Expo Router app (Home / Search / Create / Reels / Profile)
```

## What's included

**Mobile**
- Bottom tabs matching Instagram's navigation pattern
- Home feed with stories row, post cards, double-tap to like, pull-to-refresh
- Search explore grid
- Profile with stats + post grid
- Create / Reels placeholders for the next build-out

**Backend**
- `GET /api/feed` — paginated posts
- `GET /api/stories`
- `POST /api/posts/{id}/like` and `/save`
- `GET /api/profile/me` and profile posts
- Interactive docs at `http://127.0.0.1:8000/docs`

## Run the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Run the mobile app

```bash
cd mobile
npm install
npx expo start
```

Then press `i` for iOS Simulator, `a` for Android emulator, or scan the QR code with Expo Go.

### API URL on a physical device

Edit `mobile/constants/config.ts` and set `HOST` to your computer's LAN IP (e.g. `192.168.1.20`) instead of `127.0.0.1`.

## Suggested next steps

1. Persist data with SQLite/Postgres + SQLAlchemy
2. Add auth (JWT) and real user sessions
3. Image upload for Create
4. Comments sheet + notifications
5. Reels with `expo-av` / `expo-video`
