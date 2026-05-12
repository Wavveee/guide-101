import React from 'react';
import styles from "./sidebar-left.module.css";

export function SidebarLeft() {
  // Список ресурсів, які ми реально використовували
  const techStack = [
    { name: 'React', url: 'https://react.dev', icon: '⚛️' },
    { name: 'Firebase', url: 'https://firebase.google.com', icon: '🔥' },
    { name: 'React Router', url: 'https://reactrouter.com', icon: '🛣️' },
    { name: 'Firestore', url: 'https://firebase.google.com/docs/firestore', icon: '📦' },
    { name: 'CSS Modules', url: 'https://github.com/css-modules/css-modules', icon: '🎨' }
  ];

  return (
    <nav className={styles.sidebar}>
      {/* НОВИЙ БЛОК: Технології (замість навігації) */}
      <div className={styles.group}>
        <h4 className={styles.groupTitle}>ТЕХНОЛОГІЇ</h4>
        {techStack.map((tech) => (
          <a 
            key={tech.name}
            href={tech.url} 
            target="_blank" 
            rel="noreferrer" 
            className={styles.link}
          >
            <span className={styles.icon}>{tech.icon}</span> {tech.name}
          </a>
        ))}
      </div>

      <hr className={styles.divider} />

      {/* Спільнота залишається на місці */}
      <div className={styles.group}>
        <h4 className={styles.groupTitle}>СПІЛЬНОТА</h4>
        <a 
          href="https://discord.com" 
          target="_blank" 
          rel="noreferrer" 
          className={styles.link}
        >
          Discord
        </a>
        <a 
          href="https://t.me" 
          target="_blank" 
          rel="noreferrer" 
          className={styles.link}
        >
          Telegram
        </a>
      </div>
    </nav>
  );
}