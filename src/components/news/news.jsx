import React, { useEffect, useState } from 'react';
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Link } from 'react-router-dom';
import styles from "./news.module.css";

export function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Запит до колекції "news" із сортуванням за датою (свіжі зверху)
    const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNews(newsData);
    });

    return () => unsubscribe();
  }, []);

  if (news.length === 0) {
    return <div className={styles.empty}>Новин поки немає. Станьте першим, хто щось опублікує!</div>;
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