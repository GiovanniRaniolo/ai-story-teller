import style from "./Loader.module.css";

const Loader = () => {
  return (
    <>
      <div className={style["lds-roller"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default Loader;
