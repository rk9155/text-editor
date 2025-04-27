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
        case "bold": {
          document.designMode = "on";
          const boldNode = document.createElement("strong");
          range.surroundContents(boldNode);
          document.designMode = "off";
          break;
        }
        case "italic": {
          document.designMode = "on";
          const italicNode = document.createElement("em");
          range.surroundContents(italicNode);
          document.designMode = "off";
          break;
        }
        case "underline": {
          document.designMode = "on";
          const underlineNode = document.createElement("u");
          range.surroundContents(underlineNode);
          document.designMode = "off";
          break;
        }
        case "insertText": {
          range.deleteContents();
          range.insertNode(document.createTextNode(value));
          break;
        }
        case "createLink": {
          document.designMode = "on";
          const linkNode = document.createElement("a");
          linkNode.href = value;
          range.surroundContents(linkNode);
          document.designMode = "off";
          break;
        }
        case "insertOrderedList": {
          document.designMode = "on";
          const olElement = document.createElement("ol");
          const liElement = document.createElement("li");
          const olContent = range.toString() || "";
          liElement.textContent = olContent;
          olElement.appendChild(liElement);
          range.deleteContents();
          range.insertNode(olElement);
          document.designMode = "off";
          break;
        }
        case "insertUnorderedList": {
          document.designMode = "on";
          const ulElement = document.createElement("ul");
          const ulLiElement = document.createElement("li");
          const ulContent = range.toString() || "";
          ulLiElement.textContent = ulContent;
          ulElement.appendChild(ulLiElement);
          range.deleteContents();
          range.insertNode(ulElement);
          document.designMode = "off";
          break;
        }
        case "fontName": {
          document.designMode = "on";
          const fontNode = document.createElement("span");
          fontNode.style.fontFamily = value;
          try {
            range.surroundContents(fontNode);
          } catch (e) {
            const fragment = range.extractContents();
            fontNode.appendChild(fragment);
            range.insertNode(fontNode);
          }
          document.designMode = "off";
          break;
        }
        case "fontSize": {
          document.designMode = "on";
          const sizeNode = document.createElement("span");
          sizeNode.style.fontSize = value;
          try {
            range.surroundContents(sizeNode);
          } catch (e) {
            const fragment = range.extractContents();
            sizeNode.appendChild(fragment);
            range.insertNode(sizeNode);
          }
          document.designMode = "off";
          break;
        }
        case "textColor": {
          document.designMode = "on";
          const colorNode = document.createElement("span");
          colorNode.style.color = value;
          try {
            range.surroundContents(colorNode);
          } catch (e) {
            const fragment = range.extractContents();
            colorNode.appendChild(fragment);
            range.insertNode(colorNode);
          }
          document.designMode = "off";
          break;
        }
      }
      setContent(editorRef.current.innerHTML);
      selection.removeAllRanges();
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
      const fragment = range.extractContents();
      blockElement.appendChild(fragment);
      range.insertNode(blockElement);
      document.designMode = "off";
      setContent(editorRef.current.innerHTML);
      selection.removeAllRanges();
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
      currentSelection.removeAllRanges();
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
    selection.removeAllRanges();
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
      selection.removeAllRanges();
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
        setContent(editorRef.current.innerHTML);
      }
    },
    [editorRef, setContent]
  );

  return {
    execCommand,
    formatBlock,
    insertCodeBlock,
    clearFormatting,
    clearContent,
    handlePaste,
  };
};

export default useEditorCommands;
