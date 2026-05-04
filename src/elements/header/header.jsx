import React from 'react';
import styles from "./header.module.css";
import logo from "./src/gamepad.png";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";


export function Header({ user, setUser }) {
  
const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Створюємо посилання на документ користувача в базі за його унікальним UID
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Якщо користувача немає в базі — створюємо його (перша реєстрація)
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "registered_user", // Роль за замовчуванням згідно з ТЗ
        createdAt: serverTimestamp()
      });
      console.log("Нового користувача зареєстровано в БД");
    }

    setUser(user);
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
      <div className={styles.wrapper}>
        <img src={logo} alt="logo" className={styles.logo} />
        <h1>Guide-101</h1>

        <div className={styles.login}>
          {!user ? (
            /* Оскільки ми на Firebase, використовуємо звичайну кнопку */
            <button className={styles.loginBtn} onClick={handleLogin}>
              Увійти через Google
            </button>
          ) : (
            <div className={styles.userInfo}>
              {/* Показуємо фото та ім'я залогіненого юзера */}
              <img src={user.photoURL} alt="avatar" className={styles.avatar} />
              <span>Привіт, {user.displayName}</span>
              <button onClick={handleLogout}>Вийти</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}