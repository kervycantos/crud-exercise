import Employee from "../../models/Employee";
import connectToDatabase from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDatabase();

      const { firstName, lastName, birthDay, age } = req.body;

      const employee = new Employee({
        firstName,
        lastName,
        birthDay,
        age,
      });

      await employee.save();

      return res.status(201).json({ success: true, data: employee });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: "Server Error" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
