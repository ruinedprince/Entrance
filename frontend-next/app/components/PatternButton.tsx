import React from "react";

interface PatternButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const PatternButton: React.FC<PatternButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-2 h-[36px] text-[12px] font-bold font-poppins bg-[#171717] text-[#d9d9d9] rounded-sm hover:text-[#171717] hover:bg-transparent hover:border hover:border-[#171717] transition-all duration-500 ease-in-out"
    >
      {children}
    </button>
  );
};

export default PatternButton;