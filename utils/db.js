import mongoose from "mongoose";
const { DATABASE_URI } = process.env;

const connectToDatabase = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export default connectToDatabase;
