import { useCallback } from "react";
import type { SelectionState } from "./useEditorState";

interface EditorCommandsProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  setContent: (content: string) => void;
  setSelection: (selection: SelectionState) => void;
  saveSelection: () => SelectionState;
}

const useEditorCommands = ({
  editorRef,
  setContent,
  setSelection,
  saveSelection,
}: EditorCommandsProps) => {
  const execCommand = useCallback(
    (command: string, value: string = "") => {
      if (!editorRef.current) return;

      editorRef.current.focus();
      document.execCommand(command, false, value);
      setContent(editorRef.current.innerHTML);
      setSelection(saveSelection());
    },
    [editorRef, setContent, setSelection, saveSelection]
  );

  const formatBlock = useCallback(
    (blockType: string) => {
      if (!editorRef.current) return;

      editorRef.current.focus();
      document.execCommand("formatBlock", false, `<${blockType}>`);
      setContent(editorRef.current.innerHTML);
    },
    [editorRef, setContent]
  );

  const insertCodeBlock = useCallback(() => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    const currentSelection = window.getSelection();

    if (currentSelection && currentSelection.rangeCount > 0) {
      const range = currentSelection.getRangeAt(0);
      const preElement = document.createElement("pre");
      const codeContent = range.toString() || "Your code here";

      preElement.textContent = codeContent;
      range.deleteContents();
      range.insertNode(preElement);

      const newRange = document.createRange();
      newRange.setStartAfter(preElement);
      newRange.collapse(true);

      currentSelection.removeAllRanges();
      currentSelection.addRange(newRange);

      setContent(editorRef.current.innerHTML);
    }
  }, [editorRef, setContent]);

  const insertCallout = useCallback(
    (type = "info") => {
      if (!editorRef.current) return;

      editorRef.current.focus();
      const currentSelection = window.getSelection();

      if (currentSelection && currentSelection.rangeCount > 0) {
        const range = currentSelection.getRangeAt(0);
        const calloutDiv = document.createElement("div");

        calloutDiv.className = `callout callout-${type}`;
        calloutDiv.contentEditable = "true";

        const calloutContent = range.toString() || "Your callout text here";
        calloutDiv.textContent = calloutContent;

        range.deleteContents();
        range.insertNode(calloutDiv);

        const newRange = document.createRange();
        newRange.setStartAfter(calloutDiv);
        newRange.collapse(true);

        currentSelection.removeAllRanges();
        currentSelection.addRange(newRange);

        setContent(editorRef.current.innerHTML);
      }
    },
    [editorRef, setContent]
  );

  const clearFormatting = useCallback(() => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    document.execCommand("removeFormat", false);
    setContent(editorRef.current.innerHTML);
  }, [editorRef, setContent]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);

      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    },
    [editorRef, setContent]
  );

  return {
    execCommand,
    formatBlock,
    insertCodeBlock,
    insertCallout,
    clearFormatting,
    handlePaste,
  };
};

export default useEditorCommands;
