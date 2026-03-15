import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Type,
  Image,
  Video,
  Layout,
  Grid3x3,
  Square,
  MousePointer,
  List,
  Mail,
  Star,
  MapPin,
  Play,
  Quote,
  Code,
  X,
  Eye,
  Save,
  Undo,
  Redo,
  Settings,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react";

// Component Types
const COMPONENT_TYPES = {
  HEADING: "heading",
  TEXT: "text",
  BUTTON: "button",
  IMAGE: "image",
  VIDEO: "video",
  DIVIDER: "divider",
  SPACER: "spacer",
  ICON: "icon",
  LIST: "list",
  FORM: "form",
  MAP: "map",
  TESTIMONIAL: "testimonial",
  PRICING: "pricing",
  GALLERY: "gallery",
  COLUMNS: "columns",
};

// Drag Item Types
const ItemTypes = {
  COMPONENT: "component",
  CANVAS_ITEM: "canvas_item",
};

// Component Library
const componentLibrary = [
  {
    type: COMPONENT_TYPES.HEADING,
    name: "Heading",
    icon: Type,
    category: "Basic",
    defaultProps: {
      text: "Your Heading Text",
      level: "h2",
      align: "left",
      color: "#000000",
      fontSize: "32px",
    },
  },
  {
    type: COMPONENT_TYPES.TEXT,
    name: "Text",
    icon: Type,
    category: "Basic",
    defaultProps: {
      text: "Add your text here...",
      align: "left",
      color: "#666666",
      fontSize: "16px",
    },
  },
  {
    type: COMPONENT_TYPES.BUTTON,
    name: "Button",
    icon: MousePointer,
    category: "Basic",
    defaultProps: {
      text: "Click Me",
      link: "#",
      bgColor: "#3b82f6",
      textColor: "#ffffff",
      size: "medium",
      align: "left",
    },
  },
  {
    type: COMPONENT_TYPES.IMAGE,
    name: "Image",
    icon: Image,
    category: "Media",
    defaultProps: {
      src: "https://via.placeholder.com/400x300",
      alt: "Image",
      width: "100%",
      align: "center",
    },
  },
  {
    type: COMPONENT_TYPES.VIDEO,
    name: "Video",
    icon: Video,
    category: "Media",
    defaultProps: {
      src: "",
      width: "100%",
      autoplay: false,
    },
  },
  {
    type: COMPONENT_TYPES.DIVIDER,
    name: "Divider",
    icon: Layout,
    category: "Layout",
    defaultProps: {
      color: "#e5e7eb",
      height: "2px",
      margin: "20px",
    },
  },
  {
    type: COMPONENT_TYPES.SPACER,
    name: "Spacer",
    icon: Square,
    category: "Layout",
    defaultProps: {
      height: "40px",
    },
  },
  {
    type: COMPONENT_TYPES.ICON,
    name: "Icon",
    icon: Star,
    category: "Elements",
    defaultProps: {
      icon: "star",
      size: "32px",
      color: "#3b82f6",
      align: "left",
    },
  },
  {
    type: COMPONENT_TYPES.LIST,
    name: "List",
    icon: List,
    category: "Elements",
    defaultProps: {
      items: ["Item 1", "Item 2", "Item 3"],
      style: "bullet",
    },
  },
  {
    type: COMPONENT_TYPES.COLUMNS,
    name: "Columns",
    icon: Grid3x3,
    category: "Layout",
    defaultProps: {
      columns: 2,
      gap: "20px",
    },
  },
];

