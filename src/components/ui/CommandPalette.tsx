import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './Command';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  Brain,
  Heart,
  Activity,
  Pill,
  Utensils,
  BarChart3
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: (path: string) => void;
  onAction?: (action: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  onNavigate,
  onAction
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const commands = [
    {
      group: 'Navigation',
      items: [
        {
          icon: BarChart3,
          title: 'Dashboard',
          description: 'View your health overview',
          action: () => onNavigate?.('/dashboard'),
          shortcut: '⌘D'
        },
        {
          icon: Brain,
          title: 'AI Coach',
          description: 'Chat with your health coach',
          action: () => onNavigate?('/dashboard/coach'),
          shortcut: '⌘C'
        },
        {
          icon: Heart,
          title: 'Health Metrics',
          description: 'View your biometric data',
          action: () => onNavigate?.('/dashboard/health'),
          shortcut: '⌘H'
        },
        {
          icon: Utensils,
          title: 'Nutrition',
          description: 'Log food and find recipes',
          action: () => onNavigate?.('/dashboard/nutrition'),
          shortcut: '⌘N'
        },
        {
          icon: Pill,
          title: 'Supplements',
          description: 'Browse supplement shop',
          action: () => onNavigate?.('/dashboard/supplements'),
          shortcut: '⌘S'
        }
      ]
    },
    {
      group: 'Quick Actions',
      items: [
        {
          icon: Utensils,
          title: 'Log Food',
          description: 'Quickly log a meal',
          action: () => onAction?.('log-food'),
          shortcut: '⌘F'
        },
        {
          icon: Activity,
          title: 'Start Workout',
          description: 'Begin a workout session',
          action: () => onAction?.('start-workout'),
          shortcut: '⌘W'
        },
        {
          icon: Brain,
          title: 'Ask Coach',
          description: 'Get health advice',
          action: () => onAction?.('ask-coach'),
          shortcut: '⌘A'
        }
      ]
    },
    {
      group: 'Settings',
      items: [
        {
          icon: User,
          title: 'Profile',
          description: 'Manage your profile',
          action: () => onNavigate?.('/dashboard/profile'),
          shortcut: '⌘P'
        },
        {
          icon: Settings,
          title: 'Settings',
          description: 'App preferences',
          action: () => onAction?.('settings'),
          shortcut: '⌘,'
        }
      ]
    }
  ];

  const filteredCommands = commands.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Type a command or search..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList className="max-h-[400px]">
        <CommandEmpty>No results found.</CommandEmpty>
        
        {filteredCommands.map((group, groupIndex) => (
          <React.Fragment key={group.group}>
            {groupIndex > 0 && <CommandSeparator />}
            <CommandGroup heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.title}
                  onSelect={() => {
                    item.action();
                    onOpenChange(false);
                    setSearchQuery('');
                  }}
                  className="flex items-center space-x-3 px-3 py-3 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                  {item.shortcut && (
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;