/**
 * App + API config.
 *
 * App mode (waitlist | full) is controlled by the backend:
 *   APP_MODE=waitlist uvicorn ...
 *   APP_MODE=full uvicorn ...
 *   ./run.sh waitlist | ./run.sh full
 *
 * The mobile app reads mode from GET /api/health on launch.
 */
import { Platform } from 'react-native';

export type AppMode = 'waitlist' | 'full';

const HOST = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';

export const API_BASE_URL = `http://${HOST}:8000/api`;
