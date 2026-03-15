import { useState } from "react";
import { User, UserFormData, ApiResponse, PaginatedResponse, QueryParams } from "../../types/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock database
let mockUsers: User[] = [
  {
    id: "USR-001",
    firstName: "Emma",
    lastName: "Wilson",
    fullName: "Emma Wilson",
    email: "emma.wilson@example.com",
    phoneNumber: "+44 7700 900001",
    role: "buyer",
    accountStatus: "active",
    kycStatus: "verified",
    permissions: {
      canBid: true,
      canList: false,
      emailNotifications: true,
      smsAlerts: true,
    },
    createdAt: "2026-02-10T10:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
    lastLogin: "2026-03-13T08:30:00Z",
  },
  {
    id: "USR-002",
    firstName: "James",
    lastName: "Davis",
    fullName: "James Davis",
    email: "james.davis@example.com",
    phoneNumber: "+44 7700 900002",
    role: "seller",
    accountStatus: "active",
    kycStatus: "verified",
    permissions: {
      canBid: false,
      canList: true,
      emailNotifications: true,
      smsAlerts: false,
    },
    createdAt: "2026-02-12T10:00:00Z",
    updatedAt: "2026-02-12T10:00:00Z",
    lastLogin: "2026-03-12T14:20:00Z",
  },
  {
    id: "USR-003",
    firstName: "Michael",
    lastName: "Brown",
    fullName: "Michael Brown",
    email: "michael.brown@example.com",
    phoneNumber: "+44 7700 900003",
    role: "investor",
    accountStatus: "active",
    kycStatus: "verified",
    permissions: {
      canBid: true,
      canList: true,
      emailNotifications: true,
      smsAlerts: true,
    },
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-15T10:00:00Z",
    lastLogin: "2026-03-13T09:15:00Z",
  },
];

let nextUserId = 4;

