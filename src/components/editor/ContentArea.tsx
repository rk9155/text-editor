import React, { useEffect } from "react";

interface ContentAreaProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  content: string;
  handleInput: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
}

const ContentArea: React.FC<ContentAreaProps> = ({
  editorRef,
  content,
  handleInput,
  handleKeyDown,
  handlePaste,
}) => {
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      const selection = window.getSelection();
      let range = null;
      let selStartContainer: Node | null = null;
      let selStartOffset = 0;
      let selEndContainer: Node | null = null;
      let selEndOffset = 0;

      if (selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        selStartContainer = range.startContainer;
        selStartOffset = range.startOffset;
        selEndContainer = range.endContainer;
        selEndOffset = range.endOffset;
      }

      editorRef.current.innerHTML = content;

      if (
        range &&
        selection &&
        selStartContainer &&
        selEndContainer &&
        document.contains(selStartContainer) &&
        document.contains(selEndContainer)
      ) {
        try {
          range = document.createRange();
          range.setStart(selStartContainer, selStartOffset);
          range.setEnd(selEndContainer, selEndOffset);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (e) {
          console.error("Could not restore selection", e);
        }
      }
    }
  }, [content]);

  return (
    <div className="content-area-container">
      <div
        ref={editorRef}
        className={"content-area"}
        contentEditable="true"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        aria-label="Text editor content"
        role="textbox"
      />
    </div>
  );
};

export default ContentArea;
