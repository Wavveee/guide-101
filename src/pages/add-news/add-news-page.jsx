import React, { useState } from 'react';
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { TAGS } from "../../constants/tags"; // Імпортуємо наш список тегів
import styles from "./add-news-page.module.css";

export function AddNewsPage({ user }) {
  const [title, setTitle] = useState("");
  const [lead, setLead] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState(""); // Тут буде зберігатися slug тегу
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      alert("Будь ласка, оберіть категорію!");
      return;
    }

    try {
      await addDoc(collection(db, "news"), {
        title,
        lead,
        content,
        imageUrl,
        category, // Зберігаємо slug (наприклад, 'rpg' або 'шутери')
        authorId: user.uid,
        authorName: user.displayName,
        createdAt: serverTimestamp(),
      });
      
      navigate("/"); // Повертаємось на головну після публікації
    } catch (error) {
      console.error("Помилка при додаванні:", error);
    }
  };

  return (
    <div className={styles.addNewsContainer}>
      <h2>Створити новий допис</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="text" 
          placeholder="Заголовок новини" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required 
        />

        {/* --- ОСЬ НАШ НОВИЙ СПИСОК КАТЕГОРІЙ --- */}
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          required
          className={styles.select}
        >
          <option value="" disabled>Оберіть жанр або категорію</option>
          {TAGS.map(tag => (
            <option key={tag.id} value={tag.slug}>
              {tag.name.replace('#', '')} {/* Прибираємо # для зручності у списку */}
            </option>
          ))}
        </select>

        <input 
          type="text" 
          placeholder="Посилання на зображення (URL)" 
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <textarea 
          placeholder="Короткий лід (опис для картки)" 
          value={lead}
          onChange={(e) => setLead(e.target.value)}
          rows="3"
          required
        />

        <textarea 
          placeholder="Повний текст новини" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          required
        />

        <button type="submit" className={styles.submitBtn}>Опублікувати</button>
      </form>
    </div>
  );
}