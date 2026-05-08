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

    // If token expired, try refreshing it
    if (response.status === 401 && retry && this.getToken()) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry original request with new token (no infinite retry)
        return this.fetch(url, options, false);
      }
      // Refresh failed - redirect to login
      this.clearAuth();
      window.location.href = "/login";
      return {
        success: false,
        message: "Session expired. Please login again.",
      };
    }

    return response.json();
  },

  async refreshToken() {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include", // Sends HTTP-only cookie
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
