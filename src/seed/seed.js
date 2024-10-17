// import fs from "fs";
// import csv from "csv-parser";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// // type Result = {
// //   day: Date;
// //   age: number;
// //   gender: string;
// //   a: number;
// //   b: number;
// //   c: number;
// //   d: number;
// //   e: number;
// //   f: number;
// // };

// const results = [];

// fs.createReadStream("./data.csv")
//   .pipe(csv())
//   .on("data", (data) => {
//     if (data.Age === ">25") {
//       data.Age = Math.floor(Math.random() * 26) + 25;
//     } else {
//       data.Age = Math.floor(Math.random() * 11) + 15;
//     }

//     data.Gender = data.Gender.toLowerCase();

//     data.Day = new Date(data.Day.split("/").reverse().join("-"));

//     console.log(data);

//     results.push({
//       day: data.Day,
//       age: data.Age,
//       gender: data.Gender,
//       a: Number(data.A),
//       b: Number(data.B),
//       c: Number(data.C),
//       d: Number(data.D),
//       e: Number(data.E),
//       f: Number(data.F),
//     });
//   })
//   .on("end", async () => {
//     await prisma.dashboard_data.createMany({
//       data: [...results],
//     });
//     console.log("success");
//   });
