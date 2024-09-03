import style from "./Label.module.scss";

interface LabelProps {
  text: string;
  htmlFor: string;
}

const Label = ({ text, htmlFor }: LabelProps) => {
  return (
    <label className={style.label} htmlFor={htmlFor}>
      {text}
    </label>
  );
};

export default Label;
