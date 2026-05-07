import React, { useState, useEffect } from 'react'; // Додали useState та useEffect
import styles from "./header.module.css";
import logo from "./src/gamepad.png";
import searchIcon from "./src/search-left-1506-svgrepo-com.svg"; // Припускаємо, що іконка лежить тут
import { Link, useSearchParams } from 'react-router-dom';
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export function Header({ user, setUser, onToggleAdd, isFormOpen }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.get('q') || "");

  // Синхронізуємо інпут, якщо параметр q в URL змінився ззовні (наприклад, при переході на іншу сторінку)
  useEffect(() => {
    setLocalSearch(searchParams.get('q') || "");
  }, [searchParams]);

  // 2. Функція, яка фактично запускає пошук (оновлює URL)
  const handlePerformSearch = () => {
    const newParams = new URLSearchParams(searchParams);

    if (localSearch.trim()) {
      newParams.set('q', localSearch.trim());
    } else {
      newParams.delete('q');
    }

    setSearchParams(newParams);
  };

  // 3. Обробка натискання клавіші Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePerformSearch();
    }
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const userRef = doc(db, "users", firebaseUser.uid);
      let userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: "registered_user",
          createdAt: serverTimestamp()
        });
        userSnap = await getDoc(userRef);
      }

      const userData = userSnap.data();
      setUser({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role: userData.role
      });
    } catch (error) {
      console.error("Помилка авторизації:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Помилка при виході:", error.message);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>

        <Link to="/" className={styles.logoBlock}>
          <img src={logo} alt="logo" className={styles.logoImg} />
          <span className={styles.title}>Guide-101</span>
        </Link>

        {/* Центральна частина: Пошук */}
        <div className={styles.searchBlock}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Пошук новин..."
              className={styles.searchInput}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)} // Оновлюємо тільки локальний текст
              onKeyDown={handleKeyDown} // Слухаємо Enter
            />
            {/* Іконка як кнопка */}
            <button className={styles.searchBtn} onClick={handlePerformSearch}>
              <img src={searchIcon} alt="search" className={styles.searchIconImg} />
            </button>
          </div>
        </div>

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
                  <img src={user.photoURL || "https://via.placeholder.com/40px"}
                    alt="avatar"
                    className={styles.avatar}
                    referrerPolicy="no-referrer" />
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