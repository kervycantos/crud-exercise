import connectToDatabase from "../../utils/db";
import Employee from "../../models/Employee";

export default async function handler(req, res) {
  await connectToDatabase();

  try {
    const employees = await Employee.find({});
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ error: "server error" });
  }
}
