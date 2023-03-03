import connectToDatabase from "../../utils/db";
import Employee from "../../models/Employee";

export default async function handler(req, res) {
  const { method } = req;
  console.log(method);
  await connectToDatabase();
  switch (method) {
    case "GET":
      try {
        const { id } = req.query;
        const employee = await Employee.findById(id);
        res.status(200).json(employee);
      } catch (error) {
        res.status(400).json({ error: "server error" });
      }

      break;
    case "DELETE":
      try {
        const deletedEmployee = await Employee.findByIdAndRemove(req.body);
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      return res.status(400).json({ success: false });
  }
}
