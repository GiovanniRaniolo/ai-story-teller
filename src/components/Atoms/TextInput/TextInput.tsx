import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import style from "./TextInput.module.scss";

interface TextInputProps {
  id: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder?: string;
}

const TextInput = ({ id, value, setValue, placeholder }: TextInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <input
      id={id}
      className={style.input}
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

export default TextInput;
