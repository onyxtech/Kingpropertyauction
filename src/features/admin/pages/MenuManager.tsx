import { useState } from "react";
import { Plus, Edit, Copy, Trash2, Menu, ExternalLink } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import MenuEditor from "../components/MenuEditor";
import { useMenuApi } from "../api/useMenuApi";
import { useTheme } from "../../../app/hooks/useTheme";

export default function MenuManagerPage() {
  const theme = useTheme();
  const { useGetMenus, useCreateMenu, useUpdateMenu, useDeleteMenu, useDuplicateMenu } = useMenuApi();
  const { data: menus, isLoading } = useGetMenus();
  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu();
  const deleteMenu = useDeleteMenu();
  const duplicateMenu = useDuplicateMenu();

  const [showEditor, setShowEditor] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const menuList = Array.isArray(menus) ? menus : [];

  const handleSave = async (menuData: any) => {
    try {
      if (editingMenu?._id) {
        await updateMenu.mutateAsync({ id: editingMenu._id, data: menuData });
        showToast(`Menu "${menuData.name}" updated!`);
      } else {
        await createMenu.mutateAsync(menuData);
        showToast(`Menu "${menuData.name}" created!`);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to save menu");
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu?")) return;
    try {
      await deleteMenu.mutateAsync(id);
      showToast("Menu deleted");
    } catch (err: any) {
      showToast(err.message || "Failed to delete");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateMenu.mutateAsync(id);
      showToast("Menu duplicated");
    } catch (err: any) {
      showToast(err.message || "Failed to duplicate");
    }
  };

  const locationLabels: Record<string, string> = {
    Header: "Header",
    Footer: "Footer",
    "Header Dropdown": "Header Dropdown",
    "Mobile Header": "Mobile Header",
    Sidebar: "Sidebar",
  };

  return (
    <AdminLayout activeTab="menuManager" onTabChange={() => {}}>
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold">
          {toastMsg}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Menu Manager</h2>
            <p className="text-slate-600 font-medium">Create and manage dynamic navigation menus</p>
          </div>
          <button
            onClick={() => { setEditingMenu(null); setShowEditor(true); }}
            className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
          >
            <Plus className="size-5" /> Create Menu
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Loading menus...</p>
          </div>
        ) : menuList.length === 0 ? (
          <div className="text-center py-16 bg-white/80 rounded-3xl border-2 border-white/60 shadow-xl">
            <Menu className="size-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No menus created yet</h3>
            <p className="text-slate-500 text-sm">Create your first navigation menu</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {menuList.map((menu: any) => (
              <div key={menu._id} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-black text-slate-900">{menu.name}</h4>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${menu.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}>
                    {menu.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-slate-600 font-medium">
                    <strong>Location:</strong> {locationLabels[menu.location] || menu.location}
                  </p>
                  <p className="text-sm text-slate-600 font-medium">
                    <strong>Menu Items:</strong> {menu.items?.length || 0}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingMenu(menu); setShowEditor(true); }}
                    className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-1"
                  >
                    <Edit className="size-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDuplicate(menu._id)}
                    className="px-4 py-2.5 bg-purple-100 text-purple-700 rounded-xl text-sm font-bold hover:bg-purple-200 transition-all"
                    title="Duplicate"
                  >
                    <Copy className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(menu._id)}
                    className="px-4 py-2.5 bg-red-100 text-red-700 rounded-xl text-sm font-bold hover:bg-red-200 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu Editor Modal */}
      {showEditor && (
        <MenuEditor
          editData={editingMenu}
          onClose={() => { setShowEditor(false); setEditingMenu(null); }}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  );
}