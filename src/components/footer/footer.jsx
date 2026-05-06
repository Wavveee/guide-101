import React from 'react';
import styles from './footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          Guide-101
        </div>

        <div className={styles.info}>
          <span className={styles.coursework}>Проєкт для курсової роботи · 2026</span>
          <a href="mailto:anton.g.2.9x@gmail.com" className={styles.email}>
            Автор : anton.g.2.9x@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}