import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const ConnectDBInstance = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log(
      "N -CONNECTED TO MONGOdB FROM INDEXdb",
      ConnectDBInstance.connection.host
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
