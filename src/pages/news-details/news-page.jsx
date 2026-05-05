import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from "../../firebaseConfig";
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import styles from "./news-page.module.css";

export function NewsPage({ user }) {
  const { id } = useParams(); // Беремо ID новини з URL
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // 1. Отримуємо дані самої новини
    const getNewsData = async () => {
      const docRef = doc(db, "news", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setItem(docSnap.data());
    };

    // 2. Отримуємо коментарі в реальному часі
    const q = query(collection(db, "news", id, "comments"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    getNewsData();
    return () => unsub();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    await addDoc(collection(db, "news", id, "comments"), {
      text: newComment,
      authorName: user?.displayName || "Гість",
      authorPhoto: user?.photoURL || "",
      createdAt: serverTimestamp()
    });
    setNewComment("");
  };

  if (!item) return <div className={styles.loader}>Завантаження новини...</div>;

  return (
    <div className={styles.newsContainer}>
      <Link to="/" className={styles.backBtn}>← Назад до списку</Link>
      
      <header className={styles.header}>
        <span className={styles.category}>{item.category}</span>
        <h1>{item.title}</h1>
        <div className={styles.meta}>
          Автор: <strong>{item.authorName}</strong> | {item.createdAt?.toDate().toLocaleDateString()}
        </div>
      </header>

      <img src={item.imageUrl} alt={item.title} className={styles.mainImg} />

      <section className={styles.body}>
        <p className={styles.lead}>{item.lead}</p>
        <div className={styles.content}>{item.content}</div>
        
        <div className={styles.detailsBox}>
          <h4>Технічні деталі:</h4>
          <p>{item.details}</p>
          {item.source && <p className={styles.source}>Джерело: <a href={item.source} target="_blank" rel="noreferrer">Посилання</a></p>}
        </div>
      </section>

      <hr />

      {/* СЕКЦІЯ КОМЕНТАРІВ */}
      <section className={styles.commentsSection}>
        <h3>Коментарі ({comments.length})</h3>
        
        <form onSubmit={handleComment} className={styles.commentForm}>
          <textarea 
            placeholder={user ? "Напишіть свою думку..." : "Увійдіть, щоб коментувати"} 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user}
          />
          <button type="submit" disabled={!user}>Відправити</button>
        </form>

        <div className={styles.commentsList}>
          {comments.map(c => (
            <div key={c.id} className={styles.commentItem}>
              <strong>{c.authorName}</strong>
              <p>{c.text}</p>
              <small>{c.createdAt?.toDate().toLocaleString()}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}