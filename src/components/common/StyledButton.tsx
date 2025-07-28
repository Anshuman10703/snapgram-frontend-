// 20. src/components/common/StyledButton.tsx
// -----------------------------------------------------------------------------
import React from 'react';

interface StyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Add any custom props here if needed, but for simple HTML, it's usually not.
}

export const StyledButton: React.FC<StyledButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200" // Tailwind classes
      {...props} // Pass all other props like type="submit", onClick, etc.
    >
      {children}
    </button>
  );
};