const express=require("express");
const router=express.Router();
const authenticate=require("../middleware/authenticate")
const {getAllEmployees, register, updateUser, deleteUser, login, logout, getCurrentUser, getUserProfile} = require("../controllers/EmployeeController")  

router.post("/register",register)
router.post("/login",login)

router.get("/",authenticate,getAllEmployees);
router.post("/user",authenticate,getCurrentUser)
router.get("/profile",authenticate,getUserProfile)
router.put("/updateUser",authenticate,updateUser)
router.delete("/deleteUser",authenticate,deleteUser)

router.post("/logout",authenticate,logout)

module.exports=router;