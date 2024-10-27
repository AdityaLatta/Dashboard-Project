"use client";

import Link from "next/link";
import Button from "../_components/Button";
import { loginhandler } from "../actions/authActions";
import { useFormState } from "react-dom";
import FormInput from "../_components/FormInput";

const Page = () => {
	const [loginState, login] = useFormState(loginhandler, undefined);

	return (
		<section className="bg-gray-900">
			<div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
				<div className="w-full rounded-lg bg-gray-800 shadow sm:max-w-md md:mt-0 xl:p-0">
					<div className="space-y-4 p-6 sm:p-8 md:space-y-6">
						<h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
							Sign in to your account
						</h1>
						<form action={login} className="space-y-4 md:space-y-6">
							<FormInput
								type="email"
								placeholder="Email"
								name="email">
								Email
							</FormInput>
							{loginState?.errors?.email && (
								<p className="text-red-500 text-xs">
									{loginState.errors.email}
								</p>
							)}
							<FormInput
								type="password"
								placeholder="Password"
								name="password">
								Password
							</FormInput>
							{loginState?.errors?.password && (
								<p className="text-red-500 text-xs">
									{loginState.errors.password}
								</p>
							)}
							<Button type="submit">Login</Button>
							<p className="text-sm font-light text-gray-400">
								Don’t have an account yet?{" "}
								<Link
									href="/signup"
									className="font-medium hover:underline text-primary-500">
									Sign up
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Page;
