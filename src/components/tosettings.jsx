import Link from "next/link"
import styles from "./page.module.css"


export default function Tosettings() {
  return (
    <Link href="/profile" className={styles.settings}>
        <i className="pi pi-cog" style={{ fontSize: "1.5rem" }}></i>
    </Link>
  )
}
