import { useState } from "react";
import {
  X,
  Save,
  Plus,
  GripVertical,
  Edit,
  Trash2,
  ExternalLink,
  Home,
  FileText,
  Building2,
  Mail,
  Phone,
  Users,
  Settings,
  ChevronRight,
  ChevronDown,
  Layers,
  Menu as MenuIcon,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

interface MenuEditorProps {
  onClose: () => void;
  editData?: any;
  onSave?: (menuData: any) => void;
}

export default function MenuEditor({ onClose, editData, onSave }: MenuEditorProps) {
  const theme = useTheme();
  const [menuSettings, setMenuSettings] = useState({
    name: editData?.name || "",
    location: editData?.location || "Header",
    status: editData?.status || "Active",
  });

  // Fix: Ensure menuItems is always an array
  const [menuItems, setMenuItems] = useState<any[]>(
    Array.isArray(editData?.items) ? editData.items : []
  );
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showItemForm, setShowItemForm] = useState(false);

  const [itemForm, setItemForm] = useState({
    label: "",
    url: "",
    type: "custom",
    icon: "FileText",
    target: "_self",
    parent: null,
  });

  const availableIcons = [
    { name: "Home", icon: Home },
    { name: "FileText", icon: FileText },
    { name: "Building2", icon: Building2 },
    { name: "Mail", icon: Mail },
    { name: "Phone", icon: Phone },
    { name: "Users", icon: Users },
    { name: "Settings", icon: Settings },
  ];

  const handleAddItem = () => {
    if (itemForm.label && itemForm.url) {
      if (editingItem) {
        setMenuItems(menuItems.map(item => 
          item.id === editingItem.id 
            ? { ...itemForm, id: editingItem.id }
            : item
        ));
        setEditingItem(null);
      } else {
        setMenuItems([...menuItems, { ...itemForm, id: Date.now() }]);
      }
      setItemForm({
        label: "",
        url: "",
        type: "custom",
        icon: "FileText",
        target: "_self",
        parent: null,
      });
      setShowItemForm(false);
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setItemForm(item);
    setShowItemForm(true);
  };

  const handleDeleteItem = (id: number) => {
    // Also delete any children of this item
    setMenuItems(menuItems.filter(item => item.id !== id && item.parent !== id));
  };

  // Get parent items (items with no parent)
  const getParentItems = () => {
    return menuItems.filter(item => !item.parent);
  };

  // Get children of a specific parent
  const getChildItems = (parentId: number) => {
    return menuItems.filter(item => item.parent === parentId);
  };

  // Count children for a parent
  const countChildren = (parentId: number) => {
    return menuItems.filter(item => item.parent === parentId).length;
  };

  const handleSave = () => {
    const menuData = {
      ...menuSettings,
      items: menuItems,
      itemCount: menuItems.length,
    };
    
    if (onSave) {
      onSave(menuData);
    }
    
    alert(`Menu "${menuSettings.name}" saved successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className={`bg-gradient-to-r ${theme.primary} p-6 flex items-center justify-between text-white`}>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <MenuIcon className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black">{editData ? 'Edit' : 'Create'} Menu</h2>
              <p className="text-sm text-white/80 font-medium">Build your navigation menu with drag & drop</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSave}
              className="px-4 py-2.5 bg-white text-blue-600 rounded-xl font-bold hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg"
            >
              <Save className="size-4" />
              Save Menu
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-all"
            >
              <X className="size-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Menu Settings & Add Items */}
          <div className="w-96 bg-slate-50 border-r-2 border-slate-200 overflow-y-auto">
            <div className="p-6">
              {/* Menu Settings */}
              <h3 className="text-lg font-black text-slate-900 mb-4">Menu Settings</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Menu Name *</label>
                  <input
                    type="text"
                    value={menuSettings.name}
                    onChange={(e) => setMenuSettings({...menuSettings, name: e.target.value})}
                    placeholder="e.g., Main Navigation"
                    className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Location *</label>
                  <select
                    value={menuSettings.location}
                    onChange={(e) => setMenuSettings({...menuSettings, location: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Header">Header</option>
                    <option value="Footer">Footer</option>
                    <option value="Header Dropdown">Header Dropdown</option>
                    <option value="Mobile Header">Mobile Header</option>
                    <option value="Sidebar">Sidebar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status *</label>
                  <select
                    value={menuSettings.status}
                    onChange={(e) => setMenuSettings({...menuSettings, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="h-px bg-slate-200 my-6" />

              {/* Add Menu Item */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Menu Items</h3>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setItemForm({
                      label: "",
                      url: "",
                      type: "custom",
                      icon: "FileText",
                      target: "_self",
                      parent: null,
                    });
                    setShowItemForm(true);
                  }}
                  className={`px-3 py-2 bg-gradient-to-r ${theme.secondary} text-white rounded-lg text-sm font-bold hover:scale-105 transition-all flex items-center gap-1 shadow-md`}
                >
                  <Plus className="size-4" />
                  Add Item
                </button>
              </div>

              {/* Item Form */}
              {showItemForm && (
                <div className="bg-white rounded-xl p-4 border-2 border-blue-200 mb-4 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {editingItem ? 'Edit' : 'Add'} Menu Item
                  </h4>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label *</label>
                    <input
                      type="text"
                      value={itemForm.label}
                      onChange={(e) => setItemForm({...itemForm, label: e.target.value})}
                      placeholder="e.g., Home"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">URL *</label>
                    <input
                      type="text"
                      value={itemForm.url}
                      onChange={(e) => setItemForm({...itemForm, url: e.target.value})}
                      placeholder="e.g., /home or https://..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Layers className="size-3" />
                      Parent Menu (Submenu)
                    </label>
                    <select
                      value={itemForm.parent || ""}
                      onChange={(e) => setItemForm({...itemForm, parent: e.target.value ? Number(e.target.value) : null})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">None (Top Level)</option>
                      {getParentItems()
                        .filter(item => !editingItem || item.id !== editingItem.id)
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                      {itemForm.parent ? "This will be a submenu item" : "This will be a top-level item"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Icon</label>
                    <select
                      value={itemForm.icon}
                      onChange={(e) => setItemForm({...itemForm, icon: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {availableIcons.map((icon) => (
                        <option key={icon.name} value={icon.name}>{icon.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Open In</label>
                    <select
                      value={itemForm.target}
                      onChange={(e) => setItemForm({...itemForm, target: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="_self">Same Window</option>
                      <option value="_blank">New Window</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setShowItemForm(false);
                        setEditingItem(null);
                      }}
                      className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddItem}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-all"
                    >
                      {editingItem ? 'Update' : 'Add'}
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2 text-sm">💡 Common Pages</h4>
                <div className="space-y-1">
                  {[
                    { label: "Home", url: "/" },
                    { label: "Properties", url: "/properties" },
                    { label: "Auctions", url: "/auctions" },
                    { label: "About", url: "/about" },
                    { label: "Contact", url: "/contact" },
                  ].map((page) => (
                    <button
                      key={page.url}
                      onClick={() => {
                        setItemForm({
                          ...itemForm,
                          label: page.label,
                          url: page.url,
                        });
                        setShowItemForm(true);
                      }}
                      className="w-full text-left px-2 py-1.5 bg-white hover:bg-blue-100 rounded-lg text-xs font-medium text-slate-700 hover:text-blue-700 transition-all"
                    >
                      {page.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Menu Preview */}
          <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 overflow-y-auto">
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                {/* Menu Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {menuSettings.name || "Untitled Menu"}
                      </h3>
                      <p className="text-sm text-slate-600 font-medium">
                        Location: {menuSettings.location} • Items: {menuItems.length}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                      menuSettings.status === "Active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {menuSettings.status}
                    </span>
                  </div>
                </div>

                {/* Menu Items List */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-slate-50 border-b-2 border-slate-200 p-4">
                    <h4 className="font-black text-slate-900">Menu Structure</h4>
                    <p className="text-xs text-slate-500 font-medium">Drag items to reorder</p>
                  </div>

                  <div className="p-4">
                    {menuItems.length === 0 ? (
                      <div className="text-center py-12">
                        <div className={`size-16 rounded-2xl bg-gradient-to-br ${theme.primary} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                          <MenuIcon className="size-8 text-white" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">No Menu Items Yet</h3>
                        <p className="text-slate-600 font-medium text-sm">
                          Click "Add Item" to start building your menu
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Show parent items first */}
                        {getParentItems().map((item) => {
                          const IconComponent = availableIcons.find(i => i.name === item.icon)?.icon || FileText;
                          const childrenCount = countChildren(item.id);
                          const children = getChildItems(item.id);
                          
                          return (
                            <div key={item.id}>
                              {/* Parent Item */}
                              <div 
                                className="group bg-gradient-to-r from-slate-50 to-white border-2 border-slate-200 rounded-xl p-4 hover:border-blue-500 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <GripVertical className="size-5 text-slate-400 cursor-move" />
                                  <div className={`size-10 rounded-lg bg-gradient-to-br ${theme.secondary} flex items-center justify-center shadow-md`}>
                                    <IconComponent className="size-5 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-slate-900">{item.label}</h4>
                                      {item.target === "_blank" && (
                                        <ExternalLink className="size-3 text-slate-400" />
                                      )}
                                      {childrenCount > 0 && (
                                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-bold flex items-center gap-1">
                                          <Layers className="size-3" />
                                          {childrenCount} submenu{childrenCount > 1 ? 's' : ''}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">{item.url}</p>
                                  </div>
                                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => handleEditItem(item)}
                                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                                    >
                                      <Edit className="size-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteItem(item.id)}
                                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                    >
                                      <Trash2 className="size-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Child Items (Submenus) */}
                              {children.length > 0 && (
                                <div className="ml-8 mt-2 space-y-2">
                                  {children.map((child) => {
                                    const ChildIconComponent = availableIcons.find(i => i.name === child.icon)?.icon || FileText;
                                    
                                    return (
                                      <div 
                                        key={child.id}
                                        className="group bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-3 hover:border-purple-400 transition-all relative"
                                      >
                                        {/* Submenu Indicator Line */}
                                        <div className="absolute -left-4 top-1/2 w-4 h-px bg-purple-300" />
                                        
                                        <div className="flex items-center gap-2">
                                          <ChevronRight className="size-4 text-purple-500" />
                                          <div className={`size-8 rounded-lg bg-gradient-to-br ${theme.secondary} flex items-center justify-center shadow-md`}>
                                            <ChildIconComponent className="size-4 text-white" />
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <h4 className="font-bold text-slate-800 text-sm">{child.label}</h4>
                                              {child.target === "_blank" && (
                                                <ExternalLink className="size-3 text-slate-400" />
                                              )}
                                              <span className="px-1.5 py-0.5 bg-purple-200 text-purple-700 rounded text-xs font-bold">
                                                Submenu
                                              </span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">{child.url}</p>
                                          </div>
                                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                              onClick={() => handleEditItem(child)}
                                              className="p-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all"
                                            >
                                              <Edit className="size-3" />
                                            </button>
                                            <button 
                                              onClick={() => handleDeleteItem(child.id)}
                                              className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                            >
                                              <Trash2 className="size-3" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview Section */}
                {menuItems.length > 0 && (
                  <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-slate-50 border-b-2 border-slate-200 p-4">
                      <h4 className="font-black text-slate-900">Live Preview</h4>
                      <p className="text-xs text-slate-500 font-medium">How your menu will look with submenus</p>
                    </div>
                    <div className="p-6">
                      {menuSettings.location.includes("Header") ? (
                        <div className={`bg-gradient-to-r ${theme.primary} rounded-xl p-4`}>
                          <div className="flex items-center gap-6">
                            <div className="text-white font-black text-xl">LOGO</div>
                            <nav className="flex items-center gap-4">
                              {getParentItems().map((item) => {
                                const IconComponent = availableIcons.find(i => i.name === item.icon)?.icon || FileText;
                                const children = getChildItems(item.id);
                                
                                return (
                                  <div key={item.id} className="relative group/menu">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-sm transition-all">
                                      <IconComponent className="size-4" />
                                      {item.label}
                                      {children.length > 0 && (
                                        <ChevronDown className="size-3" />
                                      )}
                                    </button>
                                    
                                    {/* Submenu Dropdown */}
                                    {children.length > 0 && (
                                      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl p-2 min-w-[200px] opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50">
                                        {children.map((child) => {
                                          const ChildIconComponent = availableIcons.find(i => i.name === child.icon)?.icon || FileText;
                                          return (
                                            <button
                                              key={child.id}
                                              className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-purple-50 rounded-lg text-sm font-medium transition-all"
                                            >
                                              <ChevronRight className="size-3 text-purple-500" />
                                              <ChildIconComponent className="size-4" />
                                              {child.label}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </nav>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 rounded-xl p-4">
                          <div className="space-y-2">
                            {getParentItems().map((item) => {
                              const IconComponent = availableIcons.find(i => i.name === item.icon)?.icon || FileText;
                              const children = getChildItems(item.id);
                              
                              return (
                                <div key={item.id}>
                                  <button className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-sm transition-all">
                                    <div className="flex items-center gap-3">
                                      <IconComponent className="size-4" />
                                      {item.label}
                                    </div>
                                    {children.length > 0 ? (
                                      <div className="flex items-center gap-1">
                                        <span className="text-xs text-purple-600 font-bold">{children.length}</span>
                                        <ChevronDown className="size-4 text-slate-400" />
                                      </div>
                                    ) : (
                                      <ChevronRight className="size-4 text-slate-400" />
                                    )}
                                  </button>
                                  
                                  {/* Submenus */}
                                  {children.length > 0 && (
                                    <div className="ml-6 mt-1 space-y-1">
                                      {children.map((child) => {
                                        const ChildIconComponent = availableIcons.find(i => i.name === child.icon)?.icon || FileText;
                                        return (
                                          <button
                                            key={child.id}
                                            className="w-full flex items-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-slate-700 rounded-lg text-sm font-medium transition-all"
                                          >
                                            <ChevronRight className="size-3 text-purple-500" />
                                            <ChildIconComponent className="size-3" />
                                            {child.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}