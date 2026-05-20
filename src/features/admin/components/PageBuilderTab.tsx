import { Plus, FileText, Search, Eye, Edit, MoreVertical } from "lucide-react";
import { pageCategories } from "../../website/data/websitePages";

interface PageBuilderTabProps {
  pages: any[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  theme: any;
  onCreatePage: () => void;
  onEditPage: (page: any) => void;
  onNavigate: (path: string) => void;
}

export default function PageBuilderTab({
  pages,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  theme,
  onCreatePage,
  onEditPage,
  onNavigate,
}: PageBuilderTabProps) {
  const filteredPages = pages.filter((page) => {
    const matchesCategory = selectedCategory === "all" || page.category === selectedCategory;
    const matchesSearch =
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Page Builder</h2>
          <p className="text-slate-600 font-medium">
            Manage all 33 website pages with category filters (UC-001)
          </p>
        </div>
        <button
          onClick={onCreatePage}
          className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
        >
          <Plus className="size-5" />
          Create New Page
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {pageCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:scale-105 ${
              selectedCategory === category.id
                ? `${category.color} text-white`
                : "bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {category.name}
            <span className="ml-2 px-2 py-0.5 rounded-full bg-white/30 text-xs">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search pages by name or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
          />
          <Search className="size-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.map((page) => {
          const category = pageCategories.find((c) => c.id === page.category);
          return (
            <div
              key={page.id}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      page.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {page.status}
                  </span>
                  {category && (
                    <span
                      className={`px-2 py-1 ${category.color} text-white rounded-lg text-xs font-bold`}
                    >
                      {category.name.split(" ")[0]}
                    </span>
                  )}
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <MoreVertical className="size-4 text-slate-600" />
                </button>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-1">{page.name}</h4>
              <p className="text-xs text-slate-500 font-medium mb-2">{page.slug}</p>
              <p className="text-sm text-slate-600 font-medium mb-4">Template: {page.template}</p>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {page.views}
                </span>
                <span>{page.lastEdited}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditPage(page)}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-1"
                >
                  <Edit className="size-4" />
                  Edit
                </button>
                <button
                  onClick={() => onNavigate(page.slug)}
                  className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-1"
                >
                  <Eye className="size-4" />
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPages.length === 0 && (
        <div className="text-center py-12">
          <FileText className="size-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">No Pages Found</h3>
          <p className="text-slate-600 font-medium">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}
