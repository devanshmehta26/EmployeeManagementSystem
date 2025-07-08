import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
 
async function main() {
  const employees = [
    {
      name: "SeedTest",
      email: "seedtest@gmail.com",
      designation: "Software Engineer",
      salary: 1000000,
      password: "SeedTest@123",
    },
  ];
 
  for (const emp of employees) {
    const hashedPassword = await bcrypt.hash(emp.password, 10);
    await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        name: emp.name,
        email: emp.email,
        designation: emp.designation,
        salary: emp.salary,
        password: hashedPassword,
      },
    });
  }
  console.log("Employee Created Successfully");
}
 
main()
  .catch((e) => {
    console.error("Error while creating the employee", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });