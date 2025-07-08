const express= require("express");
const dotenv=require("dotenv");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app=express();
const employeeRoutes=require("./routes/EmployeeRoutes")
const errorHandler=require('./middleware/ErrorHandler')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

dotenv.config();

const PORT=process.env.PORT || 3000;
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true               
}));

app.use(express.json());
app.use('/api-documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/employees", employeeRoutes);
app.use(errorHandler);

const server=app.listen(PORT,()=>{
    console.log(`listening on port number ${PORT}`);
})

module.exports = {app,server};