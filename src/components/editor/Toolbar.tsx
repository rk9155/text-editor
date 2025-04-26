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

      <div className="divider"></div>

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

      <div className="divider"></div>

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

      <div className="divider"></div>

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

      <div className="divider"></div>

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

      <div className="toolbar-group ml-auto">
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
