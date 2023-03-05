import Layout from "../components/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import formStyles from "../styles/form.module.css";
import utilStyles from "../styles/utils.module.css";
import { Alert } from "@mui/material";
import Link from "next/link";

function editEmployee() {
  const [data, setData] = useState(null);
  const [birthDay, setBirthDay] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [age, setAge] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [severity, setSeverity] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const { id } = router.query;
    console.log(id);
    setLoading(true);
    fetch(`/api/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        const bday = Date.parse(new Date(data.birthDay));
        console.log(bday);
        const now = Date.parse(new Date().toISOString());

        const diff_ms = now - bday;
        const ageInYears = diff_ms / (1000 * 60 * 60 * 24 * 365);

        setAge(Math.floor(ageInYears));
        const bdate = new Date(data.birthDay);
        const options = {
          timeZone: "Asia/Manila",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        };

        setBirthDay(
          bdate.toLocaleString("en-PH", options).split("/").reverse().join("-")
        );
        console.log(birthDay);
        setLoading(false);
      });
  }, [router.isReady]);

  const { query, isReady } = useRouter();

  if (!isReady) {
    return <div>...Loading</div>;
  }

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Failed to load</div>;

  function calculate_age(event) {
    const bday = new Date(Date.parse(event.target.value));
    const now = Date.parse(new Date().toISOString());

    const diff_ms = now - bday;
    const ageInYears = diff_ms / (1000 * 60 * 60 * 24 * 365);

    setAge(Math.floor(ageInYears));
  }
  function handleSubmit(event) {
    event.preventDefault();
    const formData = {
      id: id.value,
      firstName: firstName.value,
      lastName: lastName.value,
      birthDay: new Date(bDate.value).toISOString(),
      age: newAge.value,
    };
    console.log(formData);
    fetch("/api/updateEmployee", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAlertMessage("Employee Updated");
        setSeverity("success");
        setShowAlert(true);
      })
      .catch((error) => {
        setAlertMessage("Something Went Wrong");
        setSeverity("danger");
        setShowAlert(true);
        console.error("Error:", error);
      });
  }

  return (
    <Layout>
      <h1>Edit Employee</h1>
      <div className={utilStyles.flexCenter}>
        <form onSubmit={handleSubmit} method="post" className={formStyles.form}>
          <label htmlFor="id">Employee Id</label>
          <input
            className={formStyles.fields}
            type="text"
            id="id"
            name="id"
            readOnly
            defaultValue={data._id}
          />
          <label htmlFor="firstName">First Name</label>
          <input
            className={formStyles.fields}
            type="text"
            id="firstName"
            name="firstName"
            required
            minLength="2"
            maxLength="10"
            placeholder={data.firstName}
            defaultValue={data.firstName}
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            className={formStyles.fields}
            type="text"
            id="lastName"
            name="lastName"
            required
            minLength="2"
            maxLength="10"
            placeholder={data.lastName}
            defaultValue={data.lastName}
          />
          <label htmlFor="birthDay">Birth Day</label>
          <input
            className={formStyles.fields}
            type="date"
            id="bDate"
            name="bDate"
            required
            defaultValue={birthDay}
            onChange={calculate_age}
          />
          <label htmlFor="age">Age</label>
          <input
            name="newAge"
            id="newAge"
            type="number"
            readOnly
            value={age}
            className={formStyles.fields}
          />

          <button type="submit">Submit</button>
        </form>
      </div>
      {showAlert && (
        <div className="alert">
          <Alert severity={severity}>{alertMessage}</Alert>
          <button>
            <Link href="/">Go Back</Link>
          </button>
          <button onClick={() => setShowAlert(false)}>Close</button>
        </div>
      )}
    </Layout>
  );
}
export default editEmployee;
