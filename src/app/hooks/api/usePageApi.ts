import { useState } from "react";
import { ApiResponse, PaginatedResponse, QueryParams } from "../../types/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Page Types
export interface PageComponent {
  id: string;
  type: string;
  order: number;
  props: Record<string, any>;
  parentId?: string; // For nested components (columns, etc.)
  createdAt: string;
  updatedAt: string;
}

export interface PageVersion {
  id: string;
  pageId: string;
  versionNumber: number;
  components: PageComponent[];
  createdBy: string;
  createdAt: string;
  comment?: string;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  title?: string;
  metaDescription?: string;
  metaKeywords?: string;
  template: "blank" | "landing" | "content" | "blog" | "form";
  category: string;
  status: "draft" | "published" | "archived";
  components: PageComponent[];
  settings: {
    showInMenu?: boolean;
    menuOrder?: number;
    requireAuth?: boolean;
    customCSS?: string;
    customJS?: string;
  };
  seo: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
  analytics: {
    views: number;
    uniqueVisitors: number;
    avgTimeOnPage?: number;
    bounceRate?: number;
  };
  createdBy: string;
  updatedBy?: string;
  publishedBy?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  currentVersion: number;
  featuredImage?: string;
}

export interface PageFormData {
  name: string;
  slug: string;
  title?: string;
  metaDescription?: string;
  metaKeywords?: string;
  template: Page["template"];
  category: string;
  status: Page["status"];
  components: PageComponent[];
  settings?: Page["settings"];
  seo?: Page["seo"];
  featuredImage?: string;
}

