import moment from "moment";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dashboardDataRouter = createTRPCRouter({
  getData: publicProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        age: z.number().min(15, "Age Should be Greater than or equal to 15"),
        gender: z.enum(["male", "female"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      let { startDate, endDate } = input;
      const { age, gender } = input;

      startDate = moment(startDate).add(1, "days").startOf("day").toDate();
      endDate = moment(endDate).add(1, "days").startOf("day").toDate();

      const obj = {
        gte: 0,
        lte: 0,
      };

      if (age > 25) {
        obj.gte = 26;
        obj.lte = 100;
      } else {
        obj.gte = 15;
        obj.lte = 25;
      }

      if (startDate > endDate) {
        throw new Error("Start date cannot be after end date");
      }

      const data = await ctx.db.dashboard_data.aggregate({
        _sum: {
          a: true,
          b: true,
          c: true,
          d: true,
          e: true,
          f: true,
        },
        where: {
          day: {
            gte: startDate,
            lte: endDate,
          },
          age: obj,
          gender: gender,
        },
      });

      const detailed = await ctx.db.dashboard_data.findMany({
        where: {
          day: {
            gte: startDate,
            lte: endDate,
          },
          age: obj,
          gender: gender,
        },
        select: {
          day: true,
          a: true,
          b: true,
          c: true,
          d: true,
          e: true,
          f: true,
        },
      });

      const dates = [];
      const A = [];
      const B = [];
      const C = [];
      const D = [];
      const E = [];
      const F = [];

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      for (const i of detailed) {
        dates.push(i.day.getDate() + " " + months[i.day.getMonth()]);
        A.push(i.a);
        B.push(i.b);
        C.push(i.c);
        D.push(i.d);
        E.push(i.e);
        F.push(i.f);
      }

      return {
        data,
        dates,
        A,
        B,
        C,
        D,
        E,
        F,
      };
    }),
});
