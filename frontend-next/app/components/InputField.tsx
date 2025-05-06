import React from "react";

interface InputFieldProps {
  type: string;
  id: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean; // Added optional required property
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 text-[12px] font-bold font-poppins border border-[#171717] text-[#171717] rounded focus:outline-none focus:ring-2 focus:ring-[#171717] transition-all duration-500 ease-in-out bg-transparent"
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