// Draggable Component from Sidebar
function DraggableComponent({ component }: { component: typeof componentLibrary[0] }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { componentType: component.type, defaultProps: component.defaultProps },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const Icon = component.icon;

  return (
    <div
      ref={drag}
      className={`p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 cursor-move transition-all ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon className="size-6 text-blue-600" />
        <span className="text-xs font-bold text-slate-700">{component.name}</span>
      </div>
    </div>
  );
}

// Canvas Component Renderer
function CanvasComponent({
  component,
  index,
  moveComponent,
  selectComponent,
  deleteComponent,
  duplicateComponent,
  isSelected,
}: any) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CANVAS_ITEM,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CANVAS_ITEM,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveComponent(item.index, index);
        item.index = index;
      }
    },
  }));

  const renderComponent = () => {
    const props = component.props;

    switch (component.type) {
      case COMPONENT_TYPES.HEADING:
        const HeadingTag = props.level as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            style={{
              textAlign: props.align,
              color: props.color,
              fontSize: props.fontSize,
              fontWeight: "bold",
            }}
          >
            {props.text}
          </HeadingTag>
        );

      case COMPONENT_TYPES.TEXT:
        return (
          <p
            style={{
              textAlign: props.align,
              color: props.color,
              fontSize: props.fontSize,
            }}
          >
            {props.text}
          </p>
        );

      case COMPONENT_TYPES.BUTTON:
        const buttonSizes = {
          small: "px-4 py-2 text-sm",
          medium: "px-6 py-3 text-base",
          large: "px-8 py-4 text-lg",
        };
        return (
          <div style={{ textAlign: props.align }}>
            <button
              className={`${buttonSizes[props.size]} rounded-lg font-bold transition-all hover:scale-105`}
              style={{
                backgroundColor: props.bgColor,
                color: props.textColor,
              }}
            >
              {props.text}
            </button>
          </div>
        );

      case COMPONENT_TYPES.IMAGE:
        return (
          <div style={{ textAlign: props.align }}>
            <img
              src={props.src}
              alt={props.alt}
              style={{ width: props.width, maxWidth: "100%", height: "auto" }}
            />
          </div>
        );

      case COMPONENT_TYPES.VIDEO:
        return (
          <video
            src={props.src}
            controls
            autoPlay={props.autoplay}
            style={{ width: props.width, maxWidth: "100%" }}
          />
        );

      case COMPONENT_TYPES.DIVIDER:
        return (
          <hr
            style={{
              border: "none",
              backgroundColor: props.color,
              height: props.height,
              margin: props.margin + " 0",
            }}
          />
        );

      case COMPONENT_TYPES.SPACER:
        return <div style={{ height: props.height }} />;

      case COMPONENT_TYPES.ICON:
        return (
          <div style={{ textAlign: props.align }}>
            <Star style={{ width: props.size, height: props.size, color: props.color }} />
          </div>
        );

      case COMPONENT_TYPES.LIST:
        const ListTag = props.style === "bullet" ? "ul" : "ol";
        return (
          <ListTag className={props.style === "bullet" ? "list-disc pl-6" : "list-decimal pl-6"}>
            {props.items.map((item: string, i: number) => (
              <li key={i} className="mb-2">
                {item}
              </li>
            ))}
          </ListTag>
        );

      case COMPONENT_TYPES.COLUMNS:
        return (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
              gap: props.gap,
            }}
          >
            {Array.from({ length: props.columns }).map((_, i) => (
              <div key={i} className="bg-slate-100 p-4 rounded-lg text-center text-sm text-slate-500">
                Column {i + 1}
              </div>
            ))}
          </div>
        );

      default:
        return <div>Unknown component</div>;
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative p-4 mb-2 border-2 rounded-lg cursor-move transition-all ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
      } ${isDragging ? "opacity-50" : ""}`}
      onClick={() => selectComponent(index)}
    >
      {renderComponent()}

      {/* Component Toolbar */}
      {isSelected && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateComponent(index);
            }}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            title="Duplicate"
          >
            <Copy className="size-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteComponent(index);
            }}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            title="Delete"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// Property Editor
