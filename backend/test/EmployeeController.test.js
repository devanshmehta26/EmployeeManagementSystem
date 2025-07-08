const request = require("supertest");
const {app,server} = require("../server");
const dotenv = require("dotenv");

dotenv.config();

describe("EmployeeController Test", () => {
  let cookie;

  const userData = {
    name: "Jest",
    email: `jest${Date.now()}@gmail.com`,
    designation: "Developer",
    salary: 1000000,
    password: "Jest@123",
  };

  test("should register a new employee", async () => {
    const res = await request(app)
      .post("/api/employees/register")
      .send(userData);
    expect(res.body).toHaveProperty("employee");
    expect(res.body.employee).toHaveProperty("id");
    expect(res.statusCode).toBe(201);
    cookie = res.headers["set-cookie"];
  });

  test("should login successfully", async () => {
    const res = await request(app)
      .post("/api/employees/login")
      .send({ email: userData.email, password: userData.password });
    expect(res.body).toHaveProperty("message", "Login successful");
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.statusCode).toBe(200);
    cookie = res.headers["set-cookie"];
  });

  test("should get all employees", async () => {
    const res = await request(app).get("/api/employees").set("Cookie", cookie);
    expect(Array.isArray(res.body.employees)).toBe(true);
    expect(res.statusCode).toBe(200);
  });
  
  test("should decline access without a valid cookie", async () => {
    const res = await request(app).post("/api/employees/user");
    expect(res.body.message).toBe("Unauthorized");
    expect(res.statusCode).toBe(401);
  });

  test("should return the current user", async () => {
    const res = await request(app)
      .post("/api/employees/user")
      .set("Cookie", cookie);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", userData.email);
    expect(res.statusCode).toBe(200);
  });

  test("should return profile", async () => {
    const res = await request(app)
      .get("/api/employees/profile")
      .set("Cookie", cookie);
    expect(res.body).toHaveProperty("email", userData.email);
    expect(res.statusCode).toBe(200);
  });
  

  test("should update the employee", async () => {
    const res = await request(app)
      .put("/api/employees/updateUser")
      .set("Cookie", cookie)
      .send({ designation: "Software Developer" });
    expect(res.body).toHaveProperty("employee");
    expect(res.body.employee.designation).toBe("Software Developer");
    expect(res.statusCode).toBe(200);
  });

  
  test("should delete the employee", async () => {
    const res = await request(app)
      .delete("/api/employees/deleteUser")
      .set("Cookie", cookie);
    expect(res.body).toHaveProperty("message", "Employee deleted successfully");
    expect(res.statusCode).toBe(200);
  });

  test("should logout the employee", async () => {
    const res = await request(app)
      .post("/api/employees/logout")
      .set("Cookie", cookie);
    expect(res.body.message).toBe("Logout successful");
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.statusCode).toBe(200);
  });

});

afterAll((done) => {
  server.close(() => {
    done();
  });
});