import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { News } from "../../components/news/news";
import styles from "./home.module.css";

export function Home() {
  const [searchParams] = useSearchParams();
  
  // Дістаємо обидва параметри з URL
  const activeTag = searchParams.get('tag'); // Наприклад: "rpg"
  const searchQuery = searchParams.get('q'); // Наприклад: "Space"

  return (
    <div className={styles.homeContainer}>
      {/* Тепер News отримує і тег, і пошуковий запит */}
      <News 
        filterTag={activeTag} 
        searchQuery={searchQuery} 
      />
    </div>
  );
}