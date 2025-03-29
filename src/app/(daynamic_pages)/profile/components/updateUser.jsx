"use client";
import { useTranslation } from "react-i18next";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

export default function UpdateUser({ visible, onClose ,user ,onUpdate}) {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  
  const {t}=useTranslation();
  

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .trim()
      .required(t('userValidation.usernameRequired'))
      .min(3, t('userValidation.usernameMin'))
      .max(40, t('userValidation.usernameMax')),
    
    email: Yup.string()
      .trim()
      .required(t('userValidation.emailRequired'))
      .email(t('userValidation.emailInvalid')),
  });


  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const token = Cookies.get("Walletly_Token"); 
      const response = await axios.put(
        "https://walletlyapi.onrender.com/api/auth/updateUser",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", 
          },
        }
      );     
      onUpdate();

    } catch (error) {    
      toast.current.show({ severity: "warn", summary: "Error", detail: error.response.data.message });

    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onClose}
      header={t("upProf")}
      maximizable
      className="dialog" 
    >
      <Toast ref={toast} />

      <Formik
        initialValues={{
          username: user?.username || "",
          email: user?.email || "",
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="formContainer">
            <div>
              <label className="label">
                {t("profImg")}
              </label>
              <input
                type="file"
                className="input"
                onChange={(event) => setFieldValue("image", event.currentTarget.files[0])}
              />
            </div>

            <div>
              <label className="label">
                {t("username")} <span className="required">*</span>
              </label>
              <Field
                name="username"
                as={InputText}
                placeholder="Enter username"
                className="input"
              />
              <ErrorMessage name="username" component="div" className="errorMessage" />
            </div>

            <div>
              <label className="label">
                {t("email")} <span className="required">*</span>
              </label>
              <Field
                name="email"
                as={InputText}
                placeholder="Enter email"
                className="input"
              />
              <ErrorMessage name="email" component="div" className="errorMessage" />
            </div>



            <div className="buttonContainer">
              <Button
                label={loading ? `${t("up")}...` : t("upProf")}
                type="submit"
                className="button"
                disabled={loading}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
