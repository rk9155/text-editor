import React from "react";

interface ContentAreaProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  content: string;
  handleInput: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  hasInteracted?: boolean;
}

const ContentArea: React.FC<ContentAreaProps> = ({
  editorRef,
  content,
  handleInput,
  handleKeyDown,
  handlePaste,
}) => {
  return (
    <div className="content-area-container">
      <div
        ref={editorRef}
        className={"content-area"}
        contentEditable="true"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: content }}
        aria-label="Rich text editor content"
        role="textbox"
      />
    </div>
  );
};

export default ContentArea;
