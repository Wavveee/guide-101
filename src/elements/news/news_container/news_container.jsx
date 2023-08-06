import styles from "./news_container.module.css";
import newsImg from "./src/zahlushka.jpg";

export function NewsContainer(props) {
  const { gridDirection } = props;

  return (
    <div className={gridDirection}>
      <div className={styles.newsContainer}>
        <div className={styles.newsDescription}>
          <h2> Title </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut ipsum
            ab facere ipsa cum. Porro quidem dolores molestias, facilis quaerat
           
          </p>
        </div>
        <div>
          
        </div>
      </div>
    </div>
  );
}
