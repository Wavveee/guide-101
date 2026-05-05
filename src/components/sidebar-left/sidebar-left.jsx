import React from 'react';
import { Link } from 'react-router-dom';
import styles from "./sidebar-left.module.css";

export function SidebarLeft() {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.menuGroup}>
        <Link to="/" className={styles.navLink}>🏠 Головна</Link>
        <Link to="/games" className={styles.navLink}>🎮 Ігри</Link>
        <Link to="/hardware" className={styles.navLink}>🖥️ Залізо</Link>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.socialGroup}>
        <h4 className={styles.groupTitle}>Спільнота</h4>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1" target="_blank" rel="noreferrer" className={styles.socialLink}>Discord</a>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1" target="_blank" rel="noreferrer" className={styles.socialLink}>Telegram</a>
      </div>
    </nav>
  );
}