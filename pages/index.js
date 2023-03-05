import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import tableStyle from "../styles/table.module.css";
import formStyles from "../styles/form.module.css";
import { Alert } from "@mui/material";
import Loading from "../components/loading";
import { Button, DialogContent, DialogTitle, Dialog } from "@mui/material";

function HomePage() {
  const [isLoading, setLoading] = useState(false);

  const [age, setAge] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [employees, setEmployees] = useState([]);

  const handleClickOpen = () => {
    const bday = new Date(Date.parse("1990-01-01"));
    const now = Date.parse(new Date().toISOString());

    const diff_ms = now - bday;
    const ageInYears = diff_ms / (1000 * 60 * 60 * 24 * 365);

    setAge(Math.floor(ageInYears));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        console.log(employees);
        setLoading(false);
      });
  }, []);

  function calculate_age(event) {
    const bday = new Date(Date.parse(event.target.value));
    const now = Date.parse(new Date().toISOString());

    const diff_ms = now - bday;
    const ageInYears = diff_ms / (1000 * 60 * 60 * 24 * 365);

    setAge(Math.floor(ageInYears));
  }

  function handleSubmit(event) {
    event.preventDefault();

    setOpen(false);
    const formData = {
      firstName: firstName.value,
      lastName: lastName.value,
      birthDay: new Date(bDate.value).toISOString(),
      age: newAge.value,
    };
    console.log(formData);
    fetch("/api/addEmployee", {
      method: "POST",
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
        setEmployees([...employees, formData]);
        console.log(employees);
        setAlertMessage("Employee Updated");
        setSeverity("success");
        setShowAlert(true);
      })
      .catch((error) => {
        setAlertMessage("Something Went Wrong");
        setSeverity("error");
        setShowAlert(true);
        console.error("Error:", error);
      });
  }
  function handleDelete(employeeId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (confirmDelete) {
      fetch("/api/${id}", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeId),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const row = document.getElementById(employeeId);
          row.remove();
          setAlertMessage("Employee Updated");
          setSeverity("success");
          setShowAlert(true);
        })
        .catch((error) => {
          setAlertMessage("Something Went Wrong");
          setSeverity("error");
          setShowAlert(true);
          console.error("Error:", error);
        });
    }
  }
  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (!employees) return <div>No data found</div>;
  return (
    <Layout>
      <h1>Employees</h1>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add an employee
      </Button>
      <table className={`${tableStyle.borders} ${tableStyle.employeeTable}`}>
        <thead>
          <tr className={tableStyle.borders}>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Birth Day</th>
            <th>Age</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index} className={tableStyle.borders} id={employee._id}>
              <td className={`${tableStyle.borders} ${tableStyle.px3}`}>
                {employee.firstName}
              </td>
              <td className={`${tableStyle.borders} ${tableStyle.px3}`}>
                {employee.lastName}
              </td>
              <td className={`${tableStyle.borders} ${tableStyle.px3}`}>
                {employee.birthDay.split("T")[0]}
              </td>
              <td className={`${tableStyle.borders} ${tableStyle.px3}`}>
                {employee.age}
              </td>
              <td className={tableStyle.borders}>
                <button>
                  <Link className={tableStyle.mx} href={`/${employee._id}`}>
                    EDIT
                  </Link>
                </button>
                <button
                  onClick={() => {
                    handleDelete(employee._id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add an Employee</DialogTitle>
          <div className={utilStyles.flexCenter}>
            <DialogContent>
              <form
                onSubmit={handleSubmit}
                method="post"
                className={formStyles.form}
              >
                <label htmlFor="firstName">First Name</label>
                <input
                  className={formStyles.fields}
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  minLength="2"
                  maxLength="10"
                  placeholder="2-10 char"
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
                  placeholder="2-10 char"
                />
                <label htmlFor="birthDay">Birth Day</label>
                <input
                  type="date"
                  className={formStyles.fields}
                  name="bDate"
                  id="bDate"
                  required
                  defaultValue="1990-01-01"
                  min="1923-01-01"
                  max="2005-01-01"
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
                <Button onClick={handleClose}>Close</Button>
                <Button type="submit">Submit</Button>
              </form>
            </DialogContent>
          </div>
        </Dialog>
      </div>
      {showAlert && (
        <div className="alert">
          <Alert severity={severity}>{alertMessage}</Alert>
          <button onClick={() => setShowAlert(false)}>Close</button>
        </div>
      )}
    </Layout>
  );
}
export default HomePage;
