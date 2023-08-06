import styles from "./main.module.css";
import { LeftSidebar } from "./left_sidebar/leftSidebar";
import { RightSidebar } from "./right_sidebar/rightSidebar";
import { Articles } from "./main/articles";

export function Main() {
  return (
    <div className={styles.wrepper}>
      <LeftSidebar></LeftSidebar>
      <Articles></Articles>
      <RightSidebar></RightSidebar>
    </div>
  );
}
