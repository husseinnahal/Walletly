"use client"
import { useRef, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import styles from "../page.module.css";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import Cookies from "js-cookie";



const validationSchema = Yup.object({
  email: Yup.string()
    .required("email is required"),
  password: Yup.string()
    .required("password is required")

});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useRef(null);


  const handleSubmit = async (values) => {
    setLoading(true); 
    try {

      const response = await axios.post("https://walletlyapi.onrender.com/api/auth/login", values);
      Cookies.set('Walletly_Token', response.data.token, { expires: 3, path: '/' });
      router.push("/transactions");

    } catch (err) {      
     
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: err.response?.data?.message || "login failed. Try again!",
        life: 3000,
      });

    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={styles.auth}>
      <Toast ref={toast} />

      <Image
        src="/images/logo.png"
        alt="logo"
        className={styles.logo}
        width={100}
        height={100}
        priority
      />

      <div className={styles.container}>
        <h1 className={styles.title}>Log in</h1>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form}>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <Field
                type="email"
                name="email"
                placeholder="email"
                className={`${styles.input} input`}
              />
              <ErrorMessage name="email" component="div" className={styles.error} />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <Field
                type="password"
                name="password"
                placeholder="password"
                className={`${styles.input} input`}
              />
              <ErrorMessage name="password" component="div" className={styles.error} />
            </div>

            <Link href='/auth/signup' className={`${styles.acc} acc`}>Don't have an account?</Link>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "loging in..." : "Log in"}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
