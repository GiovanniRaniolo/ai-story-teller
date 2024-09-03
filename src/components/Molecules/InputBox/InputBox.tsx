import { Dispatch, SetStateAction } from "react";
import Label from "@/components/Atoms/Label/Label";
import TextInput from "@/components/Atoms/TextInput/TextInput";
import style from "./InputBox.module.scss";

interface InputBoxProps {
  label: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder?: string;
}

const InputBox = ({ label, value, setValue, placeholder }: InputBoxProps) => {
  const inputId = `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={style.main}>
      <Label text={label} htmlFor={inputId} />
      <TextInput
        id={inputId}
        value={value}
        setValue={setValue}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputBox;
