// API configuration
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function to build API URLs
export function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// Matrix configuration
export const MATRIX_CONFIG = {
  homeserverUrl: 'https://messenger.b1.shuwantech.com',
  userId: '@admin:messenger.b1.shuwantech.com',
  password: 'thisismy.password',
  defaultRoomId: '!IrwcvKRWDxTHuwwtMi:messenger.b1.shuwantech.com',
  serverName: 'messenger.b1.shuwantech.com',
  knownServers: ['messenger.b1.shuwantech.com']
};