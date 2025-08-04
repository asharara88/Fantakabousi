import React from 'react';
import { motion } from 'framer-motion';
import InternalLink from './InternalLink';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface RelatedLink {
  title: string;
  description: string;
  href: string;
  category: string;
  icon?: React.ComponentType<{ className?: string }>;
  priority?: 'high' | 'medium' | 'low';
}

interface RelatedLinksProps {
  title?: string;
  links: RelatedLink[];
  maxItems?: number;
  className?: string;
}

const RelatedLinks: React.FC<RelatedLinksProps> = ({
  title = "Related Topics",
  links,
  maxItems = 6,
  className = "",
}) => {
  const displayLinks = links.slice(0, maxItems);

  return (
    <div className={`card-premium p-6 ${className}`}>
      <div className="space-y-6">
        <h3 className="text-heading-lg text-foreground">{title}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <InternalLink
                href={link.href}
                variant="ghost"
                className="block p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                analytics={{
                  event: 'related_link_click',
                  category: 'internal_navigation',
                  label: link.title,
                }}
              >
                <div className="flex items-start space-x-3">
                  {link.icon && (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                      <link.icon className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-body font-semibold text-foreground group-hover:text-primary transition-colors">
                        {link.title}
                      </h4>
                      <ArrowRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <p className="text-caption line-clamp-2">
                      {link.description}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                        {link.category}
                      </span>
                      {link.priority === 'high' && (
                        <span className="text-xs px-2 py-1 bg-red-500/10 text-red-500 rounded-full">
                          Priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </InternalLink>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedLinks;