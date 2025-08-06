import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ScrollArea } from './ScrollArea';
import { Separator } from './Separator';

interface EnterpriseLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  sidebarWidth?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'compact' | 'spacious';
}

const EnterpriseLayout: React.FC<EnterpriseLayoutProps> = ({
  children,
  sidebar,
  header,
  footer,
  className,
  sidebarWidth = 'md',
  variant = 'default'
}) => {
  const sidebarWidths = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    xl: 'w-[28rem]'
  };

  const variants = {
    default: 'p-6',
    compact: 'p-4',
    spacious: 'p-8'
  };

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="flex h-screen">
        {/* Sidebar */}
        {sidebar && (
          <aside className={cn(
            'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50',
            sidebarWidths[sidebarWidth]
          )}>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border px-6 pb-4">
              <ScrollArea className="flex-1">
                {sidebar}
              </ScrollArea>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <div className={cn(
          'flex flex-1 flex-col',
          sidebar && `lg:pl-${sidebarWidths[sidebarWidth].split('-')[1]}`
        )}>
          {/* Header */}
          {header && (
            <>
              <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
                <div className={variants[variant]}>
                  {header}
                </div>
              </header>
              <Separator />
            </>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={variants[variant]}
            >
              {children}
            </motion.div>
          </main>

          {/* Footer */}
          {footer && (
            <>
              <Separator />
              <footer className="bg-background border-t border-border">
                <div className={variants[variant]}>
                  {footer}
                </div>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterpriseLayout;