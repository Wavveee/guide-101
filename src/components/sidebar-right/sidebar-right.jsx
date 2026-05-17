import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROLE_NAMES } from '../../constants/roles';
import { TagsWidget } from './tags-widget';
import styles from "./sidebar-right.module.css";

export function SidebarRight({ user, showTags }) {
  const location = useLocation();

  // Безпечно перевіряємо через тернарний оператор
  const displayName = user ? user.displayName : "Мандрівник";
  const displayRole = user ? (ROLE_NAMES[user.role] || "Читач") : ROLE_NAMES.guest;
  const isProfilePage = location.pathname === '/profile';

  return (
    <aside className={styles.sidebar}>
      {/* Блок профілю */}
      <div className={styles.userBox}>
        <h4>Мій профіль</h4>
        <p>Привіт, <strong>{displayName}</strong>!</p>

        <div className={`${styles.roleBadge} ${!user ? styles.guestBadge : ""}`}>
          {displayRole}
        </div>

        {/* Контейнер для кнопок керування — показуємо тільки для залогінених */}
        {user && (
          <div className={styles.profileActions}>
            {!isProfilePage && (
              <Link to="/profile" className={styles.profileBtn}>
                Налаштування профілю
              </Link>
            )}

            {/* БЕЗПЕЧНА ПЕРЕВІРКА: використовуємо знак питання user?.role */}
            {(user?.role === 'author' || user?.role === 'admin') && (
              <Link to="/?author=me" className={styles.myPostsBtn}>
                Мої дописи
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Категорії */}
      {showTags && (
        <div className={styles.tagsContainer}>
          <TagsWidget />
        </div>
      )}

      {/* Підказка для гостей */}
      {!user && showTags && (
        <p className={styles.loginHint}>
          Увійдіть, щоб отримати можливість писати коментарі та створювати дописи.
        </p>
      )}
    </aside>
  );
}