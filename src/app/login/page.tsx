"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import Button from "../_components/button";
import Input from "../_components/input";

const Login = () => {
  const router = useRouter();

  const {
    mutate: login,
    data,
    isPending,
    isSuccess,
  } = api.auth.login.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    login({ email, password });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Logged in successfully");
      router.push("/dashboard");
    }
  }, [isSuccess, data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
          <div className="w-full rounded-lg bg-gray-800 shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <Input
                  type="email"
                  placeholder="Enter Your Email"
                  label="Email"
                  name="email"
                />
                <Input
                  type="password"
                  placeholder="Enter Your Password"
                  label="Password"
                  name="password"
                />

                <Button
                  type="submit"
                  label={isPending ? "Loading..." : "Sign in"}
                />
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <a
                    href="/signup"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
