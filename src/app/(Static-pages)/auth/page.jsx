import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Auth() {
  return (
    <div className={styles.auth}>
      <Image 
        src="/images/logo.png"
        alt="logo"
        className={styles.logo}
        width={100}
        height={100}
        priority
      />
      <div className={styles.container}>
        <h1 className={styles.title}>Sign up</h1>
        <Link href="/auth/login" className={styles.login}>Log in</Link>
        <Link href="/auth/signup" className={styles.signup}>Sign up</Link>
      </div>
    </div>
  );
}
