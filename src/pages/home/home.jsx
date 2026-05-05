import React from 'react';
import { News } from "../../components/news/news"; // Переконайся, що шлях правильний
import styles from "./home.module.css";

export function Home() {
  return (
    <div className={styles.homeContainer}>
      <News />
    </div>
  );
}