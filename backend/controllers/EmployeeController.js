const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");

dotenv.config();

const sendAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};


exports.register = async (req, res, next) => {
  try {
    const { name, email, designation, salary, password } = req.body;

    if (!name || !email || !designation || !salary || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmployee = await prisma.employee.findUnique({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await prisma.employee.create({
      data: {
        name,
        email,
        designation,
        salary: Number(salary),
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { id: newEmployee.id, email: newEmployee.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    sendAuthCookie(res, token);

    return res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordValid = await bcrypt.compare(password, employee.password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: employee.id, email: employee.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    sendAuthCookie(res, token); 

    return res.json({
      message: "Login successful",
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        designation: employee.designation,
        salary: employee.salary,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  clearAuthCookie(res);
  return res.json({ message: "Logout successful" });
};


exports.getAllEmployees = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, search } = req.query;
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (isNaN(parsedPage) || isNaN(parsedLimit) || parsedPage < 1 || parsedLimit < 1) {
      return res.status(400).json({ message: "Invalid page or limit parameters" });
    }

    const filters = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { designation: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const totalEmployees = await prisma.employee.count({ where: filters });
    const employees = await prisma.employee.findMany({
      where: filters,
      take: parsedLimit,
      skip: (parsedPage - 1) * parsedLimit,
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        salary: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      page: parsedPage,
      limit: parsedLimit,
      totalEmployees,
      noOfPages: Math.ceil(totalEmployees / parsedLimit),
      employees,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const id = Number(req.user.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid employee ID provided by token" });
    }
    const employee = await prisma.employee.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        salary: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    return res.json(employee);
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ id: payload.id, email: payload.email });
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};



exports.updateUser = async (req, res, next) => {
  try {
    const id = Number(req.user.id);
    const { name, designation, salary, password } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid employee ID provided by token" });
    }

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    let hashedPassword = undefined;
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {...(name && { name }),...(designation && { designation }),...(salary !== undefined && { salary: Number(salary) }),...(hashedPassword && { password: hashedPassword }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        salary: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteUser = async (req, res, next) => {
  try {
    const id = Number(req.user.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid employee ID provided by token" });
    }

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await prisma.employee.delete({ where: { id } });

    clearAuthCookie(res);[]

    return res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    next(error);
  }
};