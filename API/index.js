import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./Routes/userRoute.js";
import listingRouter from "./Routes/listingRoute.js";
import cookieParser from "cookie-parser";
import path from 'path'
dotenv.config();

const app = express();

try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDb is connected succesfully");
} catch (error) {
  console.log("error occured during Mongodb connection");
  
}

const __dirname=path.resolve()

app.use(cookieParser())
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname,'/client/dist')))
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'client','dist','index.html'))
})

app.use((err, req, res, next) => {
  const statuscode = err.statuscode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});

app.listen(8800, () => {
  console.log("server is running on port 8800");
});