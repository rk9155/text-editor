import React from "react";

interface ToolbarProps {
  execCommand: (command: string, value?: string) => void;
  formatBlock: (blockType: string) => void;
  insertCodeBlock: () => void;
  insertCallout: (type?: string) => void;
  clearFormatting: () => void;
  undo: () => void;
  redo: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  execCommand,
  formatBlock,
  insertCodeBlock,
  insertCallout,
  clearFormatting,
  undo,
  redo,
}) => {
  return (
    <div
      className="toolbar"
      role="toolbar"
      aria-label="Text Formatting Options"
    >
      <div className="toolbar-group">
        <button
          className="toolbar-button"
          onClick={() => execCommand("bold")}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          className="toolbar-button"
          onClick={() => execCommand("italic")}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          className="toolbar-button"
          onClick={() => execCommand("underline")}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
      </div>

      <div className="divider"></div>

      <div className="toolbar-group">
        <button
          className="toolbar-button"
          onClick={() => formatBlock("h1")}
          title="Heading 1"
        >
          H1
        </button>
        <button
          className="toolbar-button"
          onClick={() => formatBlock("h2")}
          title="Heading 2"
        >
          H2
        </button>
        <button
          className="toolbar-button"
          onClick={() => formatBlock("h3")}
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <div className="divider"></div>

      <div className="toolbar-group">
        <button
          className="toolbar-button"
          onClick={() => execCommand("insertUnorderedList")}
          title="Bullet List"
        >
          • List
        </button>
        <button
          className="toolbar-button"
          onClick={() => execCommand("insertOrderedList")}
          title="Numbered List"
        >
          1. List
        </button>
      </div>

      <div className="divider"></div>

      <div className="toolbar-group">
        <button
          className="toolbar-button"
          onClick={() => formatBlock("blockquote")}
          title="Quote Block"
        >
          Quote
        </button>
        <button
          className="toolbar-button"
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
          onClick={() => insertCallout("info")}
          title="Insert Info Callout"
        >
          Callout
        </button>
        <button
          className="toolbar-button"
          onClick={clearFormatting}
          title="Clear Formatting"
        >
          Clear
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
