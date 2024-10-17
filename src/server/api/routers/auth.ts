import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { SignJWT, jwtVerify } from "jose";
import { hash, compare } from "bcrypt";
import { cookies } from "next/headers";
import { env } from "~/env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({ name: z.string(), email: z.string(), password: z.string() }),
    )
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;

      if (!name || !email || !password) {
        throw new Error("Please provide all the required fields");
      }

      if (password.length < 8) {
        throw new Error("Password should be at least 8 characters long");
      }

      const existingUser = await ctx.db.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await hash(password, 10);

      const user = await ctx.db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      if (!user) {
        throw new Error("Something went wrong");
      }

      const token = await new SignJWT({
        id: user.id,
        name: user.name,
        email: user.email,
      })
        .setProtectedHeader({
          alg: "HS256",
        })
        .sign(secret);

      cookies().set("token", token, {
        path: "/",
        sameSite: "strict",
        secure: true,
        httpOnly: true,
        maxAge: 60 * 60 * 60 * 24 * 7,
      });

      return {
        success: true,
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      if (!email || !password) {
        throw new Error("Please provide all the required fields");
      }

      const user = await ctx.db.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const passwordMatch = await compare(password, user.password);

      if (!passwordMatch) {
        throw new Error("Invalid email or password");
      }

      const token = await new SignJWT({
        id: user.id,
        name: user.name,
        email: user.email,
      })
        .setProtectedHeader({
          alg: "HS256",
        })
        .sign(secret);

      cookies().set("token", token, {
        path: "/",
        sameSite: "strict",
        secure: true,
        httpOnly: true,
        maxAge: 60 * 60 * 60 * 24 * 7,
      });

      return {
        success: true,
      };
    }),

  logout: publicProcedure.mutation(() => {
    cookies().delete("token");

    return {
      success: true,
    };
  }),

  me: publicProcedure.query(async ({ ctx }) => {
    const token = cookies().get("token")?.value;

    if (!token) {
      return null;
    }

    try {
      const { payload }: any = await jwtVerify(token, secret);

      const user = await ctx.db.user.findUnique({
        where: {
          id: payload.id,
        },
        select: {
          name: true,
          email: true,
        },
      });

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }),
});
