import { useState } from "react";
import {
  X,
  Save,
  Eye,
  FileText,
  Monitor,
  Smartphone,
  Type,
  Layout,
  Image,
  Building2,
  Mail,
  Video,
  Map,
  MessageSquare,
  Zap,
  List,
  Package,
  GripVertical,
  Edit,
  Copy,
  Trash2,
  CheckCircle,
  Settings,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";

interface PageEditorProps {
  onClose: () => void;
  editData?: any;
}

export default function PageEditor({ onClose, editData }: PageEditorProps) {
  const theme = useTheme();
  const [pageComponents, setPageComponents] = useState<any[]>(editData?.components || []);
  const [pageSettings, setPageSettings] = useState({
    name: editData?.name || "",
    slug: editData?.slug || "",
    template: editData?.template || "blank",
    status: editData?.status || "draft",
    views: editData?.views || "0",
    lastEdited: editData?.lastEdited || "Just now",
    category: editData?.category || "Uncategorized",
  });

  const componentLibrary = [
    { id: "text", name: "Text Block", icon: Type, desc: "Add headings and paragraphs", gradient: "from-blue-500 to-indigo-600" },
    { id: "banner", name: "Hero Banner", icon: Layout, desc: "Large hero section with CTA", gradient: "from-purple-500 to-pink-600" },
    { id: "image", name: "Image", icon: Image, desc: "Single or gallery images", gradient: "from-green-500 to-emerald-600" },
    { id: "propertyGrid", name: "Property Grid", icon: Building2, desc: "Display property listings", gradient: "from-orange-500 to-amber-600" },
    { id: "form", name: "Contact Form", icon: Mail, desc: "Lead capture forms", gradient: "from-rose-500 to-red-600" },
    { id: "video", name: "Video", icon: Video, desc: "Embed videos", gradient: "from-cyan-500 to-blue-600" },
    { id: "map", name: "Map", icon: Map, desc: "Location map", gradient: "from-teal-500 to-cyan-600" },
    { id: "testimonials", name: "Testimonials", icon: MessageSquare, desc: "Customer reviews", gradient: "from-violet-500 to-purple-600" },
    { id: "cta", name: "Call to Action", icon: Zap, desc: "Action buttons", gradient: "from-fuchsia-500 to-pink-600" },
    { id: "features", name: "Feature List", icon: List, desc: "List of features", gradient: "from-indigo-500 to-blue-600" },
  ];

  const addComponent = (componentId: string) => {
    const component = componentLibrary.find(c => c.id === componentId);
    if (component) {
      setPageComponents([...pageComponents, {
        id: Date.now(),
        type: component.id,
        name: component.name,
        content: {}
      }]);
    }
  };

  const removeComponent = (id: number) => {
    setPageComponents(pageComponents.filter(c => c.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
        {/* Editor Header */}
        <div className={`bg-gradient-to-r ${theme.primary} p-6 flex items-center justify-between text-white`}>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <FileText className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black">Page Editor</h2>
              <p className="text-sm text-white/80 font-medium">Create your custom page with drag & drop components</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2">
              <Eye className="size-4" />
              Preview
            </button>
            <button 
              onClick={() => {
                alert("Page saved successfully!");
                onClose();
              }}
              className="px-4 py-2.5 bg-white text-blue-600 rounded-xl font-bold hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg"
            >
              <Save className="size-4" />
              Save Page
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-all"
            >
              <X className="size-6 text-white" />
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Components */}
          <div className="w-80 bg-slate-50 border-r-2 border-slate-200 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-black text-slate-900 mb-4">Page Settings</h3>
              
              {/* Page Settings Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Page Name</label>
                  <input
                    type="text"
                    value={pageSettings.name}
                    onChange={(e) => setPageSettings({...pageSettings, name: e.target.value})}
                    placeholder="e.g., About Us"
                    className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">URL Slug</label>
                  <input
                    type="text"
                    value={pageSettings.slug}
                    onChange={(e) => setPageSettings({...pageSettings, slug: e.target.value})}
                    placeholder="e.g., about-us"
                    className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Template</label>
                  <select
                    value={pageSettings.template}
                    onChange={(e) => setPageSettings({...pageSettings, template: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="blank">Blank Page</option>
                    <option value="landing">Landing Page</option>
                    <option value="content">Content Page</option>
                    <option value="blog">Blog Post</option>
                    <option value="form">Form Page</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                  <select
                    value={pageSettings.status}
                    onChange={(e) => setPageSettings({...pageSettings, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="h-px bg-slate-200 my-6" />

              <h3 className="text-lg font-black text-slate-900 mb-4">Add Components</h3>
              
              {/* Component Library */}
              <div className="space-y-2">
                {componentLibrary.map((component) => {
                  const Icon = component.icon;
                  return (
                    <button
                      key={component.id}
                      onClick={() => addComponent(component.id)}
                      className="w-full p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 transition-all text-left group hover:shadow-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`size-10 rounded-lg bg-gradient-to-br ${component.gradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                          <Icon className="size-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm mb-1">{component.name}</h4>
                          <p className="text-xs text-slate-600 font-medium">{component.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center - Canvas */}
          <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 overflow-y-auto">
            <div className="p-8">
              {/* Device Preview Toolbar */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button className="px-4 py-2 bg-white rounded-xl font-bold text-sm text-slate-700 hover:text-blue-600 transition-all flex items-center gap-2 shadow-md">
                  <Monitor className="size-4" />
                  Desktop
                </button>
                <button className="px-4 py-2 bg-white rounded-xl font-bold text-sm text-slate-700 hover:text-blue-600 transition-all flex items-center gap-2 shadow-md">
                  <Smartphone className="size-4" />
                  Mobile
                </button>
              </div>

              {/* Page Canvas */}
              <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl min-h-[600px] overflow-hidden">
                {/* Canvas Header Info */}
                <div className="bg-slate-50 border-b-2 border-slate-200 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {pageSettings.name || "Untitled Page"}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      /{pageSettings.slug || "page-url"}
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    pageSettings.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {pageSettings.status}
                  </span>
                </div>

                {/* Component Canvas */}
                <div className="p-6">
                  {pageComponents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className={`size-20 rounded-2xl bg-gradient-to-br ${theme.primary} flex items-center justify-center mb-4 shadow-lg`}>
                        <Package className="size-10 text-white" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">Start Building Your Page</h3>
                      <p className="text-slate-600 font-medium max-w-md">
                        Add components from the left sidebar to build your page. Drag and drop to reorder.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pageComponents.map((component, index) => {
                        const componentInfo = componentLibrary.find(c => c.id === component.type);
                        
                        if (!componentInfo) return null;
                        const Icon = componentInfo.icon;

                        return (
                          <div 
                            key={component.id}
                            className="group relative bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-xl p-6 hover:border-blue-500 transition-all"
                          >
                            {/* Component Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <GripVertical className="size-5 text-slate-400 cursor-move" />
                                <div className={`size-10 rounded-lg bg-gradient-to-br ${componentInfo.gradient} flex items-center justify-center shadow-md`}>
                                  <Icon className="size-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900">{componentInfo.name}</h4>
                                  <p className="text-xs text-slate-500 font-medium">Component #{index + 1}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all">
                                  <Edit className="size-4" />
                                </button>
                                <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all">
                                  <Copy className="size-4" />
                                </button>
                                <button 
                                  onClick={() => removeComponent(component.id)}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </div>

                            {/* Component Preview */}
                            <div className="bg-white rounded-lg p-4 border-2 border-dashed border-slate-300">
                              {component.type === "text" && (
                                <div>
                                  <h3 className="text-xl font-black text-slate-900 mb-2">Sample Heading</h3>
                                  <p className="text-slate-600 font-medium">This is a text block component. Click edit to customize the content.</p>
                                </div>
                              )}
                              {component.type === "banner" && (
                                <div className={`bg-gradient-to-r ${theme.primary} p-8 rounded-xl text-white text-center`}>
                                  <h2 className="text-3xl font-black mb-3">Hero Banner</h2>
                                  <p className="mb-4 text-white/90">Eye-catching hero section with call-to-action</p>
                                  <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold">Get Started</button>
                                </div>
                              )}
                              {component.type === "image" && (
                                <div className="bg-slate-200 h-48 rounded-lg flex items-center justify-center">
                                  <Image className="size-12 text-slate-400" />
                                </div>
                              )}
                              {component.type === "propertyGrid" && (
                                <div className="grid grid-cols-3 gap-4">
                                  {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-slate-100 rounded-lg p-3">
                                      <div className="bg-slate-200 h-24 rounded-lg mb-2" />
                                      <p className="text-xs font-bold text-slate-700">Property {i}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {component.type === "form" && (
                                <div className="space-y-3">
                                  <div className="h-10 bg-slate-100 rounded-lg" />
                                  <div className="h-10 bg-slate-100 rounded-lg" />
                                  <div className="h-24 bg-slate-100 rounded-lg" />
                                  <button className={`w-full py-2.5 bg-gradient-to-r ${theme.secondary} text-white rounded-lg font-bold`}>
                                    Submit Form
                                  </button>
                                </div>
                              )}
                              {component.type === "video" && (
                                <div className="bg-black h-48 rounded-lg flex items-center justify-center">
                                  <Video className="size-12 text-white" />
                                </div>
                              )}
                              {component.type === "map" && (
                                <div className="bg-slate-200 h-48 rounded-lg flex items-center justify-center">
                                  <Map className="size-12 text-slate-400" />
                                </div>
                              )}
                              {component.type === "testimonials" && (
                                <div className="bg-slate-100 p-4 rounded-lg">
                                  <p className="text-sm text-slate-600 italic mb-2">"Great service and platform!"</p>
                                  <p className="text-xs font-bold text-slate-900">- Customer Name</p>
                                </div>
                              )}
                              {component.type === "cta" && (
                                <div className="text-center">
                                  <h3 className="text-lg font-black text-slate-900 mb-2">Ready to Get Started?</h3>
                                  <button className={`px-8 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg`}>
                                    Take Action Now
                                  </button>
                                </div>
                              )}
                              {component.type === "features" && (
                                <div className="space-y-2">
                                  {["Feature 1", "Feature 2", "Feature 3"].map((f, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <CheckCircle className="size-5 text-green-600" />
                                      <span className="text-sm font-bold text-slate-900">{f}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="w-80 bg-slate-50 border-l-2 border-slate-200 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-black text-slate-900 mb-4">Page Information</h3>
              
              {/* Page Data Card */}
              {editData && (
                <div className="space-y-4 mb-6">
                  {/* Page Stats */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <Eye className="size-4" />
                      Page Statistics
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-700 font-medium">Total Views</span>
                        <span className="text-sm font-black text-blue-900">{pageSettings.views}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-700 font-medium">Last Edited</span>
                        <span className="text-xs font-bold text-blue-800">{pageSettings.lastEdited}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-700 font-medium">Category</span>
                        <span className="px-2 py-0.5 bg-blue-500 text-white rounded text-xs font-bold">{pageSettings.category}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-700 font-medium">Components</span>
                        <span className="text-sm font-black text-blue-900">{pageComponents.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Layout Information */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
                    <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <Layout className="size-4" />
                      Layout Information
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-purple-700 font-medium block mb-1">Template Type</span>
                        <div className="bg-white px-3 py-2 rounded-lg border border-purple-200">
                          <span className="text-xs font-bold text-purple-900">{pageSettings.template}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-purple-700 font-medium block mb-1">Page URL</span>
                        <div className="bg-white px-3 py-2 rounded-lg border border-purple-200">
                          <span className="text-xs font-bold text-purple-900">{pageSettings.slug}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-purple-700 font-medium block mb-1">Status</span>
                        <div className={`px-3 py-2 rounded-lg font-bold text-xs text-center ${
                          pageSettings.status === "Published" || pageSettings.status === "published"
                            ? "bg-green-100 text-green-700 border-2 border-green-300"
                            : "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                        }`}>
                          {pageSettings.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Components List */}
                  {pageComponents.length > 0 && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                      <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <Package className="size-4" />
                        Page Components ({pageComponents.length})
                      </h4>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {pageComponents.map((component, index) => {
                          const componentInfo = componentLibrary.find(c => c.id === component.type);
                          if (!componentInfo) return null;
                          const Icon = componentInfo.icon;
                          return (
                            <div key={component.id} className="bg-white px-2 py-2 rounded-lg border border-green-200 flex items-center gap-2">
                              <div className={`size-6 rounded bg-gradient-to-br ${componentInfo.gradient} flex items-center justify-center flex-shrink-0`}>
                                <Icon className="size-3 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-green-900 truncate">{componentInfo.name}</p>
                                <p className="text-xs text-green-600">#{index + 1}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="h-px bg-slate-200 my-6" />

              <h3 className="text-lg font-black text-slate-900 mb-4">Component Settings</h3>
              
              {pageComponents.length === 0 ? (
                <div className="text-center py-12">
                  <Settings className="size-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-medium">
                    Add components to see settings
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <h4 className="font-bold text-blue-900 mb-2">💡 Quick Tip</h4>
                    <p className="text-xs text-blue-700 font-medium">
                      Click the Edit button on any component to customize its content, styling, and behavior.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Page SEO</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Meta Title</label>
                        <input
                          type="text"
                          placeholder="Page title for SEO"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Meta Description</label>
                        <textarea
                          placeholder="Brief description"
                          rows={3}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Page Analytics</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 font-medium">Expected Load Time</span>
                        <span className="text-xs font-bold text-green-600">Fast (&lt;2s)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 font-medium">SEO Score</span>
                        <span className="text-xs font-bold text-blue-600">95/100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 font-medium">Mobile Friendly</span>
                        <CheckCircle className="size-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}