// Mock pages data
let mockPages: Page[] = [
  {
    id: "PAGE-001",
    name: "Home Page",
    slug: "/",
    title: "King Property Auction - Find Your Dream Property",
    metaDescription: "Premier property auction platform in the UK",
    template: "landing",
    category: "main",
    status: "published",
    components: [
      {
        id: "COMP-001",
        type: "heading",
        order: 1,
        props: {
          text: "Welcome to King Property Auction",
          level: "h1",
          align: "center",
          color: "#1e293b",
          fontSize: "48px",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "COMP-002",
        type: "text",
        order: 2,
        props: {
          text: "Find your dream property at auction prices",
          align: "center",
          color: "#64748b",
          fontSize: "18px",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    settings: {
      showInMenu: true,
      menuOrder: 1,
      requireAuth: false,
    },
    seo: {
      ogTitle: "King Property Auction",
      ogDescription: "Premier property auction platform",
    },
    analytics: {
      views: 15243,
      uniqueVisitors: 8521,
      avgTimeOnPage: 145,
      bounceRate: 32,
    },
    createdBy: "USR-001",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
    publishedAt: "2026-01-01T12:00:00Z",
    currentVersion: 1,
  },
  {
    id: "PAGE-002",
    name: "About Us",
    slug: "/about-us",
    title: "About King Property Auction",
    template: "content",
    category: "informational",
    status: "published",
    components: [],
    settings: {
      showInMenu: true,
      menuOrder: 2,
    },
    seo: {},
    analytics: {
      views: 3421,
      uniqueVisitors: 2156,
    },
    createdBy: "USR-001",
    createdAt: "2026-01-05T00:00:00Z",
    updatedAt: "2026-02-10T00:00:00Z",
    publishedAt: "2026-01-05T10:00:00Z",
    currentVersion: 2,
  },
];

let mockVersions: PageVersion[] = [];
let nextPageId = 3;
let nextComponentId = 100;
let nextVersionId = 1;

export const usePageApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new page
   */
  const createPage = async (data: PageFormData): Promise<ApiResponse<Page>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1200);

      // Validate slug uniqueness
      const existingPage = mockPages.find((p) => p.slug === data.slug);
      if (existingPage) {
        throw new Error(`A page with slug "${data.slug}" already exists`);
      }

      // Generate component IDs
      const componentsWithIds = data.components.map((comp, index) => ({
        ...comp,
        id: comp.id || `COMP-${String(nextComponentId++).padStart(3, "0")}`,
        order: index + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      const newPage: Page = {
        id: `PAGE-${String(nextPageId).padStart(3, "0")}`,
        name: data.name,
        slug: data.slug,
        title: data.title || data.name,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        template: data.template,
        category: data.category,
        status: data.status,
        components: componentsWithIds,
        settings: data.settings || {
          showInMenu: false,
          menuOrder: mockPages.length + 1,
          requireAuth: false,
        },
        seo: data.seo || {},
        analytics: {
          views: 0,
          uniqueVisitors: 0,
        },
        createdBy: "USR-001", // Would come from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentVersion: 1,
        featuredImage: data.featuredImage,
      };

      if (data.status === "published") {
        newPage.publishedAt = new Date().toISOString();
        newPage.publishedBy = "USR-001";
      }

      mockPages.push(newPage);
      nextPageId++;

      // Create initial version
      createVersion(newPage.id, componentsWithIds, "Initial version");

      setLoading(false);
      return {
        success: true,
        data: newPage,
        message: `Page "${data.name}" created successfully`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create page";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get all pages with filters and pagination
   */
  const getPages = async (params?: QueryParams & {
    status?: Page["status"];
    category?: string;
    template?: Page["template"];
  }): Promise<PaginatedResponse<Page>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      let filteredPages = [...mockPages];

      // Apply filters
      if (params?.status) {
        filteredPages = filteredPages.filter((p) => p.status === params.status);
      }
      if (params?.category) {
        filteredPages = filteredPages.filter((p) => p.category === params.category);
      }
      if (params?.template) {
        filteredPages = filteredPages.filter((p) => p.template === params.template);
      }
      if (params?.search) {
        const search = params.search.toLowerCase();
        filteredPages = filteredPages.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.slug.toLowerCase().includes(search) ||
            p.title?.toLowerCase().includes(search)
        );
      }

      // Sort
      const sortBy = params?.sortBy || "updatedAt";
      const sortOrder = params?.sortOrder || "desc";
      filteredPages.sort((a, b) => {
        const aVal = a[sortBy as keyof Page];
        const bVal = b[sortBy as keyof Page];
        if (sortOrder === "asc") {
          return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
      });

      // Pagination
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      const startIndex = (page - 1) * pageSize;
      const paginatedPages = filteredPages.slice(startIndex, startIndex + pageSize);

      setLoading(false);
      return {
        success: true,
        data: paginatedPages,
        total: filteredPages.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredPages.length / pageSize),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch pages";
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
   * Get page by ID
   */
  const getPageById = async (id: string): Promise<ApiResponse<Page>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const page = mockPages.find((p) => p.id === id);

      if (!page) {
        throw new Error("Page not found");
      }

      setLoading(false);
      return {
        success: true,
        data: page,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch page";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get page by slug
   */
  const getPageBySlug = async (slug: string): Promise<ApiResponse<Page>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const page = mockPages.find((p) => p.slug === slug);

      if (!page) {
        throw new Error("Page not found");
      }

      // Increment view count
      page.analytics.views++;

      setLoading(false);
      return {
        success: true,
        data: page,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch page";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Update page
   */
  const updatePage = async (id: string, data: Partial<PageFormData>): Promise<ApiResponse<Page>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1000);

      const pageIndex = mockPages.findIndex((p) => p.id === id);

      if (pageIndex === -1) {
        throw new Error("Page not found");
      }

      // Check slug uniqueness if slug is being updated
      if (data.slug && data.slug !== mockPages[pageIndex].slug) {
        const existingPage = mockPages.find((p) => p.slug === data.slug && p.id !== id);
        if (existingPage) {
          throw new Error(`A page with slug "${data.slug}" already exists`);
        }
      }

      // Update components with IDs if needed
      let updatedComponents = mockPages[pageIndex].components;
      if (data.components) {
        updatedComponents = data.components.map((comp, index) => ({
          ...comp,
          id: comp.id || `COMP-${String(nextComponentId++).padStart(3, "0")}`,
          order: index + 1,
          updatedAt: new Date().toISOString(),
          createdAt: comp.createdAt || new Date().toISOString(),
        }));
      }

      // Update page
      const updatedPage: Page = {
        ...mockPages[pageIndex],
        ...data,
        components: updatedComponents,
        updatedAt: new Date().toISOString(),
        updatedBy: "USR-001",
        currentVersion: mockPages[pageIndex].currentVersion + 1,
      };

      // If publishing
      if (data.status === "published" && mockPages[pageIndex].status !== "published") {
        updatedPage.publishedAt = new Date().toISOString();
        updatedPage.publishedBy = "USR-001";
      }

      mockPages[pageIndex] = updatedPage;

      // Create new version
      if (data.components) {
        createVersion(id, updatedComponents, "Page updated");
      }

      setLoading(false);
      return {
        success: true,
        data: updatedPage,
        message: "Page updated successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update page";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Delete page
   */
  const deletePage = async (id: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      const pageIndex = mockPages.findIndex((p) => p.id === id);

      if (pageIndex === -1) {
        throw new Error("Page not found");
      }

      const deletedPage = mockPages[pageIndex];
      mockPages.splice(pageIndex, 1);

      // Delete associated versions
      mockVersions = mockVersions.filter((v) => v.pageId !== id);

      setLoading(false);
      return {
        success: true,
        message: `Page "${deletedPage.name}" deleted successfully`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete page";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Duplicate page
   */
  const duplicatePage = async (id: string, newName?: string): Promise<ApiResponse<Page>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1000);

      const sourcePage = mockPages.find((p) => p.id === id);

      if (!sourcePage) {
        throw new Error("Page not found");
      }

      // Create new slug
      const baseSlug = sourcePage.slug + "-copy";
      let newSlug = baseSlug;
      let counter = 1;
      while (mockPages.find((p) => p.slug === newSlug)) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Duplicate components with new IDs
      const duplicatedComponents = sourcePage.components.map((comp, index) => ({
        ...comp,
        id: `COMP-${String(nextComponentId++).padStart(3, "0")}`,
        order: index + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      const duplicatedPage: Page = {
        ...sourcePage,
        id: `PAGE-${String(nextPageId).padStart(3, "0")}`,
        name: newName || `${sourcePage.name} (Copy)`,
        slug: newSlug,
        status: "draft",
        components: duplicatedComponents,
        analytics: {
          views: 0,
          uniqueVisitors: 0,
        },
        createdBy: "USR-001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: undefined,
        publishedBy: undefined,
        currentVersion: 1,
      };

      mockPages.push(duplicatedPage);
      nextPageId++;

      setLoading(false);
      return {
        success: true,
        data: duplicatedPage,
        message: "Page duplicated successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to duplicate page";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Publish page
   */
  const publishPage = async (id: string): Promise<ApiResponse<Page>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      const pageIndex = mockPages.findIndex((p) => p.id === id);

      if (pageIndex === -1) {
        throw new Error("Page not found");
      }

      mockPages[pageIndex].status = "published";
      mockPages[pageIndex].publishedAt = new Date().toISOString();
      mockPages[pageIndex].publishedBy = "USR-001";
      mockPages[pageIndex].updatedAt = new Date().toISOString();

      setLoading(false);
      return {
        success: true,
        data: mockPages[pageIndex],
        message: "Page published successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to publish page";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Unpublish page (set to draft)
   */
  const unpublishPage = async (id: string): Promise<ApiResponse<Page>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      const pageIndex = mockPages.findIndex((p) => p.id === id);

      if (pageIndex === -1) {
        throw new Error("Page not found");
      }

      mockPages[pageIndex].status = "draft";
      mockPages[pageIndex].updatedAt = new Date().toISOString();

      setLoading(false);
      return {
        success: true,
        data: mockPages[pageIndex],
        message: "Page unpublished successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to unpublish page";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Create page version (internal helper)
   */
  const createVersion = (pageId: string, components: PageComponent[], comment?: string) => {
    const page = mockPages.find((p) => p.id === pageId);
    if (!page) return;

    const version: PageVersion = {
      id: `VER-${String(nextVersionId).padStart(3, "0")}`,
      pageId,
      versionNumber: page.currentVersion,
      components: JSON.parse(JSON.stringify(components)), // Deep copy
      createdBy: "USR-001",
      createdAt: new Date().toISOString(),
      comment,
    };

    mockVersions.push(version);
    nextVersionId++;
  };

  /**
   * Get page versions
   */
  const getPageVersions = async (pageId: string): Promise<ApiResponse<PageVersion[]>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(600);

      const versions = mockVersions
        .filter((v) => v.pageId === pageId)
        .sort((a, b) => b.versionNumber - a.versionNumber);

      setLoading(false);
      return {
        success: true,
        data: versions,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch versions";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Restore page version
   */
  const restoreVersion = async (pageId: string, versionId: string): Promise<ApiResponse<Page>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1000);

      const version = mockVersions.find((v) => v.id === versionId && v.pageId === pageId);
      if (!version) {
        throw new Error("Version not found");
      }

      const pageIndex = mockPages.findIndex((p) => p.id === pageId);
      if (pageIndex === -1) {
        throw new Error("Page not found");
      }

      // Restore components from version
      mockPages[pageIndex].components = JSON.parse(JSON.stringify(version.components));
      mockPages[pageIndex].updatedAt = new Date().toISOString();
      mockPages[pageIndex].currentVersion++;

      // Create new version for the restore
      createVersion(pageId, version.components, `Restored to version ${version.versionNumber}`);

      setLoading(false);
      return {
        success: true,
        data: mockPages[pageIndex],
        message: `Page restored to version ${version.versionNumber}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to restore version";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get page analytics
   */
  const getPageAnalytics = async (pageId: string): Promise<
    ApiResponse<{
      dailyViews: Array<{ date: string; views: number; uniqueVisitors: number }>;
      topReferrers: Array<{ source: string; visits: number }>;
      avgTimeOnPage: number;
      bounceRate: number;
    }>
  > => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      const page = mockPages.find((p) => p.id === pageId);
      if (!page) {
        throw new Error("Page not found");
      }

      // Mock analytics data
      const analytics = {
        dailyViews: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          views: Math.floor(Math.random() * 500) + 100,
          uniqueVisitors: Math.floor(Math.random() * 300) + 50,
        })).reverse(),
        topReferrers: [
          { source: "Google", visits: 1234 },
          { source: "Direct", visits: 856 },
          { source: "Facebook", visits: 432 },
          { source: "Twitter", visits: 287 },
        ],
        avgTimeOnPage: page.analytics.avgTimeOnPage || 120,
        bounceRate: page.analytics.bounceRate || 35,
      };

      setLoading(false);
      return {
        success: true,
        data: analytics,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch analytics";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get page statistics
   */
  const getPageStats = async (): Promise<
    ApiResponse<{
      totalPages: number;
      publishedPages: number;
      draftPages: number;
      archivedPages: number;
      totalViews: number;
      avgViewsPerPage: number;
      byCategory: Record<string, number>;
      byTemplate: Record<string, number>;
      recentPages: Page[];
    }>
  > => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      const totalViews = mockPages.reduce((sum, p) => sum + p.analytics.views, 0);

      const byCategory: Record<string, number> = {};
      const byTemplate: Record<string, number> = {};

      mockPages.forEach((page) => {
        byCategory[page.category] = (byCategory[page.category] || 0) + 1;
        byTemplate[page.template] = (byTemplate[page.template] || 0) + 1;
      });

      const recentPages = mockPages
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

      const stats = {
        totalPages: mockPages.length,
        publishedPages: mockPages.filter((p) => p.status === "published").length,
        draftPages: mockPages.filter((p) => p.status === "draft").length,
        archivedPages: mockPages.filter((p) => p.status === "archived").length,
        totalViews,
        avgViewsPerPage: mockPages.length > 0 ? Math.round(totalViews / mockPages.length) : 0,
        byCategory,
        byTemplate,
        recentPages,
      };

      setLoading(false);
      return {
        success: true,
        data: stats,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stats";
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
    createPage,
    getPages,
    getPageById,
    getPageBySlug,
    updatePage,
    deletePage,
    duplicatePage,
    publishPage,
    unpublishPage,
    getPageVersions,
    restoreVersion,
    getPageAnalytics,
    getPageStats,
  };
};
