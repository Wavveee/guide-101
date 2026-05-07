import React from 'react';
import { Link, useLocation } from 'react-router-dom'; //useLocation тепер тут
import { ROLE_NAMES } from '../../constants/roles';
import { TagsWidget } from './tags-widget';
import styles from "./sidebar-right.module.css";

export function SidebarRight({ user }) {
  const location = useLocation();
  
  // ЦЯ ЗМІННА ВИРІШУЄ ВСЕ
  // Ми кажемо: "Показуй теги ТІЛЬКИ якщо шлях дорівнює '/'"
  const isHomePage = location.pathname === '/';

  const displayName = user ? user.displayName : "Мандрівник";
  const displayRole = user ? (ROLE_NAMES[user.role] || "Читач") : ROLE_NAMES.guest;

  return (
    <aside className={styles.sidebar}>
      {/* Профіль - він є ЗАВЖДИ */}
      <div className={styles.userBox}>
        <h4>Мій профіль</h4>
        <p>Привіт, <strong>{displayName}</strong>!</p>
        
        <div className={`${styles.roleBadge} ${!user ? styles.guestBadge : ""}`}>
          {displayRole}
        </div>

        {user && location.pathname !== '/profile' && (
          <Link to="/profile" className={styles.profileBtn}>
            Налаштування профілю
          </Link>
        )}
      </div>

      {/* ТЕГИ - з'являться ТІЛЬКИ на головній */}
      {isHomePage ? (
        <div className={styles.tagsSection}>
          <TagsWidget />
          {!user && (
            <p className={styles.loginHint}>
              Увійдіть, щоб отримати можливість писати коментарі та створювати дописи.
            </p>
          )}
        </div>
      ) : (
        /* Якщо ми не на головній, тут буде порожньо */
        <div className={styles.emptySpace}></div>
      )}
    </aside>
  );
}