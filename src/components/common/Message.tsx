// 19. src/components/common/Message.tsx
// -----------------------------------------------------------------------------
import React from 'react';

interface MessageProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Message: React.FC<MessageProps> = ({ children, style, className }) => {
  return (
    <p className={`message ${className || ''}`} style={style}>
      {children}
    </p>
  );
};

