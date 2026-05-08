const API_BASE = "/api";

export const apiClient = {
  getToken: () => localStorage.getItem("token"),

  async fetch(url: string, options: RequestInit = {}, retry = true) {
    const token = this.getToken();
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    // If token expired, try refreshing it - but only if we have a token
    if (response.status === 401 && retry && token) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        return this.fetch(url, options, false);
      }
    }

    // Only clear auth if we actually had a token (not if token wasn't loaded yet)
    if (response.status === 401) {
      if (token) {
        this.clearAuth();
      }
      return {
        success: false,
        message: "Session expired. Please login again.",
      };
    }

    try {
      return await response.json();
    } catch {
      return { success: false, message: `Server error (${response.status})` };
    }
  },

  async refreshToken() {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  },

  clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  async upload(url: string, formData: FormData) {
    const token = this.getToken();
    const response = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return response.json();
  },
};
