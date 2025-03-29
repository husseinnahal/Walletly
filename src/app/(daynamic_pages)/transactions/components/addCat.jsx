"use client";
import { useTranslation } from "react-i18next";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import {  useRef, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

export default function AddCat({ visible, onClose,onCatAdded }) {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const {t}=useTranslation();
  
  const validationSchema = Yup.object().shape({
    name: Yup.string()
    .trim()
    .required(t("AddCat.validation.nameRequired"))
    .min(3, t("AddCat.validation.nameMin"))
    .max(20, t("AddCat.validation.nameMax")),
    image: Yup.mixed()
    .required(t("AddCat.validation.imageRequired"))
  });


  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const token = Cookies.get("Walletly_Token"); 
      const response = await axios.post(
        "https://walletlyapi.onrender.com/api/cat",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", 
          },
        }
      );     
      
      onCatAdded();
      toast.current.show({ severity: "success", summary: "Success", detail: t("AddCat.addedcat") });
      resetForm();

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
      header={t("AddCat.addCat")}
      maximizable
      className="dialog" 
    >
      <Toast ref={toast} />

      <Formik
        initialValues={{
          name: "",
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="formContainer">

            <div>
              <label className="label">
              {t("AddCat.name")} <span className="required">*</span>
              </label>
              <Field
                name="name"
                as={InputText}
                placeholder="Enter name"
                className="input"
              />
              <ErrorMessage name="name" component="div" className="errorMessage" />
            </div>
            <div>
              <label className="label">
              {t("AddCat.img")}
              </label>
              <input
                type="file"
                className="input"
                onChange={(event) => setFieldValue("image", event.currentTarget.files[0])}
              />
              <ErrorMessage name="image" component="div" className="errorMessage" />

            </div>

            <div className="buttonContainer">
              <Button
                label={loading ? `${t("create")}...` : t("create")}
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

