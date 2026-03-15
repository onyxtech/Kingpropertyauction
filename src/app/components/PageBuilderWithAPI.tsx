import { useState, useEffect } from "react";
import { usePageApi, PageComponent } from "../hooks/api/usePageApi";
import PageBuilder from "./PageBuilder";
import { X, Save, Loader2, AlertCircle } from "lucide-react";

interface PageBuilderWithAPIProps {
  pageId?: string; // If editing existing page
  onClose: () => void;
  onSave?: (pageId: string) => void;
}

export default function PageBuilderWithAPI({ pageId, onClose, onSave }: PageBuilderWithAPIProps) {
  const {
    loading,
    error,
    createPage,
    updatePage,
    getPageById,
  } = usePageApi();

  const [pageData, setPageData] = useState<any>(null);
  const [pageSettings, setPageSettings] = useState({
    name: "",
    slug: "",
    template: "blank" as const,
    status: "draft" as const,
    category: "uncategorized",
    title: "",
    metaDescription: "",
  });
  const [components, setComponents] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(!pageId); // Show settings on new page

  // Load page data if editing
  useEffect(() => {
    if (pageId) {
      loadPage();
    }
  }, [pageId]);

  const loadPage = async () => {
    if (!pageId) return;

    const response = await getPageById(pageId);
    if (response.success && response.data) {
      const page = response.data;
      setPageData(page);
      setPageSettings({
        name: page.name,
        slug: page.slug,
        template: page.template,
        status: page.status,
        category: page.category,
        title: page.title || "",
        metaDescription: page.metaDescription || "",
      });
      
      // Convert API components to PageBuilder format
      setComponents(page.components.map(comp => ({
        type: comp.type,
        props: comp.props,
      })));
    }
  };

  const handleSave = async (builderComponents: any[]) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Validate required fields
      if (!pageSettings.name) {
        throw new Error("Page name is required");
      }
      if (!pageSettings.slug) {
        throw new Error("Page slug is required");
      }

      // Convert builder components to API format
      const apiComponents: PageComponent[] = builderComponents.map((comp, index) => ({
        id: "", // API will generate
        type: comp.type,
        order: index + 1,
        props: comp.props,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      let response;
      if (pageId) {
        // Update existing page
        response = await updatePage(pageId, {
          ...pageSettings,
          components: apiComponents,
        });
      } else {
        // Create new page
        response = await createPage({
          ...pageSettings,
          components: apiComponents,
        });
      }

      if (response.success) {
        setIsSaving(false);
        if (onSave && response.data) {
          onSave(response.data.id);
        }
        onClose();
      } else {
        throw new Error(response.error || "Failed to save page");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save page";
      setSaveError(errorMessage);
      setIsSaving(false);
    }
  };

  if (loading && !pageData) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header with Settings */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-white">
                {pageId ? `Editing: ${pageSettings.name || "Page"}` : "Create New Page"}
              </h2>
              <p className="text-white/80 text-sm font-medium">
                {showSettings ? "Configure page settings" : "Build your page with drag & drop"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!showSettings && (
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold transition-all"
              >
                Page Settings
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
              disabled={isSaving}
            >
              <X className="size-6 text-white" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {(error || saveError) && (
          <div className="mt-4 p-4 bg-red-100 border-2 border-red-300 rounded-xl flex items-center gap-3">
            <AlertCircle className="size-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 font-medium text-sm">{error || saveError}</p>
          </div>
        )}
      </div>

      {/* Settings Panel (if shown) */}
      {showSettings && (
        <div className="p-8 bg-slate-50 border-b-2 border-slate-200">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-black text-slate-900 mb-6">Page Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Page Name *
                </label>
                <input
                  type="text"
                  value={pageSettings.name}
                  onChange={(e) => setPageSettings({ ...pageSettings, name: e.target.value })}
                  placeholder="e.g., About Us"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={pageSettings.slug}
                  onChange={(e) => setPageSettings({ ...pageSettings, slug: e.target.value })}
                  placeholder="e.g., /about-us"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Template
                </label>
                <select
                  value={pageSettings.template}
                  onChange={(e) => setPageSettings({ ...pageSettings, template: e.target.value as any })}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="blank">Blank Page</option>
                  <option value="landing">Landing Page</option>
                  <option value="content">Content Page</option>
                  <option value="blog">Blog Post</option>
                  <option value="form">Form Page</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={pageSettings.category}
                  onChange={(e) => setPageSettings({ ...pageSettings, category: e.target.value })}
                  placeholder="e.g., main, informational"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Page Title (SEO)
                </label>
                <input
                  type="text"
                  value={pageSettings.title}
                  onChange={(e) => setPageSettings({ ...pageSettings, title: e.target.value })}
                  placeholder="Title for search engines"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={pageSettings.status}
                  onChange={(e) => setPageSettings({ ...pageSettings, status: e.target.value as any })}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={pageSettings.metaDescription}
                onChange={(e) => setPageSettings({ ...pageSettings, metaDescription: e.target.value })}
                placeholder="Brief description for search engines"
                rows={3}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
              >
                Continue to Page Builder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Builder */}
      {!showSettings && (
        <div className="flex-1 overflow-hidden">
          <PageBuilder
            key={pageId || "new-page"}
            initialComponents={components}
            onSave={(builderComponents) => handleSave(builderComponents)}
            isSaving={isSaving}
          />
        </div>
      )}
    </div>
  );
}