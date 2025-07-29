import React from 'react';

interface SafeAreaProps {
  children: React.ReactNode;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  className?: string;
}

const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  top = false,
  bottom = false,
  left = false,
  right = false,
  className = '',
}) => {
  const safeAreaClasses = [
    top && 'safe-top',
    bottom && 'safe-bottom',
    left && 'safe-left',
    right && 'safe-right',
  ].filter(Boolean).join(' ');

  return (
    <div className={`${safeAreaClasses} ${className}`}>
      {children}
    </div>
  );
};

export default SafeArea;