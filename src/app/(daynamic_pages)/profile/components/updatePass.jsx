"use client";
import { useTranslation } from "react-i18next";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

export default function UpdateUser({ visible, onClose }) {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const {t}=useTranslation()

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .trim()
      .required(t('password.oldPassword.required')),
  
    newPassword: Yup.string()
      .trim()
      .required(t('password.newPassword.required'))
      .min(8, t('password.newPassword.min'))
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        t('password.newPassword.pattern')
      ),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const token = Cookies.get("Walletly_Token"); 
      const response = await axios.put(
        "https://walletlyapi.onrender.com/api/auth/updatePassword",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", 
          },
        }
      );     
      
      toast.current.show({ severity: "success", summary: "Success", detail: t('password.success') });

      resetForm({
        values: {
          oldPassword: "",
          newPassword: "",
        },
      });
    } catch (error) {
      toast.current.show({
        severity: "warn",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onClose}
      header={t("newPass")}
      maximizable
      className="dialog" 
    >
      <Toast ref={toast} />

      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="formContainer">
            <div>
              <label className="label">
                {t("oldPass")} <span className="required">*</span>
              </label>
              <Field
                name="oldPassword"
                as={InputText}
                type="password"
                placeholder="Enter old Password"
                className="input"
              />
              <ErrorMessage name="oldPassword" component="div" className="errorMessage" />
            </div>

            <div>
              <label className="label">
                {t("newPass")} <span className="required">*</span>
              </label>
              <Field
                name="newPassword"
                as={InputText}
                type="password"
                placeholder="Enter new password"
                className="input"
              />
              <ErrorMessage name="newPassword" component="div" className="errorMessage" />
            </div>

            <div className="buttonContainer">
              <Button
                label={loading ? `${t("up")}...` : t("up")}
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
