import React from 'react';
import { useSearchParams } from 'react-router-dom'; // Додаємо цей імпорт
import { News } from "../../components/news/news";
import styles from "./home.module.css";

export function Home() {
  const [searchParams] = useSearchParams();
  const activeTag = searchParams.get('tag'); // Отримуємо значення ?tag=...

  return (
    <div className={styles.homeContainer}>
      {/* Передаємо активний тег як пропс у компонент News */}
      <News filterTag={activeTag} />
    </div>
  );
}