function PropertyEditor({ component, onUpdate }: { component: any; onUpdate: (component: any) => void }) {
  if (!component) {
    return (
      <div className="p-6 text-center text-slate-500">
        <Settings className="size-12 mx-auto mb-3 text-slate-300" />
        <p className="font-medium">Select a component to edit its properties</p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    onUpdate({
      ...component,
      props: {
        ...component.props,
        [key]: value,
      },
    });
  };

  const props = component.props;

  const renderPropertyInputs = () => {
    switch (component.type) {
      case COMPONENT_TYPES.HEADING:
        return (
          <>
            <div>
              <label className="block text-sm font-bold mb-2">Text</label>
              <input
                type="text"
                value={props.text}
                onChange={(e) => handleChange("text", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Heading Level</label>
              <select
                value={props.level}
                onChange={(e) => handleChange("level", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Font Size</label>
              <input
                type="text"
                value={props.fontSize}
                onChange={(e) => handleChange("fontSize", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Color</label>
              <input
                type="color"
                value={props.color}
                onChange={(e) => handleChange("color", e.target.value)}
                className="w-full h-10 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Alignment</label>
              <select
                value={props.align}
                onChange={(e) => handleChange("align", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        );

      case COMPONENT_TYPES.TEXT:
        return (
          <>
            <div>
              <label className="block text-sm font-bold mb-2">Text</label>
              <textarea
                value={props.text}
                onChange={(e) => handleChange("text", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Font Size</label>
              <input
                type="text"
                value={props.fontSize}
                onChange={(e) => handleChange("fontSize", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Color</label>
              <input
                type="color"
                value={props.color}
                onChange={(e) => handleChange("color", e.target.value)}
                className="w-full h-10 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Alignment</label>
              <select
                value={props.align}
                onChange={(e) => handleChange("align", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        );

      case COMPONENT_TYPES.BUTTON:
        return (
          <>
            <div>
              <label className="block text-sm font-bold mb-2">Button Text</label>
              <input
                type="text"
                value={props.text}
                onChange={(e) => handleChange("text", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Link</label>
              <input
                type="text"
                value={props.link}
                onChange={(e) => handleChange("link", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Size</label>
              <select
                value={props.size}
                onChange={(e) => handleChange("size", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Background Color</label>
              <input
                type="color"
                value={props.bgColor}
                onChange={(e) => handleChange("bgColor", e.target.value)}
                className="w-full h-10 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Text Color</label>
              <input
                type="color"
                value={props.textColor}
                onChange={(e) => handleChange("textColor", e.target.value)}
                className="w-full h-10 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Alignment</label>
              <select
                value={props.align}
                onChange={(e) => handleChange("align", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        );

      case COMPONENT_TYPES.IMAGE:
        return (
          <>
            <div>
              <label className="block text-sm font-bold mb-2">Image URL</label>
              <input
                type="text"
                value={props.src}
                onChange={(e) => handleChange("src", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Alt Text</label>
              <input
                type="text"
                value={props.alt}
                onChange={(e) => handleChange("alt", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Width</label>
              <input
                type="text"
                value={props.width}
                onChange={(e) => handleChange("width", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Alignment</label>
              <select
                value={props.align}
                onChange={(e) => handleChange("align", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        );

      case COMPONENT_TYPES.COLUMNS:
        return (
          <>
            <div>
              <label className="block text-sm font-bold mb-2">Number of Columns</label>
              <select
                value={props.columns}
                onChange={(e) => handleChange("columns", parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Gap</label>
              <input
                type="text"
                value={props.gap}
                onChange={(e) => handleChange("gap", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="20px"
              />
            </div>
          </>
        );

      default:
        return <p className="text-sm text-slate-500">No properties available</p>;
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-bold mb-4">
        {componentLibrary.find((c) => c.type === component.type)?.name} Settings
      </h3>
      {renderPropertyInputs()}
    </div>
  );
}

// Drop Zone Canvas - This needs to be inside DndProvider
function DropZoneCanvas({
  components,
  selectedIndex,
  addComponent,
  moveComponent,
  selectComponent,
  deleteComponent,
  duplicateComponent,
}: any) {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.COMPONENT,
    drop: (item: { componentType: string; defaultProps: any }) => {
      addComponent(item.componentType, item.defaultProps);
    },
  }));

  return (
    <div
      ref={drop}
      className="flex-1 p-8 overflow-y-auto bg-white"
    >
      {components.length === 0 ? (
        <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-300 rounded-xl">
          <div className="text-center">
            <Layout className="size-16 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-bold text-slate-400">Drag components here to start building</p>
            <p className="text-sm text-slate-400 mt-2">Select components from the left sidebar</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {components.map((component: any, index: number) => (
            <CanvasComponent
              key={index}
              component={component}
              index={index}
              moveComponent={moveComponent}
              selectComponent={selectComponent}
              deleteComponent={deleteComponent}
              duplicateComponent={duplicateComponent}
              isSelected={selectedIndex === index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Main Page Builder Component
export default function PageBuilder({
  initialComponents = [],
  onSave,
  isSaving = false,
}: {
  initialComponents?: any[];
  onSave?: (components: any[]) => void;
  isSaving?: boolean;
}) {
  const [components, setComponents] = useState<any[]>(initialComponents);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [history, setHistory] = useState<any[][]>([initialComponents]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addComponent = (type: string, props: any) => {
    const newComponents = [...components, { type, props }];
    setComponents(newComponents);
    updateHistory(newComponents);
    setSelectedIndex(newComponents.length - 1);
  };

  const moveComponent = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= components.length) return;

    const newComponents = [...components];
    const [moved] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, moved);
    setComponents(newComponents);
    updateHistory(newComponents);
    setSelectedIndex(toIndex);
  };

  const deleteComponent = (index: number) => {
    const newComponents = components.filter((_, i) => i !== index);
    setComponents(newComponents);
    updateHistory(newComponents);
    setSelectedIndex(null);
  };

  const duplicateComponent = (index: number) => {
    const newComponents = [
      ...components.slice(0, index + 1),
      { ...components[index] },
      ...components.slice(index + 1),
    ];
    setComponents(newComponents);
    updateHistory(newComponents);
    setSelectedIndex(index + 1);
  };

  const updateComponent = (index: number, updatedComponent: any) => {
    const newComponents = [...components];
    newComponents[index] = updatedComponent;
    setComponents(newComponents);
    updateHistory(newComponents);
  };

  const updateHistory = (newComponents: any[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newComponents);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponents(history[historyIndex - 1]);
      setSelectedIndex(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponents(history[historyIndex + 1]);
      setSelectedIndex(null);
    }
  };

  const savePage = () => {
    if (onSave) {
      onSave(components);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex bg-slate-50">
        {/* Left Sidebar - Component Library */}
        <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-black text-slate-900 mb-4">Components</h2>

            {["Basic", "Media", "Layout", "Elements"].map((category) => (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-bold text-slate-600 mb-3">{category}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {componentLibrary
                    .filter((c) => c.category === category)
                    .map((component) => (
                      <DraggableComponent key={component.type} component={component} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle - Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-slate-200 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={historyIndex === 0}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Undo"
              >
                <Undo className="size-5 text-slate-700" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Redo"
              >
                <Redo className="size-5 text-slate-700" />
              </button>
              <div className="w-px h-6 bg-slate-300 mx-2"></div>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`p-2 hover:bg-slate-100 rounded-lg transition-all ${
                  previewMode ? "bg-blue-100" : ""
                }`}
                title="Preview"
              >
                <Eye className="size-5 text-slate-700" />
              </button>
            </div>

            <button
              onClick={savePage}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Save className="size-5" />
              {isSaving ? "Saving..." : "Save Page"}
            </button>
          </div>

          {/* Canvas Area */}
          <DropZoneCanvas
            components={components}
            selectedIndex={selectedIndex}
            addComponent={addComponent}
            moveComponent={moveComponent}
            selectComponent={setSelectedIndex}
            deleteComponent={deleteComponent}
            duplicateComponent={duplicateComponent}
          />
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-black text-slate-900">Properties</h2>
          </div>
          <PropertyEditor
            component={selectedIndex !== null ? components[selectedIndex] : null}
            onUpdate={(updated) => selectedIndex !== null && updateComponent(selectedIndex, updated)}
          />
        </div>
      </div>
    </DndProvider>
  );
}
