import { Plus, Edit, Menu } from "lucide-react";

interface MenuManagerTabProps {
  theme: any;
  onCreateMenu: () => void;
  onEditMenu: (menu: any) => void;
}

const MENUS = [
  { id: 1, name: "Main Navigation", location: "Header", items: 8, status: "Active" },
  { id: 2, name: "Footer Links", location: "Footer", items: 12, status: "Active" },
  { id: 3, name: "User Account Menu", location: "Header Dropdown", items: 6, status: "Active" },
  { id: 4, name: "Mobile Menu", location: "Mobile Header", items: 10, status: "Active" },
];

export default function MenuManagerTab({ theme, onCreateMenu, onEditMenu }: MenuManagerTabProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Menu Manager</h2>
          <p className="text-slate-600 font-medium">
            Create dynamic navigation menus (UC-002)
          </p>
        </div>
        <button
          onClick={onCreateMenu}
          className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
        >
          <Plus className="size-5" />
          Create Menu
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MENUS.map((menu) => (
          <div
            key={menu.id}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-black text-slate-900">{menu.name}</h4>
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                {menu.status}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-slate-600 font-medium">
                <strong>Location:</strong> {menu.location}
              </p>
              <p className="text-sm text-slate-600 font-medium">
                <strong>Menu Items:</strong> {menu.items}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEditMenu(menu)}
                className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-1"
              >
                <Edit className="size-4" />
                Edit Menu
              </button>
              <button className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
                <Menu className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
