import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: (event: KeyboardEvent) => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey;
        const metaMatches = !!shortcut.metaKey === event.metaKey;
        const shiftMatches = !!shortcut.shiftKey === event.shiftKey;
        const altMatches = !!shortcut.altKey === event.altKey;

        if (keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches) {
          event.preventDefault();
          shortcut.callback(event);
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

// Predefined shortcut hooks
export function useGlobalShortcuts(callbacks: {
  onSearch?: () => void;
  onNewChat?: () => void;
  onToggleTheme?: () => void;
  onShowHelp?: () => void;
}): void {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      metaKey: true,
      callback: () => callbacks.onSearch?.(),
      description: 'Open search',
    },
    {
      key: 'k',
      ctrlKey: true,
      callback: () => callbacks.onSearch?.(),
      description: 'Open search (Windows/Linux)',
    },
    {
      key: 'n',
      metaKey: true,
      callback: () => callbacks.onNewChat?.(),
      description: 'New chat',
    },
    {
      key: 'd',
      metaKey: true,
      callback: () => callbacks.onToggleTheme?.(),
      description: 'Toggle theme',
    },
    {
      key: '?',
      callback: () => callbacks.onShowHelp?.(),
      description: 'Show help',
    },
    {
      key: 'Escape',
      callback: (event) => {
        // Close any open modals or overlays
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      },
      description: 'Close modals/escape',
    },
  ];

  useKeyboardShortcuts(shortcuts);
}

export function useNavigationShortcuts(callbacks: {
  onHome?: () => void;
  onHealth?: () => void;
  onCoach?: () => void;
  onNutrition?: () => void;
  onSupplements?: () => void;
  onProfile?: () => void;
}): void {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      altKey: true,
      callback: () => callbacks.onHome?.(),
      description: 'Go to dashboard',
    },
    {
      key: '2',
      altKey: true,
      callback: () => callbacks.onHealth?.(),
      description: 'Go to health',
    },
    {
      key: '3',
      altKey: true,
      callback: () => callbacks.onCoach?.(),
      description: 'Go to AI coach',
    },
    {
      key: '4',
      altKey: true,
      callback: () => callbacks.onNutrition?.(),
      description: 'Go to nutrition',
    },
    {
      key: '5',
      altKey: true,
      callback: () => callbacks.onSupplements?.(),
      description: 'Go to supplements',
    },
    {
      key: '6',
      altKey: true,
      callback: () => callbacks.onProfile?.(),
      description: 'Go to profile',
    },
  ];

  useKeyboardShortcuts(shortcuts);
}