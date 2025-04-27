import React from "react";

interface ToolbarProps {
  execCommand: (command: string, value?: string) => void;
  formatBlock: (blockType: string) => void;
  insertCodeBlock: () => void;
  clearFormatting: () => void;
  clearContent: () => void;
  undo: () => void;
  redo: () => void;
  isFormatActive: (format: string) => boolean;
}

const fonts = ["Arial", "Times New Roman", "Courier New", "Georgia", "Verdana"];
const sizes = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];
const colors = [
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#FF0000" },
  { name: "Green", value: "#00FF00" },
  { name: "Blue", value: "#0000FF" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Pink", value: "#FF00FF" },
  { name: "Cyan", value: "#00FFFF" },
];

const Toolbar: React.FC<ToolbarProps> = ({
  execCommand,
  formatBlock,
  insertCodeBlock,
  clearFormatting,
  clearContent,
  undo,
  redo,
  isFormatActive,
}) => {
  return (
    <div
      className="toolbar"
      role="toolbar"
      aria-label="Text Formatting Options"
    >
      <div className="toolbar-group">
        <button
          className={`toolbar-button ${isFormatActive("bold") ? "active" : ""}`}
          onClick={() => execCommand("bold")}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          className={`toolbar-button ${
            isFormatActive("italic") ? "active" : ""
          }`}
          onClick={() => execCommand("italic")}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          className={`toolbar-button ${
            isFormatActive("underline") ? "active" : ""
          }`}
          onClick={() => execCommand("underline")}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
      </div>
      <div className="toolbar-group">
        <button
          className={`toolbar-button ${isFormatActive("h1") ? "active" : ""}`}
          onClick={() => formatBlock("h1")}
          title="Heading 1"
        >
          H1
        </button>
        <button
          className={`toolbar-button ${isFormatActive("h2") ? "active" : ""}`}
          onClick={() => formatBlock("h2")}
          title="Heading 2"
        >
          H2
        </button>
        <button
          className={`toolbar-button ${isFormatActive("h3") ? "active" : ""}`}
          onClick={() => formatBlock("h3")}
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <div className="toolbar-group">
        <select
          className="toolbar-select"
          onChange={(e) => execCommand("fontName", e.target.value)}
          title="Font Family"
          defaultValue={fonts[0]}
        >
          {fonts.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>

        <select
          className="toolbar-select"
          onChange={(e) => execCommand("fontSize", e.target.value)}
          title="Font Size"
          defaultValue={sizes[0]}
        >
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <select
          className="toolbar-select"
          onChange={(e) => execCommand("textColor", e.target.value)}
          title="Text Color"
          defaultValue={colors[0].value}
        >
          {colors.map((color) => (
            <option
              key={color.value}
              value={color.value}
              style={{
                backgroundColor: color.value,
                color: color.value === "#000000" ? "white" : "black",
              }}
            >
              {color.name}
            </option>
          ))}
        </select>
      </div>
      <div className="toolbar-group">
        <button
          className={`toolbar-button ${
            isFormatActive("insertUnorderedList") ? "active" : ""
          }`}
          onClick={() => execCommand("insertUnorderedList")}
          title="Bullet List"
        >
          • List
        </button>
        <button
          className={`toolbar-button ${
            isFormatActive("insertOrderedList") ? "active" : ""
          }`}
          onClick={() => execCommand("insertOrderedList")}
          title="Numbered List"
        >
          1. List
        </button>
      </div>
      <div className="toolbar-group">
        <button
          className={`toolbar-button ${
            isFormatActive("blockquote") ? "active" : ""
          }`}
          onClick={() => formatBlock("blockquote")}
          title="Quote Block"
        >
          Quote
        </button>
        <button
          className={`toolbar-button ${isFormatActive("pre") ? "active" : ""}`}
          onClick={insertCodeBlock}
          title="Code Block"
        >
          Code
        </button>
      </div>
      <div className="toolbar-group">
        <button
          className="toolbar-button"
          onClick={clearFormatting}
          title="Clear Formatting"
        >
          Clear Format
        </button>
        <button
          className="toolbar-button"
          onClick={clearContent}
          title="Clear All Content"
        >
          Clear All
        </button>
      </div>
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={undo} title="Undo (Ctrl+Z)">
          Undo
        </button>
        <button className="toolbar-button" onClick={redo} title="Redo (Ctrl+Y)">
          Redo
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