export const useUserApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new user
   */
  const createUser = async (data: UserFormData): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1000);

      // Check if email already exists
      const existingUser = mockUsers.find((u) => u.email === data.email);
      if (existingUser) {
        throw new Error("Email already exists");
      }

      const newUser: User = {
        id: `USR-${String(nextUserId).padStart(3, "0")}`,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
        accountStatus: data.accountStatus,
        kycStatus: "pending",
        permissions: data.permissions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockUsers.push(newUser);
      nextUserId++;

      setLoading(false);
      return {
        success: true,
        data: newUser,
        message: "User created successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create user";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get all users with pagination and filters
   */
  const getUsers = async (params?: QueryParams): Promise<PaginatedResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      let filteredUsers = [...mockUsers];

      // Apply filters
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (u) =>
            u.fullName.toLowerCase().includes(searchLower) ||
            u.email.toLowerCase().includes(searchLower) ||
            u.phoneNumber.includes(searchLower)
        );
      }

      if (params?.status) {
        filteredUsers = filteredUsers.filter((u) => u.accountStatus === params.status);
      }

      if (params?.type) {
        filteredUsers = filteredUsers.filter((u) => u.role === params.type);
      }

      // Apply sorting
      if (params?.sortBy) {
        filteredUsers.sort((a, b) => {
          const aValue = a[params.sortBy as keyof User];
          const bValue = b[params.sortBy as keyof User];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return params.sortOrder === "desc"
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          }

          return 0;
        });
      }

      // Pagination
      const total = filteredUsers.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredUsers.slice(startIndex, endIndex);

      setLoading(false);
      return {
        success: true,
        data: paginatedData,
        total,
        page,
        pageSize,
        totalPages,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      };
    }
  };

  /**
   * Get a single user by ID
   */
  const getUserById = async (id: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(300);

      const user = mockUsers.find((u) => u.id === id);

      if (!user) {
        throw new Error("User not found");
      }

      setLoading(false);
      return {
        success: true,
        data: user,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch user";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Update an existing user
   */
  const updateUser = async (id: string, data: Partial<UserFormData>): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      const index = mockUsers.findIndex((u) => u.id === id);

      if (index === -1) {
        throw new Error("User not found");
      }

      // Check email uniqueness if email is being changed
      if (data.email && data.email !== mockUsers[index].email) {
        const existingUser = mockUsers.find((u) => u.email === data.email);
        if (existingUser) {
          throw new Error("Email already exists");
        }
      }

      const updatedUser: User = {
        ...mockUsers[index],
        ...data,
        fullName:
          data.firstName || data.lastName
            ? `${data.firstName || mockUsers[index].firstName} ${data.lastName || mockUsers[index].lastName}`
            : mockUsers[index].fullName,
        updatedAt: new Date().toISOString(),
      };

      mockUsers[index] = updatedUser;

      setLoading(false);
      return {
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update user";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Delete a user
   */
  const deleteUser = async (id: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockUsers.findIndex((u) => u.id === id);

      if (index === -1) {
        throw new Error("User not found");
      }

      mockUsers.splice(index, 1);

      setLoading(false);
      return {
        success: true,
        message: "User deleted successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Suspend a user account
   */
  const suspendUser = async (id: string, reason?: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockUsers.findIndex((u) => u.id === id);

      if (index === -1) {
        throw new Error("User not found");
      }

      mockUsers[index] = {
        ...mockUsers[index],
        accountStatus: "suspended",
        updatedAt: new Date().toISOString(),
      };

      setLoading(false);
      return {
        success: true,
        data: mockUsers[index],
        message: `User suspended${reason ? `: ${reason}` : ""}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to suspend user";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Activate a user account
   */
  const activateUser = async (id: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockUsers.findIndex((u) => u.id === id);

      if (index === -1) {
        throw new Error("User not found");
      }

      mockUsers[index] = {
        ...mockUsers[index],
        accountStatus: "active",
        updatedAt: new Date().toISOString(),
      };

      setLoading(false);
      return {
        success: true,
        data: mockUsers[index],
        message: "User activated successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to activate user";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Verify user KYC
   */
  const verifyUserKYC = async (id: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockUsers.findIndex((u) => u.id === id);

      if (index === -1) {
        throw new Error("User not found");
      }

      mockUsers[index] = {
        ...mockUsers[index],
        kycStatus: "verified",
        updatedAt: new Date().toISOString(),
      };

      setLoading(false);
      return {
        success: true,
        data: mockUsers[index],
        message: "KYC verified successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to verify KYC";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Reject user KYC
   */
  const rejectUserKYC = async (id: string, reason?: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockUsers.findIndex((u) => u.id === id);

      if (index === -1) {
        throw new Error("User not found");
      }

      mockUsers[index] = {
        ...mockUsers[index],
        kycStatus: "rejected",
        updatedAt: new Date().toISOString(),
      };

      setLoading(false);
      return {
        success: true,
        data: mockUsers[index],
        message: `KYC rejected${reason ? `: ${reason}` : ""}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reject KYC";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get user statistics
   */
  const getUserStats = async (): Promise<ApiResponse<any>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const stats = {
        total: mockUsers.length,
        active: mockUsers.filter((u) => u.accountStatus === "active").length,
        pending: mockUsers.filter((u) => u.accountStatus === "pending").length,
        suspended: mockUsers.filter((u) => u.accountStatus === "suspended").length,
        byRole: {
          buyers: mockUsers.filter((u) => u.role === "buyer").length,
          sellers: mockUsers.filter((u) => u.role === "seller").length,
          investors: mockUsers.filter((u) => u.role === "investor").length,
          agents: mockUsers.filter((u) => u.role === "agent").length,
          admins: mockUsers.filter((u) => u.role === "admin").length,
        },
        byKYC: {
          verified: mockUsers.filter((u) => u.kycStatus === "verified").length,
          pending: mockUsers.filter((u) => u.kycStatus === "pending").length,
          rejected: mockUsers.filter((u) => u.kycStatus === "rejected").length,
        },
      };

      setLoading(false);
      return {
        success: true,
        data: stats,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch user stats";
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
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    suspendUser,
    activateUser,
    verifyUserKYC,
    rejectUserKYC,
    getUserStats,
  };
};
