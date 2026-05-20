import { useState } from "react";
import { ApiResponse } from "@/app/types/api";
import { apiClient } from "@/lib/apiClient";

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

export const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: data.password,
          role: data.userType === 'agent' ? 'agent' : 'user',
        }),
      });

      if (!result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      setLoading(false);
      return { success: true, data: result, message: result.message };
    } catch (err: any) {
      const errorMessage = err?.message || 'Registration failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

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
        expiresIn: 900,
      };

      setLoading(false);
      return { success: true, data: authResponse, message: result.message };
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    loading,
    error,
    register,
    login,
  };
};
