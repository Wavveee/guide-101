import React from 'react';
import { Link } from 'react-router-dom';
import { ROLE_NAMES } from '../../constants/roles';
import { TagsWidget } from './tags-widget';
import styles from "./sidebar-right.module.css";

export function SidebarRight({ user }) {
  // Визначаємо відображуване ім'я та роль
  const displayName = user ? user.displayName : "Мандрівник";
  const displayRole = user ? (ROLE_NAMES[user.role] || "Читач") : ROLE_NAMES.guest;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userBox}>
        <h4>Мій профіль</h4>
        <p>Привіт, <strong>{displayName}</strong>!</p>

        <div className={`${styles.roleBadge} ${!user ? styles.guestBadge : ""}`}>
          {displayRole}
        </div>

        {/* Кнопка налаштувань, яка з'являється лише для залогінених користувачів */}
        {user && (
          <Link to="/profile" className={styles.profileBtn}>
            Налаштування профілю
          </Link>
        )}
      </div>

      <TagsWidget />

      {!user && (
        <p className={styles.loginHint}>
          Увійдіть, щоб отримати можливість писати коментарі та створювати дописи.
        </p>
      )}
    </aside>
  );
}