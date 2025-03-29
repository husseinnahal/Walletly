import styles from "./page.module.css"

export default function Loader() {
    return (
      <div className={styles.loader}>
          <div className={styles.coin}>
          <span className={styles.engraving}>$</span>
          </div>
      </div>
    )
  }
