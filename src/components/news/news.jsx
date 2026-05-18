import React, { useEffect, useState } from 'react';
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, query, orderBy, where, limit, doc, deleteDoc } from "firebase/firestore"; 
import { Link } from 'react-router-dom';
import styles from "./news.module.css";

export function News({ filterTag, searchQuery, authorFilter, user }) { 
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // НОВІ СТЕЙТИ ДЛЯ ПАГІНАЦІЇ
  const [visibleLimit, setVisibleLimit] = useState(9); // Починаємо з 9 новин
  const [hasMore, setHasMore] = useState(true);        // Чи є що завантажувати далі

  // Скидаємо ліміт до 9, якщо користувач змінив категорію, автора або ввів пошуковий запит
  useEffect(() => {
    setVisibleLimit(9);
    setHasMore(true);
  }, [filterTag, searchQuery, authorFilter]);

  useEffect(() => {
    setLoading(true);
    const newsRef = collection(db, "news");
    let queryConstraints = [];

    if (filterTag) {
      queryConstraints.push(where("category", "==", filterTag));
    }

    if (authorFilter === 'me' && user) {
      queryConstraints.push(where("authorId", "==", user.uid));
    }

    queryConstraints.push(orderBy("createdAt", "desc"));
    
    // Використовуємо динамічний ліміт зі стейту
    queryConstraints.push(limit(visibleLimit));

    const q = query(newsRef, ...queryConstraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // ПЕРЕВІРКА: якщо прийшло менше документів, ніж наш ліміт, значить новини в базі закінчилися
      if (snapshot.docs.length < visibleLimit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

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
  }, [filterTag, searchQuery, authorFilter, user, visibleLimit]); 

  const handleDelete = async (postId, postTitle) => {
    const isConfirmed = window.confirm(`Ви впевнені, що хочете видалити допис "${postTitle}"?`);
    if (!isConfirmed) return;
    try {
      await deleteDoc(doc(db, "news", postId));
    } catch (error) {
      console.error("Помилка при видаленні:", error);
    }
  };

  if (loading && news.length === 0) {
    return <div className={styles.empty}>Завантаження...</div>;
  }

  return (
    <div className={styles.newsContainer}>
      {news.length === 0 ? (
        <div className={styles.empty}>
          {searchQuery 
            ? `За запитом "${searchQuery}" нічого не знайдено.` 
            : filterTag 
              ? `У категорії "#${filterTag}" поки немає публікацій.` 
              : "Новин поки немає."}
        </div>
      ) : (
        <>
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
                    
                    <div className={styles.cardActions}>
                      {user?.role === 'admin' && (
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(item.id, item.title)}
                        >
                          Видалити
                        </button>
                      )}

                      {user && item.authorId === user.uid && (
                        <Link to={`/edit-news/${item.id}`} className={styles.editBtn}>
                          Редагувати
                        </Link>
                      )}

                      <Link to={`/news/${item.id}`} className={styles.readMore}>
                        Читати далі →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* НОВА КНОПКА ЗАВАНТАЖИТИ ЩЕ */}
          {hasMore && (
            <div className={styles.loadMoreWrapper}>
              <button 
                className={styles.loadMoreBtn}
                onClick={() => setVisibleLimit(prev => prev + 9)} // Збільшуємо ліміт на 9
              >
                Більше новин
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}