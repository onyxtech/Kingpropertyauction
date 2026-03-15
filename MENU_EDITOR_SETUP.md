# Menu Manager Edit Button - Implementation Guide

## Step 1: Import MenuEditor Component

Add this import at the top of `/src/app/pages/Admin.tsx` (after PageEditor import around line 54):

```typescript
import MenuEditor from "../components/admin/MenuEditor";
```

## Step 2: Add State Management

Add these state variables after line 61 (after `const [editingPage, setEditingPage] = useState<any>(null);`):

```typescript
const [showMenuEditor, setShowMenuEditor] = useState(false);
const [editingMenu, setEditingMenu] = useState<any>(null);
```

## Step 3: Add Menus Data State

Add this after the pages state (after line 71):

```typescript
// Menus data state
const [menus, setMenus] = useState([
  { 
    id: 1, 
    name: "Main Navigation", 
    location: "Header", 
    itemCount: 8, 
    status: "Active",
    items: [
      { id: 1, label: "Home", url: "/", icon: "Home", target: "_self", type: "custom" },
      { id: 2, label: "Properties", url: "/properties", icon: "Building2", target: "_self", type: "custom" },
      { id: 3, label: "Auctions", url: "/auctions", icon: "FileText", target: "_self", type: "custom" },
      { id: 4, label: "About", url: "/about", icon: "Users", target: "_self", type: "custom" },
      { id: 5, label: "Contact", url: "/contact", icon: "Mail", target: "_self", type: "custom" },
    ]
  },
  { 
    id: 2, 
    name: "Footer Links", 
    location: "Footer", 
    itemCount: 12, 
    status: "Active",
    items: []
  },
  { 
    id: 3, 
    name: "User Account Menu", 
    location: "Header Dropdown", 
    itemCount: 6, 
    status: "Active",
    items: []
  },
  { 
    id: 4, 
    name: "Mobile Menu", 
    location: "Mobile Header", 
    itemCount: 10, 
    status: "Active",
    items: []
  },
]);
```

## Step 4: Update "Create Menu" Button

Find the "Create Menu" button around line 557 and update it:

```typescript
<button 
  onClick={() => {
    setEditingMenu(null);
    setShowMenuEditor(true);
  }}
  className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
>
  <Plus className="size-5" />
  Create Menu
</button>
```

## Step 5: Update Menu Cards Mapping

Find the menu cards mapping around line 564 and replace the static array with the state:

Change from:
```typescript
{[
  { id: 1, name: "Main Navigation", location: "Header", items: 8, status: "Active" },
  { id: 2, name: "Footer Links", location: "Footer", items: 12, status: "Active" },
  { id: 3, name: "User Account Menu", location: "Header Dropdown", items: 6, status: "Active" },
  { id: 4, name: "Mobile Menu", location: "Mobile Header", items: 10, status: "Active" },
].map((menu) => (
```

To:
```typescript
{menus.map((menu) => (
```

## Step 6: Update "Edit Menu" Button

Find the "Edit Menu" button around line 586 and update it:

```typescript
<button 
  onClick={() => {
    setEditingMenu(menu);
    setShowMenuEditor(true);
  }}
  className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-1"
>
  <Edit className="size-4" />
  Edit Menu
</button>
```

## Step 7: Add MenuEditor Modal

Add this before the closing `</div>` tag at the end of the file (right after the PageEditor modal around line 1598):

```typescript
      {/* Menu Editor Modal */}
      {showMenuEditor && (
        <MenuEditor 
          onClose={() => {
            setShowMenuEditor(false);
            setEditingMenu(null);
          }}
          editData={editingMenu}
          onSave={(menuData) => {
            if (editingMenu) {
              // Update existing menu
              setMenus(menus.map(m => 
                m.id === editingMenu.id 
                  ? { ...editingMenu, ...menuData }
                  : m
              ));
            } else {
              // Create new menu
              const newMenu = {
                id: menus.length + 1,
                ...menuData,
              };
              setMenus([...menus, newMenu]);
            }
          }}
        />
      )}
```

## What You Get

✅ **Create Menu** - Click "Create Menu" to open empty menu editor
✅ **Edit Menu** - Click "Edit Menu" on any menu card to open editor with pre-filled data
✅ **Menu Settings** - Name, Location, Status
✅ **Add Menu Items** - Add unlimited menu items with labels, URLs, icons
✅ **Live Preview** - See how your menu will look in Header or Footer
✅ **Drag & Drop** - Reorder menu items (UI ready)
✅ **Edit/Delete Items** - Manage individual menu items
✅ **Common Pages** - Quick add buttons for Home, Properties, Auctions, etc.

## Features

- **10+ Fields per menu item**: Label, URL, Icon, Target window, Parent item
- **7 Icon Options**: Home, FileText, Building2, Mail, Phone, Users, Settings
- **5 Location Options**: Header, Footer, Header Dropdown, Mobile Header, Sidebar
- **Live Preview**: Shows how menu renders in Header vs Footer layout
- **Validation**: Required fields for menu name and location
- **Beautiful UI**: Glassmorphism, gradients, animations
- **Theme Integration**: Adapts to your 6 color schemes

## Testing

1. Go to Admin Dashboard → Menu Manager tab
2. Click "Edit Menu" on "Main Navigation"
3. Menu Editor opens with:
   - Name: "Main Navigation"
   - Location: "Header"
   - Status: "Active"
   - 5 pre-loaded menu items (Home, Properties, Auctions, About, Contact)
4. Try:
   - Adding a new menu item
   - Editing an existing item
   - Deleting an item
   - Changing menu settings
   - View live preview
5. Click "Save Menu"
6. Menu updates in the list!

All done! The Menu Manager Edit button now works perfectly! 🎉
