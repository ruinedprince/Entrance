import React from "react";

interface InputFieldProps {
  type: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  id,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-[12px] font-black font-poppins border border-[#171717] text-[#171717] rounded focus:outline-none focus:ring-2 focus:ring-[#171717] transition-all duration-500 ease-in-out bg-transparent"
      />
      <style jsx>{`
        input::placeholder {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          color: #171717;
        }
      `}</style>
    </>
  );
};

export default InputField;