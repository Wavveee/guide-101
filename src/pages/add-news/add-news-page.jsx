import React, { useState } from 'react';
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import styles from "./add-news-page.module.css";

export function AddNewsPage({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    lead: '',
    content: '',
    details: '', 
    imageUrl: '',
    source: '',
    category: 'Games'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Додаємо документ у колекцію "news"
      await addDoc(collection(db, "news"), {
        ...formData,
        authorId: user.uid,
        authorName: user.displayName,
        createdAt: serverTimestamp(),
      });
      alert("Новину успішно додано!");
      navigate("/"); // Повертаємося на головну після публікації
    } catch (error) {
      console.error("Помилка при додаванні:", error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerRow}>
        <Link to="/" className={styles.backLink}>← На головну</Link>
        <h2>Створення нової публікації</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.addForm}>
        {/* 1. Заголовок */}
        <div className={styles.field}>
          <label>Назва новини</label>
          <input type="text" placeholder="Введіть заголовок..." required 
            onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>

        {/* 2. Лід (Короткий опис) */}
        <div className={styles.field}>
          <label>Лід-абзац (коротко про головне)</label>
          <textarea placeholder="Опишіть новину одним реченням..." required
            onChange={e => setFormData({...formData, lead: e.target.value})} />
        </div>

        {/* 3. Основна інформація */}
        <div className={styles.field}>
          <label>Основний текст</label>
          <textarea className={styles.mainContent} placeholder="Детальний опис події..." required
            onChange={e => setFormData({...formData, content: e.target.value})} />
        </div>

        <div className={styles.gridFields}>
          {/* 4. Деталі (Платформи) */}
          <div className={styles.field}>
            <label>Деталі (Платформи / Дата релізу)</label>
            <input type="text" placeholder="PC, PS5, Xbox..." 
              onChange={e => setFormData({...formData, details: e.target.value})} />
          </div>

          {/* 5. Категорія */}
          <div className={styles.field}>
            <label>Категорія</label>
            <select onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Games">Ігри</option>
              <option value="Reviews">Огляди</option>
              <option value="CyberSport">Кіберспорт</option>
              <option value="Hardware">Залізо</option>
            </select>
          </div>
        </div>

        {/* 6. Зображення */}
        <div className={styles.field}>
          <label>URL зображення (обкладинка)</label>
          <input type="text" placeholder="https://..." 
            onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
        </div>

        {/* 7. Джерело */}
        <div className={styles.field}>
          <label>Джерело інформації (посилання)</label>
          <input type="text" placeholder="Джерело або цитата..." 
            onChange={e => setFormData({...formData, source: e.target.value})} />
        </div>

        <button type="submit" className={styles.submitBtn}>Опублікувати новину</button>
      </form>
    </div>
  );
}