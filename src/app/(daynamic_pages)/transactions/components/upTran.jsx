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

export default function AddTran({ visible, onClose ,Cats ,onTransactionUP,info}) {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]); 

  const { t } = useTranslation();

  // validation
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .required(t("AddTran.validation.titleRequired"))
      .min(3, t("AddTran.validation.titleMin"))
      .max(50, t("AddTran.validation.titleMax")),
    amount: Yup.number()
      .required(t("AddTran.validation.amountRequired"))
      .typeError(t("AddTran.validation.amountInvalid"))
      .min(0.01, t("AddTran.validation.amountMin")),
    type: Yup.string()
      .required(t("AddTran.validation.typeRequired"))
      .oneOf(["income", "expense"], t("AddTran.validation.typeInvalid")),
    categoryId: Yup.string().required(t("AddTran.validation.categoryRequired")),
    unit: Yup.string().required(t("AddTran.validation.unitRequired")),
  });

  const [loader, setLoader] = useState(true);

  // get  currency
  useEffect(() => {

    const fetchUnits = async () => {
      setLoader(true);
      try {
        const response = await axios.get("https://open.er-api.com/v6/latest/USD");
        setUnits(Object.keys(response.data.rates));
      } catch (err) {
        setUnits([])
      }
      finally {
        setLoader(false);
      }
    };
    
    fetchUnits();
  }, []);

// update transaction
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = Cookies.get("Walletly_Token");
      const response=await axios.put(
        `https://walletlyapi.onrender.com/api/transaction/${info._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onTransactionUP();
      toast.current.show({ severity: "success", summary: "Success", detail: t("AddTran.upTransaction") });
      
    } catch (error) {
      toast.current.show({
        severity: "warn",
        summary: "Error",
        detail: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <Dialog visible={visible} onHide={onClose} header={t("AddTran.uptrn")} maximizable className="dialog">
      <Toast ref={toast} />

      { loader ? 

        <div style={{height:"150px",display:"flex",alignItems:"center",justifyContent:'center'}}>{t("loading")}...</div>:
        
        <Formik
          initialValues={{
            title: info.title,
            amount: info.amount,
            type: info.type,
            categoryId: info.categoryId?._id,
            unit: units[0],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form className="formContainer">
              <div>
                <label className="label">{t("AddTran.title")} <span className="required">*</span></label>
                <Field name="title" as={InputText} placeholder="Enter title" className="input" />
                <ErrorMessage name="title" component="div" className="errorMessage" />
              </div>

              <div>
                <label className="label">{t("AddTran.amount")} <span className="required">*</span></label>
                <Field name="amount" as={InputText} step="any"  min="0" type="number" placeholder="Enter amount" className="input" />
                <ErrorMessage name="amount" component="div" className="errorMessage" />
              </div>

              <div>
                <label className="label">{t("AddTran.type")}<span className="required">*</span></label>
                <Field name="type" as="select" className="input">
                  <option value="" disabled>{t("AddTran.selectType")}</option>
                  <option value="income">{t("AddTran.income")}</option>
                  <option value="expense">{t("AddTran.expense")}</option>
                </Field>
                <ErrorMessage name="type" component="div" className="errorMessage" />
              </div>

              <div>
                <label className="label">{t("AddTran.category")} <span className="required">*</span></label>
                <Field name="categoryId" as="select" className="input">
                  <option value="" disabled>{t("AddTran.selectCategory")}</option>
                  {Cats.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                          {cat.name}
                      </option>
                  ))}
                </Field>
                <ErrorMessage name="categoryId" component="div" className="errorMessage" />
              </div>

              <div>
                <label className="label">{t("AddTran.unit")} <span className="required">*</span></label>
                <Field name="unit" as="select" className="input">
                  <option value="" disabled>{t("AddTran.selectUnit")}</option>
                      {units.map((un) => (
                          <option key={un} value={un}>
                              {un}
                          </option>
                      ))}
                </Field>
                <ErrorMessage name="unit" component="div" className="errorMessage" />
              </div>

              <div className="buttonContainer">
                <Button label={loading ? `${t("up")}...` : t("up")} type="submit" className="button" disabled={loading} />
              </div>
            </Form>
          )}
        </Formik>
      }
    </Dialog>
  );
}
