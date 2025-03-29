"use client"
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
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
  username: Yup.string()
  .required("username is required")
  .trim()
  .min(3, "must be at least 3 characters")
  .max(50, "must be less than 50 characters"),
  email: Yup.string()
    .required("email is required")
    .email("enter a valid email"),
  password: Yup.string()
    .required("password is required")
    .min(8, "must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "must contain an uppercase, a number, and a special character."
    ),
});

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useRef(null);


  const handleSubmit = async (values) => {
    setLoading(true); 
    try {

      const response = await axios.post("https://walletlyapi.onrender.com/api/auth/registration", values);
      Cookies.set('Walletly_Token', response.data.token, { expires: 3, path: '/' });
      router.push("/transactions");

    } catch (err) {

      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: err.response?.data?.message || "Signup failed. Try again!",
        life: 300000,
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
        <h1 className={styles.title}>Sign up</h1>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form}>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Username</label>
              <Field
                type="text"
                name="username"
                placeholder="username"
                className={`${styles.input} input`}
              />
              <ErrorMessage name="username" component="div" className={styles.error} />
            </div>

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

            <Link href="/auth/login" className={`${styles.acc} acc`}>
              Already have an account?
            </Link>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
