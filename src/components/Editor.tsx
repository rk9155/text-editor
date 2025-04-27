import React from "react";
import ContentArea from "./editor/ContentArea";
import StatusBar from "./editor/StatusBar";
import Toolbar from "./editor/Toolbar";
import useEditorCommands from "../hooks/useEditorCommands";
import useEditorState from "../hooks/useEditorState";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";

const Editor: React.FC = () => {
  const {
    content,
    setContent,
    charCount,
    setSelection,
    editorRef,
    undo,
    redo,
    handleInput,
    saveSelection,
  } = useEditorState();

  const {
    execCommand,
    formatBlock,
    insertCodeBlock,
    clearFormatting,
    clearContent,
    handlePaste,
  } = useEditorCommands({
    editorRef,
    setContent,
    setSelection,
    saveSelection,
  });

  const { handleKeyDown } = useKeyboardShortcuts({
    execCommand,
    undo,
    redo,
    editorRef,
  });

  return (
    <div className="editor-container">
      <Toolbar
        execCommand={execCommand}
        formatBlock={formatBlock}
        insertCodeBlock={insertCodeBlock}
        clearFormatting={clearFormatting}
        clearContent={clearContent}
        undo={undo}
        redo={redo}
      />
      <ContentArea
        editorRef={editorRef}
        content={content}
        handleInput={handleInput}
        handleKeyDown={handleKeyDown}
        handlePaste={handlePaste}
      />
      <StatusBar charCount={charCount} />
    </div>
  );
};

export default Editor;
