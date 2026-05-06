import React from 'react';
import { ROLE_NAMES } from '../../constants/roles';
import styles from './profile-page.module.css';

export function ProfilePage({ user }) {
  if (!user) return <div className={styles.error}>Будь ласка, увійдіть у систему</div>;

  // Функція для створення листа
const handleRequestRole = () => {
  console.log("Кнопку натиснуто! Спроба відкрити пошту...");
  const myEmail = "anton.g.2.9x@gmail.com"; // Твоя актуальна пошта
  const subject = encodeURIComponent(`Guide-101: Запит на роль Автора від ${user.displayName}`);
  const body = encodeURIComponent(
    `Вітаю, Адміне!\n\nЯ, ${user.displayName} (UID: ${user.uid}), хочу змінити свою роль на "Автор", щоб публікувати цікавий контент на сайті.\n\nЧекаю на ваше рішення!`
  );

  // Відкриваємо поштовий клієнт
  window.location.href = `mailto:${myEmail}?subject=${subject}&body=${body}`;
};

  return (
    <div className={styles.profileContainer}>
      <h2>Керування профілем</h2>
      
      <div className={styles.profileCard}>
        <div className={styles.avatarBlock}>
          <img src={user.photoURL} alt="User Avatar" className={styles.largeAvatar} />
          <span className={styles.roleLabel}>{ROLE_NAMES[user.role] || "Читач"}</span>
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.field}>
            <label>Ваше ім'я в системі:</label>
            <div className={styles.userName}>{user.displayName}</div>
          </div>
          
          <div className={styles.field}>
            <label>Email:</label>
            <div className={styles.userEmail}>{user.email}</div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.actionBlock}>
            <h4>Бажаєте стати автором?</h4>
            <p>Надішліть нам запит, і ми розглянемо вашу кандидатуру.</p>
            <button onClick={handleRequestRole} className={styles.requestBtn}>
              Подати запит на роль "Автор"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}