import styles from "./header.module.css";
import logo from "./src/gamepad.png";

export function Header() {
  return (
    <header>
      <div className={styles.wrapper}>
        <img src={logo} alt="logo" className={styles.logo} />
        
        <h1>Guide-101</h1>

        <div className={styles.login}>
          <button className={styles.btn}> Login</button>
          <button className={styles.btn}>Logout</button>
        </div>
      </div>
    </header>
  );
}
