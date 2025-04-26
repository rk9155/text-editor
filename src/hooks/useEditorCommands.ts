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
      if (!editorRef.current) {
        return;
      }

      editorRef.current.focus();
      const selection = window.getSelection();

      if (!selection || selection.rangeCount === 0) {
        return;
      }

      const range = selection.getRangeAt(0);

      switch (command) {
        case "bold":
          document.designMode = "on";
          const boldNode = document.createElement("strong");
          range.surroundContents(boldNode);
          document.designMode = "off";
          break;
        case "italic":
          document.designMode = "on";
          const italicNode = document.createElement("em");
          range.surroundContents(italicNode);
          document.designMode = "off";
          break;
        case "underline":
          document.designMode = "on";
          const underlineNode = document.createElement("u");
          range.surroundContents(underlineNode);
          document.designMode = "off";
          break;
        case "insertText":
          range.deleteContents();
          range.insertNode(document.createTextNode(value));
          break;
        case "createLink":
          document.designMode = "on";
          const linkNode = document.createElement("a");
          linkNode.href = value;
          range.surroundContents(linkNode);
          document.designMode = "off";
          break;
        case "insertOrderedList":
          document.designMode = "on";
          const olElement = document.createElement("ol");
          const liElement = document.createElement("li");

          const olContent = range.toString() || "";
          liElement.textContent = olContent;
          olElement.appendChild(liElement);

          range.deleteContents();
          range.insertNode(olElement);

          const newRange = document.createRange();
          newRange.setStart(liElement, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);

          document.designMode = "off";
          break;
        case "insertUnorderedList":
          document.designMode = "on";

          // Create unordered list
          const ulElement = document.createElement("ul");
          const ulLiElement = document.createElement("li");

          // Get the selected content or create empty list item
          const ulContent = range.toString() || "";
          ulLiElement.textContent = ulContent;
          ulElement.appendChild(ulLiElement);

          // Replace the selection with the list
          range.deleteContents();
          range.insertNode(ulElement);

          // Position cursor inside the list item
          const ulNewRange = document.createRange();
          ulNewRange.setStart(ulLiElement, 0);
          ulNewRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(ulNewRange);

          document.designMode = "off";
          break;
      }
      setContent(editorRef.current.innerHTML);
      setSelection(saveSelection());
    },
    [editorRef, setContent, setSelection, saveSelection]
  );

  const formatBlock = useCallback(
    (blockType: string) => {
      if (!editorRef.current) return;

      editorRef.current.focus();
      const selection = window.getSelection();

      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      document.designMode = "on";
      const blockElement = document.createElement(blockType);

      let currentBlock = range.commonAncestorContainer;
      if (currentBlock.nodeType === Node.TEXT_NODE) {
        currentBlock = currentBlock.parentElement!;
      }

      if (currentBlock.nodeName.toLowerCase() === blockType.toLowerCase()) {
        document.designMode = "off";
        return;
      }

      const fragment = range.extractContents();
      blockElement.appendChild(fragment);
      range.insertNode(blockElement);
      document.designMode = "off";
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

  const clearFormatting = useCallback(() => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textContent = range.toString();

    range.deleteContents();

    const textNode = document.createTextNode(textContent);
    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);

    setContent(editorRef.current.innerHTML);
  }, [editorRef, setContent]);

  const clearContent = useCallback(() => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    editorRef.current.innerHTML = "<p></p>";
    setContent("<p></p>");

    const selection = window.getSelection();
    if (selection && editorRef.current.firstChild) {
      const range = document.createRange();
      range.setStart(editorRef.current.firstChild, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [editorRef, setContent]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && editorRef.current) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);

        setContent(editorRef.current.innerHTML);
      }
    },
    [editorRef, setContent]
  );

  const isFormatActive = useCallback(
    (format: string): boolean => {
      if (!editorRef.current) {
        return false;
      }

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        return false;
      }

      const range = selection.getRangeAt(0);
      let container = range.commonAncestorContainer;

      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentElement!;
      }

      let currentNode: Node | null = container;
      while (currentNode && currentNode !== editorRef.current) {
        const element = currentNode as HTMLElement;

        switch (format) {
          case "bold":
            if (element.tagName === "STRONG" || element.tagName === "B") {
              return true;
            }
            break;
          case "italic":
            if (element.tagName === "EM" || element.tagName === "I") {
              return true;
            }
            break;
          case "underline":
            if (element.tagName === "U") {
              return true;
            }
            break;
          case "insertOrderedList":
            if (
              element.tagName === "OL" ||
              (element.tagName === "LI" &&
                element.parentElement?.tagName === "OL")
            ) {
              return true;
            }
            break;
          case "insertUnorderedList":
            if (
              element.tagName === "UL" ||
              (element.tagName === "LI" &&
                element.parentElement?.tagName === "UL")
            ) {
              return true;
            }
            break;
          default:
            if (format === element.tagName.toLowerCase()) {
              return true;
            }
        }

        currentNode = currentNode.parentElement;
      }

      return false;
    },
    [editorRef]
  );

  return {
    execCommand,
    formatBlock,
    insertCodeBlock,
    clearFormatting,
    clearContent,
    handlePaste,
    isFormatActive,
  };
};

export default useEditorCommands;
