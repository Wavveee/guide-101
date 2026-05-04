import styles from "./articles.module.css";

export function Articles() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.sorting}>
          <ul className={styles.options}>
            <li>Релевантні</li>
            <li>Свіжі</li>
            <li>Популярні</li>
          </ul>
        </div>

        
      </main>
    </>
  );
}
