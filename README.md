# Multi-modal Content Writing Tool

## Features

- Text formatting (bold, italic, underline, headings)
- Nested lists with custom indentation behaviour
- Custom block elements (quotes, code blocks, callouts)
- Advanced keyboard shortcuts with:
- Keyboard navigation

## Build Intructions

- npm i (install dependencies)
- npm run dev (Run)

### Project details

State Management

```
Content State: Tracks the HTML content of the editor
javascript.
```

```
History Management: Separate stacks for undo and redo operations
```

#### Core Features

- Text Formatting: Uses document.execCommand() to apply formatting
- Block Operations: Supports headings, lists, quotes, code blocks, and callouts
- Keyboard Shortcuts: Handles standard shortcuts like Ctrl+B, Ctrl+I, etc.
- Undo/Redo: Custom implementation that preserves selection state

#### Key Functions

- execCommand: Wrapper for the browser's document.execCommand
- formatBlock: For block-level formatting like headings
  insertCodeBlock: Creates code blocks with proper styling
- saveState: Stores the current state in the undo stack
- undo/redo: Navigate through the history stacks

#### Event Handlers

- handleKeyDown: Processes keyboard shortcuts
- handleInput: Updates content state when editor content changes
