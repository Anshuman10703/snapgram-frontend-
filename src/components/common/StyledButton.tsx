// ~/snapgram-amplify-original/frontend/src/components/common/StyledButton.tsx
import React from 'react';
// No specific Shadcn Button import here, as this is a common button that *might* wrap Shadcn Button,
// but for simplicity, we'll make it a direct button with Tailwind classes.
// If you want to use Shadcn's Button, you'd integrate it as shown in previous attempts.

interface StyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // All standard button props are inherited via React.ButtonHTMLAttributes
  // Add any custom props here if needed
}

export const StyledButton: React.FC<StyledButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      // Apply Tailwind classes directly here
      className={`px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200 ${className || ''}`}
      {...props} // CORRECTED: Pass all other props (type, onClick, disabled, etc.) directly to the button
    >
      {children}
    </button>
  );
};