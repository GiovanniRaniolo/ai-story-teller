import React, { useState } from "react";
import { FinaleAlternativo } from "@/types/common";
import styles from "./Slider.module.scss";

interface SliderProps {
  finals: FinaleAlternativo[];
}

const Slider: React.FC<SliderProps> = ({ finals }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % finals.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? finals.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselControls}>
        {finals.map((_, index) => (
          <input
            key={index}
            type="radio"
            name="position"
            checked={currentIndex === index}
            onChange={() => setCurrentIndex(index)}
            id={`slide-${index}`}
          />
        ))}
      </div>
      <main id="carousel" className={styles.carousel}>
        {finals.map((finale, index) => (
          <div
            key={index}
            className={`${styles.item} ${
              currentIndex === index ? styles.active : ""
            }`}
            style={{
              backgroundColor: `hsl(${
                (index * 360) / finals.length
              }, 80%, 90%)`,
            }}
          >
            <h2 className={styles.title}>{finale.title}</h2>
            <p className={styles.content}>{finale.content}</p>
          </div>
        ))}
      </main>
      <div className={styles.navigation}>
        <button className={styles.prev} onClick={goToPrevious}>
          &lt;
        </button>
        <button className={styles.next} onClick={goToNext}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Slider;
