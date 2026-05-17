import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import styles from './edit-news-page.module.css';

export function EditNewsPage({ user }) {
    const { id } = useParams(); // Дістаємо id новини з URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        imageUrl: '',
        lead: '',
        fullText: ''
    });
    const [loading, setLoading] = useState(true);

    // 1. Завантажуємо дані новини при відкритті сторінки
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(db, "news", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // БЕЗПЕКА: Тепер доступ має ТІЛЬКИ творець цього допису, без винятків
                    if (data.authorId !== user?.uid) {
                        alert("Редагувати допис може тільки його автор!");
                        navigate('/');
                        return;
                    }

                    setFormData({
                        title: data.title,
                        category: data.category,
                        imageUrl: data.imageUrl,
                        lead: data.lead,
                        fullText: data.content
                    });
                } else {
                    alert("Допис не знайдено!");
                    navigate('/');
                }
            } catch (error) {
                console.error("Помилка при отриманні допису:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchPost();
    }, [id, user, navigate]);

    // 2. Обробка змін в полях
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. Збереження змін (Update)
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(db, "news", id);
            await updateDoc(docRef, {
                ...formData,
                updatedAt: new Date() // Фіксуємо час оновлення
            });
            alert("Допис успішно оновлено!");
            navigate(`/news/${id}`); // Повертаємо користувача до читання новини
        } catch (error) {
            console.error("Помилка при оновленні:", error);
            alert("Помилка при збереженні.");
        }
    };

    // 4. Видалення (Delete)
    const handleDelete = async () => {
        const isConfirmed = window.confirm("Ви точно хочете видалити цей допис назавжди?");
        if (!isConfirmed) return;

        try {
            await deleteDoc(doc(db, "news", id));
            alert("Допис видалено.");
            navigate('/'); // Після видалення йдемо на головну
        } catch (error) {
            console.error("Помилка при видаленні:", error);
        }
    };

    if (loading) return <div className={styles.loader}>Завантаження даних...</div>;

    return (
        <div className={styles.editPage}>
            <h1>Редагувати допис</h1>

            <form onSubmit={handleUpdate} className={styles.form}>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Заголовок"
                    required
                />

                <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Категорія (наприклад: #rpg)"
                    required
                />

                <input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Посилання на картинку"
                />

                <textarea
                    name="lead"
                    value={formData.lead}
                    onChange={handleChange}
                    placeholder="Короткий лід (опис для картки)"
                    rows="3"
                />

                <textarea
                    name="fullText"
                    value={formData.fullText}
                    onChange={handleChange}
                    placeholder="Повний текст новини"
                    rows="10"
                    required
                />

                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.saveBtn}>Зберегти зміни</button>

                    {/* Кнопка видалення для автора */}
                    <button
                        type="button"
                        onClick={handleDelete}
                        className={styles.deleteBtn}
                    >
                        Видалити допис
                    </button>
                </div>
            </form>
        </div>
    );
}