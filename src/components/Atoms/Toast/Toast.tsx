import React, { useEffect } from "react";
import styles from "./Toast.module.scss";

interface ToastProps {
  toastList: Array<{
    id: number;
    title: string;
    description: string;
    backgroundColor: string;
    icon: string;
  }>;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  removeToast: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({
  toastList,
  position = "bottom-right",
  removeToast,
}) => {
  useEffect(() => {
    const timers = toastList.map((toast) =>
      setTimeout(() => removeToast(toast.id), 3000)
    );

    return () => timers.forEach(clearTimeout);
  }, [toastList, removeToast]);

  return (
    <div className={`${styles.toastContainer} ${styles[position]}`}>
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={styles.toast}
          style={{ backgroundColor: toast.backgroundColor }}
        >
          <div className={styles.icon}>
            <img src={toast.icon} alt="icon" />
          </div>
          <div>
            <p className={styles.title}>{toast.title}</p>
            <p className={styles.description}>{toast.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
