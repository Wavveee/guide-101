import React, { useEffect, useState } from 'react';
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, query, orderBy, where, limit } from "firebase/firestore"; 
import { Link } from 'react-router-dom';
import styles from "./news.module.css";

export function News({ filterTag, searchQuery }) { // Додали searchQuery
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const newsRef = collection(db, "news");
    let q;

    // 1. Формуємо запит до БД (фільтрація лише за категорією)
    if (filterTag) {
      q = query(
        newsRef,
        where("category", "==", filterTag),
        orderBy("createdAt", "desc"),
        limit(9)
      );
    } else {
      q = query(
        newsRef, 
        orderBy("createdAt", "desc"), 
        limit(9)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // 2. Клієнтська фільтрація за пошуковим запитом
      let finalNews = newsData;
      
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        finalNews = newsData.filter(item => 
          item.title.toLowerCase().includes(lowerQuery) || 
          item.category.toLowerCase().includes(lowerQuery)
        );
      }

      setNews(finalNews);
      setLoading(false);
    }, (error) => {
      console.error("Помилка Firebase:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filterTag, searchQuery]); // Ефект спрацює, якщо зміниться тег АБО текст пошуку

  if (loading) {
    return <div className={styles.empty}>Завантаження...</div>;
  }

  if (news.length === 0) {
    return (
      <div className={styles.empty}>
        {searchQuery 
          ? `За запитом "${searchQuery}" нічого не знайдено.` 
          : filterTag 
            ? `У категорії "#${filterTag}" поки немає публікацій.` 
            : "Новин поки немає."}
      </div>
    );
  }

  return (
    <div className={styles.newsGrid}>
      {news.map((item) => (
        <article key={item.id} className={styles.card}>
          <div className={styles.imageWrapper}>
            <img src={item.imageUrl || 'https://via.placeholder.com/400x200'} alt={item.title} />
            <span className={styles.categoryBadge}>{item.category}</span>
          </div>
          
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardLead}>{item.lead}</p>
            
            <div className={styles.cardFooter}>
              <span className={styles.author}>{item.authorName}</span>
              <Link to={`/news/${item.id}`} className={styles.readMore}>
                Читати далі →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}