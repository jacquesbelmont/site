// Admin Configuration
export const ADMIN_CONFIG = {
  // Simple authentication - in production, use proper authentication
  credentials: {
    username: 'admin',
    password: 'admin123', // Change this to a secure password
  },
  
  // Session configuration
  session: {
    cookieName: 'admin_session',
    duration: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Admin features
  features: {
    analytics: true,
    seo: true,
    translations: true,
    members: true,
    youtube: true,
    blog: true,
    pages: true,
    settings: true,
  },
  
  // YouTube API configuration
  youtube: {
    apiKey: '', // Add your YouTube API key here
    channelId: '', // Add your YouTube channel ID here
  },
  
  // Analytics configuration
  analytics: {
    googleAnalytics: '',
    googleTagManager: '',
    hotjar: '',
    clarity: '',
  },
};

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const session = localStorage.getItem(ADMIN_CONFIG.session.cookieName);
  if (!session) return false;
  
  try {
    const sessionData = JSON.parse(session);
    const now = Date.now();
    return sessionData.expires > now;
  } catch {
    return false;
  }
}

export function authenticate(username: string, password: string): boolean {
  if (username === ADMIN_CONFIG.credentials.username && 
      password === ADMIN_CONFIG.credentials.password) {
    const sessionData = {
      authenticated: true,
      expires: Date.now() + ADMIN_CONFIG.session.duration,
    };
    localStorage.setItem(ADMIN_CONFIG.session.cookieName, JSON.stringify(sessionData));
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(ADMIN_CONFIG.session.cookieName);
}