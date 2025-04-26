import { useState, useEffect, useRef } from "react";

export type SelectionState = {
  startContainer: Node;
  startOffset: number;
  endContainer: Node;
  endOffset: number;
} | null;

export type HistoryItem = {
  html: string;
  selection: SelectionState;
};

const useEditorState = (initialContent = "<p></p>") => {
  const [content, setContent] = useState(initialContent);
  const [charCount, setCharCount] = useState(0);
  const [undoStack, setUndoStack] = useState<HistoryItem[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryItem[]>([]);
  const [selection, setSelection] = useState<SelectionState>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimeout = useRef<number | null>(null);

  useEffect(() => {
    updateCharacterCount();
    saveState();

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    updateCharacterCount();
  }, [content]);

  useEffect(() => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = window.setTimeout(() => {
      saveState();
    }, 500);

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [content]);

  const placeCursorAtEnd = () => {
    if (editorRef.current) {
      editorRef.current.focus();

      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        let lastNode = editorRef.current.lastChild;

        while (lastNode && lastNode.hasChildNodes()) {
          lastNode = lastNode.lastChild;
        }

        if (lastNode) {
          if (lastNode.nodeType === Node.TEXT_NODE) {
            range.setStart(lastNode, lastNode.textContent?.length || 0);
          } else {
            range.setStartAfter(lastNode);
          }
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  };

  const updateCharacterCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.textContent || "";
      setCharCount(text.length);
    }
  };

  const saveState = () => {
    const currentSelection = saveSelection();

    if (content !== undoStack[undoStack.length - 1]?.html) {
      setUndoStack((prev) => [
        ...prev,
        { html: content, selection: currentSelection },
      ]);

      setRedoStack([]);
    }
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset,
      };
    }
    return null;
  };

  const restoreSelection = (savedSelection: SelectionState) => {
    if (savedSelection) {
      try {
        const selection = window.getSelection();
        const range = document.createRange();

        range.setStart(
          savedSelection.startContainer,
          savedSelection.startOffset
        );
        range.setEnd(savedSelection.endContainer, savedSelection.endOffset);

        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } catch (e) {
        console.error("Could not restore selection", e);
      }
    }
  };

  const undo = () => {
    if (undoStack.length > 1) {
      const currentState = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, currentState]);

      const newUndoStack = [...undoStack];
      newUndoStack.pop();
      setUndoStack(newUndoStack);

      const previousState = newUndoStack[newUndoStack.length - 1];
      if (editorRef.current) {
        editorRef.current.innerHTML = previousState.html;
      }
      setContent(previousState.html);

      if (previousState.selection) {
        restoreSelection(previousState.selection);
      }
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const redoState = redoStack[redoStack.length - 1];

      const newRedoStack = [...redoStack];
      newRedoStack.pop();
      setRedoStack(newRedoStack);

      setUndoStack([...undoStack, redoState]);

      if (editorRef.current) {
        editorRef.current.innerHTML = redoState.html;
      }
      setContent(redoState.html);

      if (redoState.selection) {
        restoreSelection(redoState.selection);
      }
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  return {
    content,
    setContent,
    charCount,
    selection,
    setSelection,
    editorRef,
    undo,
    redo,
    handleInput,
    saveSelection,
    restoreSelection,
    placeCursorAtEnd,
  };
};

export default useEditorState;
