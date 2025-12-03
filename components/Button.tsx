import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'success' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "font-display font-bold rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-kid-blue text-white",
    success: "bg-kid-green text-white",
    danger: "bg-kid-pink text-white",
    secondary: "bg-white text-gray-700 border-2 border-gray-200",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-2xl w-full",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};