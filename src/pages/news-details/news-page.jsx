import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from "../../firebaseConfig";
import { doc, getDoc, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc } from "firebase/firestore";
import { ROLE_NAMES } from "../../constants/roles";
import styles from "./news-page.module.css";

export function NewsPage({ user }) {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  // 1. Завантаження самої новини
  useEffect(() => {
    const fetchNews = async () => {
      const docRef = doc(db, "news", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNews(docSnap.data());
      }
    };
    fetchNews();
  }, [id]);

  // 2. Завантаження коментарів у реальному часі
  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("newsId", "==", id),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [id]);

  // 3. Відправка коментаря
  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await addDoc(collection(db, "comments"), {
      newsId: id,
      text: commentText,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      authorId: user.uid,
      authorRole: user.role || "registered_user", // Зберігаємо роль
      createdAt: serverTimestamp(),
    });
    setCommentText(""); // Очищуємо поле
  };

  // 2. Функція для видалення
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей коментар?")) {
      try {
        await deleteDoc(doc(db, "comments", commentId));
      } catch (error) {
        console.error("Помилка видалення:", error);
      }
    }
  };

  if (!news) return <div className={styles.loading}>Завантаження...</div>;

  return (
    <div className={styles.newsContainer}>
      <Link to="/" className={styles.backBtn}>← На головну</Link>

      <header className={styles.header}>
        <span className={styles.category}>{news.category}</span>
        <h1>{news.title}</h1>
        <div className={styles.meta}>
          Автор: <strong>{news.authorName}</strong> | {news.createdAt?.toDate().toLocaleDateString()}
        </div>
      </header>

      <img src={news.imageUrl} alt={news.title} className={styles.mainImg} />

      <p className={styles.lead}>{news.lead}</p>
      <div className={styles.content}>{news.content}</div>

      {/* --- СЕКЦІЯ КОМЕНТАРІВ --- */}
      <section className={styles.commentsSection}>
        <h3>Обговорення ({comments.length})</h3>

        {user ? (
          <form className={styles.commentForm} onSubmit={handleSendComment}>
            <textarea
              placeholder="Напишіть свою думку..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit">Відправити</button>
          </form>
        ) : (
          <div className={styles.loginInvite}>Увійдіть, щоб залишити коментар.</div>
        )}

        <div className={styles.commentsList}>
          {comments.map(comment => (
            <div key={comment.id} className={styles.commentItem}>
              <img src={comment.authorPhoto} alt="avatar" className={styles.commAvatar} />

              <div className={styles.commContent}>
                <div className={styles.commHeader}>
                  <div className={styles.authorInfo}>
                    <span className={styles.commAuthor}>{comment.authorName}</span>
                    <span className={styles.roleTag}>
                      {ROLE_NAMES[comment.authorRole] || "Читач"}
                    </span>
                  </div>

                  {/* Дата залишається вгорі праворуч */}
                  <span className={styles.commDate}>
                    {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleTimeString() : "щойно"}
                  </span>
                </div>

                <p className={styles.commText}>{comment.text}</p>
              </div>

              {/* Кнопка видалення тепер живе окремо внизу */}
              {user?.role === 'admin' && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}