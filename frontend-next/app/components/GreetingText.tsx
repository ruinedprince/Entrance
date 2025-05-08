import React from "react";
import "@fontsource/montserrat/900.css"; // Import Montserrat Black font

interface GreetingTextProps {
  text: string; // Prop to allow customizable text
}

const GreetingText: React.FC<GreetingTextProps> = ({ text }) => {
  return (
    <h1 className="font-black text-2xl mb-5 text-[#171717] font-montserrat">
      {text}
    </h1>
  );
};

export default GreetingText;