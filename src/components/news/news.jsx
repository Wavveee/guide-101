import React, { useEffect, useState } from 'react';
import { db } from "../../firebaseConfig";
// 1. Додали doc та deleteDoc в імпорт
import { collection, onSnapshot, query, orderBy, where, limit, doc, deleteDoc } from "firebase/firestore";
import { Link } from 'react-router-dom';
import styles from "./news.module.css";

// 2. Приймаємо пропс user, який прийшов з App -> Home
export function News({ filterTag, searchQuery, authorFilter, user }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    setLoading(true);
    const newsRef = collection(db, "news");
    
    // 1. Створюємо масив для динамічних умов запиту
    let queryConstraints = [];

    // Якщо обрано тег — фільтруємо за тегом
    if (filterTag) {
      queryConstraints.push(where("category", "==", filterTag));
    }

    // ЯКЩО КЛІКНУЛИ "МОЇ ДОПИСИ" — додаємо фільтр за автором
    if (authorFilter === 'me' && user) {
      queryConstraints.push(where("authorId", "==", user.uid));
    }

    // Обов'язкове сортування та ліміт
    queryConstraints.push(orderBy("createdAt", "desc"));
    queryConstraints.push(limit(9));

    // Збираємо фінальний запит до Firestore
    const q = query(newsRef, ...queryConstraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Клієнтська фільтрація за пошуком (залишається як була)
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
  }, [filterTag, searchQuery, authorFilter, user]);

  // 3. Функція видалення допису
  const handleDelete = async (postId, postTitle) => {
    const isConfirmed = window.confirm(`Ви впевнені, що хочете видалити допис "${postTitle}"?`);

    if (!isConfirmed) return; // Якщо адмін передумав — виходимо

    try {
      // Видаляємо документ із колекції "news" за його id
      await deleteDoc(doc(db, "news", postId));
    } catch (error) {
      console.error("Помилка при видаленні:", error);
      alert("Не вдалося видалити допис. Спробуйте ще раз.");
    }
  };

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

              <div className={styles.cardActions}>

                {/* Кнопка видалення: рендериться ТІЛЬКИ якщо роль користувача 'admin' */}
                {user?.role === 'admin' && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(item.id, item.title)}
                    title="Видалити допис"
                  >
                    Видалити
                  </button>
                )}

                 {/* Кнопка редагування. Показується, якщо юзер — автор цього конкретного поста */}   
                {user && item.authorId === user.uid && (
                  <Link
                    to={`/edit-news/${item.id}`}
                    className={styles.editBtn}
                    title="Редагувати допис"
                  >
                    Редагувати
                  </Link>)}

                <Link to={`/news/${item.id}`} className={styles.readMore}>
                  Читати далі →
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}