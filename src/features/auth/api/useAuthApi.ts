import { useState } from "react";
import { ApiResponse } from "@/app/types/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Auth Types
export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: "buyer" | "seller" | "investor" | "agent";
  termsAccepted: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  userType: string;
  role: string;
  profileImage?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Mock user data
let mockUsers: User[] = [
  {
    id: "USR-001",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+44 7700 900000",
    userType: "buyer",
    role: "buyer",
    emailVerified: true,
    createdAt: "2026-01-15T10:00:00Z",
    lastLogin: new Date().toISOString(),
  },
];

let nextUserId = 2;

export const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Register new user
   */
  const register = async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: data.password,
          role: data.userType === 'agent' ? 'agent' : 'user',
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      setLoading(false);
      return { success: true, data: result, message: result.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Login user
   */
  const login = async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }

      const authResponse: AuthResponse = {
        user: {
          id: result.user.id,
          firstName: result.user.name?.split(' ')[0] || '',
          lastName: result.user.name?.split(' ').slice(1).join(' ') || '',
          fullName: result.user.name,
          email: result.user.email,
          phoneNumber: '',
          userType: result.user.role,
          role: result.user.role,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        },
        token: result.accessToken,
        refreshToken: '',
        expiresIn: 900, // 15 minutes
      };

      setLoading(false);
      return { success: true, data: authResponse, message: result.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      // Clear any stored tokens/session
      // In a real app, invalidate token on server

      setLoading(false);
      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1000);

      const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        // Don't reveal if email exists for security
        setLoading(false);
        return {
          success: true,
          message: "If an account exists with this email, a password reset link has been sent.",
        };
      }

      setLoading(false);
      return {
        success: true,
        message: "Password reset email sent! Please check your inbox.",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send reset email";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Verify email with token
   */
  const verifyEmail = async (token: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      // In a real app, verify token and mark email as verified
      // For mock, just return success

      setLoading(false);
      return {
        success: true,
        message: "Email verified successfully!",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Email verification failed";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Refresh authentication token
   */
  const refreshToken = async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      // In a real app, validate refresh token and generate new access token
      // For mock, return new tokens

      const mockUser = mockUsers[0]; // Just use first user for mock

      const authResponse: AuthResponse = {
        user: mockUser,
        token: `mock_token_${mockUser.id}_${Date.now()}`,
        refreshToken: `mock_refresh_${mockUser.id}_${Date.now()}`,
        expiresIn: 3600,
      };

      setLoading(false);
      return {
        success: true,
        data: authResponse,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Token refresh failed";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get current user profile
   */
  const getCurrentUser = async (): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      // In a real app, get user from token
      // For mock, return first user
      const user = mockUsers[0];

      setLoading(false);
      return {
        success: true,
        data: user,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get user";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (userId: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      const userIndex = mockUsers.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      // Update user
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...data,
        fullName: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : mockUsers[userIndex].fullName,
      };

      setLoading(false);
      return {
        success: true,
        data: mockUsers[userIndex],
        message: "Profile updated successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Change password
   */
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1000);

      // In a real app, verify current password and update
      // For mock, just validate password strength

      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      setLoading(false);
      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to change password";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Delete account
   */
  const deleteAccount = async (userId: string, password: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1000);

      const userIndex = mockUsers.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      // In a real app, verify password and delete account
      mockUsers.splice(userIndex, 1);

      setLoading(false);
      return {
        success: true,
        message: "Account deleted successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete account";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    loading,
    error,
    register,
    login,
    logout,
    resetPassword,
    verifyEmail,
    refreshToken,
    getCurrentUser,
    updateProfile,
    changePassword,
    deleteAccount,
  };
};

