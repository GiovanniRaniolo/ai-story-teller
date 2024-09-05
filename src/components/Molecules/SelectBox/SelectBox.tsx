import { ListOption } from "@/types/common";
import style from "./SelectBox.module.scss";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface SelectBoxProps {
  label: string;
  list: ListOption[];
  setAction: Dispatch<SetStateAction<string>>;
}

const SelectBox = (props: SelectBoxProps) => {
  const { label, list, setAction } = props;

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log("Selected value:", e.target.value);
    setAction(e.target.value);
  };

  return (
    <div className={style.main}>
      <label>{label}</label>
      <select id="select" onChange={handleChange} defaultValue="">
        <option value="" hidden>
          seleziona
        </option>
        {list.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;
