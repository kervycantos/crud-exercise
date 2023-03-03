import connectToDatabase from "../../utils/db";
import Employee from "../../models/Employee";

export default async function handler(req, res) {
  await connectToDatabase();
  try {
    const { id, firstName, lastName, birthDay, age } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      id,
      { firstName, lastName, birthDay, age },
      { new: true }
    );
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
