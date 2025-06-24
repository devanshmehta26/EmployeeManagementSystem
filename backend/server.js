const express= require("express");
const dotenv=require("dotenv");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app=express();
const employeeRoutes=require("./routes/EmployeeRoutes")
const errorHandler=require('./middleware/ErrorHandler')

dotenv.config();

const PORT=process.env.PORT || 3000;
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true               
}));

app.use(express.json());
app.use("/api/employees", employeeRoutes);
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`listening on port number ${PORT}`);
})