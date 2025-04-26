import { useCallback } from "react";

interface KeyboardShortcutsProps {
  execCommand: (command: string, value?: string) => void;
  undo: () => void;
  redo: () => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
}

const useKeyboardShortcuts = ({
  execCommand,
  undo,
  redo,
  editorRef,
}: KeyboardShortcutsProps) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            execCommand("bold");
            break;
          case "i":
            e.preventDefault();
            execCommand("italic");
            break;
          case "u":
            e.preventDefault();
            execCommand("underline");
            break;
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case "y":
            e.preventDefault();
            redo();
            break;
          default:
            break;
        }
      }

      if (e.key === "Tab") {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          let node: Node | null = range.startContainer;

          while (node !== null && node !== editorRef.current) {
            if (node.nodeName === "LI") {
              e.preventDefault();

              if (e.shiftKey) {
                execCommand("outdent");
              } else {
                execCommand("indent");
              }
              break;
            }
            node = node.parentNode;
          }
        }
      }
    },
    [execCommand, undo, redo, editorRef]
  );

  return { handleKeyDown };
};

export default useKeyboardShortcuts;
