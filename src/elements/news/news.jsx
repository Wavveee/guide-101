import styles from "./news.module.css";
import { NewsContainer } from "./news_container/news_container";

export function News() {
  return (
    <section className={styles.news}>
      <NewsContainer gridDirection={styles.news1}></NewsContainer>
      <NewsContainer gridDirection={styles.news2}></NewsContainer>
      <NewsContainer gridDirection={styles.news3}></NewsContainer>
      <NewsContainer gridDirection={styles.news4}></NewsContainer>
      <NewsContainer gridDirection={styles.news5}></NewsContainer>
      <NewsContainer gridDirection={styles.news6}></NewsContainer>
      <NewsContainer gridDirection={styles.news7}></NewsContainer>
      <NewsContainer gridDirection={styles.news8}></NewsContainer>
      <NewsContainer gridDirection={styles.news9}></NewsContainer>
    </section>
  );
}
