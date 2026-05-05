import React from 'react';
import styles from "./sidebar-right.module.css";

export function SidebarRight({ user }) {
  return (
    <aside className={styles.sidebar}>
      {!user ? (
        <div className={styles.guestBox}>
          <h4>Вітаємо на Guide-101!</h4>
          <p>Увійдіть, щоб отримати доступ до всіх функцій порталу.</p>
        </div>
      ) : (
        <div className={styles.userBox}>
          <h4>Мій профіль</h4>
          <p>Привіт, <strong>{user.displayName}</strong>!</p>
          <div className={styles.roleBadge}>{user.role}</div>
        </div>
      )}
    </aside>
  );
}