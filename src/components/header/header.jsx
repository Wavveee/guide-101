import React from 'react';
import styles from "./header.module.css";
import logo from "./src/gamepad.png";
import { ROLE_NAMES } from '../../constants/roles';
import { Link } from 'react-router-dom';
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";


export function Header({ user, setUser, onToggleAdd, isFormOpen }) {

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const userRef = doc(db, "users", firebaseUser.uid);
      let userSnap = await getDoc(userRef);

      // Якщо це новий юзер — створюємо запис
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: "registered_user",
          createdAt: serverTimestamp()
        });
        // Оновлюємо Snapshot, щоб отримати актуальні дані (роль)
        userSnap = await getDoc(userRef);
      }

      const userData = userSnap.data();

      // Передаємо в setUser об'єднані дані (акаунт + роль з бази)
      setUser({
        ...firebaseUser,
        role: userData.role // Тепер user.role буде доступним!
      });

  // У файлі header.jsx
console.log(`Вхід успішний. Вітаємо, ${user.displayName}! Ваша роль: ${ROLE_NAMES[user.role] || "Читач"}`);
    } catch (error) {
      console.error("Помилка авторизації:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Повертаємо стан у "гість"
    } catch (error) {
      console.error("Помилка при виході:", error.message);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>

        {/* Ліва частина: Лого та Назва */}
        <Link to="/" className={styles.logoBlock}>
          <img src={logo} alt="logo" className={styles.logoImg} />
          <span className={styles.title}>Guide-101</span>
        </Link>

        {/* Центральна частина: Пошук */}
        <div className={styles.searchBlock}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input type="text" placeholder="Пошук..." className={styles.searchInput} />
          </div>
        </div>

        {/* Права частина: Кнопка та Профіль */}
        <div className={styles.rightBlock}>
          {user && (user.role === 'admin' || user.role === 'author') && (
            <Link to="/add-news" className={styles.createBtn}>
              Створити допис
            </Link>
          )}

          <div className={styles.authZone}>
            {!user ? (
              <button onClick={handleLogin} className={styles.loginBtn}>Увійти</button>
            ) : (
              <div className={styles.userControls}>
                <div className={styles.avatarWrapper}>
                  <img src={user.photoURL} alt="avatar" className={styles.avatar} />
                </div>
                <button onClick={handleLogout} className={styles.logoutBtn}>Вихід</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}