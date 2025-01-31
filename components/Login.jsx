"use client";

import { Fugaz_One } from "next/font/google";
import React, { useState } from "react";
import Button from "./Button";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function Login() {
	const [isRegister, setIsRegister] = useState(false);
	const { signup, login, error } = useAuth();

	const signUpSchema = z
		.object({
			email: z.string().nonempty("Email is required").email(),
			password: z.string().nonempty("Password is required").min(8, "Password must be at least 8 characters"),
			confirmPassword: z.string().nonempty("Confirm password is required"),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Passwords must match",
			path: ["confirmPassword"],
		});

	const signInSchema = z.object({
		email: z.string().nonempty("Email is required").email(),
		password: z.string().nonempty("Password is required"),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		resolver: zodResolver(isRegister ? signUpSchema : signInSchema),
	});

	const onSubmit = async (data) => {
		try {
			if (isRegister) {
				await signup(data.email, data.password);
			} else {
				await login(data.email, data.password);
			}
			reset();
		} catch (error) {
			console.error("Authentication error:", error);
		}
	};

	return (
		<div className="flex flex-col flex-1 justify-center items-center gap-4">
			<h3 className={"text-4xl sm:text-5xl md:text-6xl " + fugaz.className}>
				{isRegister ? "Register" : "Log In"}
			</h3>
			{isRegister ? <p>You&#39;re one step away!</p> : <p>Welcome back!</p>}
			<div className="mx-auto max-w-[400px] w-full">
				<input
					className="w-full px-5 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
					placeholder="Email"
					type="email"
					{...register("email")}
				/>
				{errors.email && <p className="text-red-500 text-xs pl-5 mt-1">{errors.email.message}</p>}
			</div>
			<div className="mx-auto max-w-[400px] w-full">
				<input
					className="w-full max-w-[400px] mx-auto px-5 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
					placeholder="Password"
					type="password"
					{...register("password")}
				/>
				{errors.password && <p className="text-red-500 text-xs pl-5 mt-1">{errors.password.message}</p>}
				{error && <p className="text-red-500 text-xs pl-5 mt-1">{error}</p>}
			</div>
			{isRegister && (
				<div className="mx-auto max-w-[400px] w-full">
					<input
						className="w-full max-w-[400px] mx-auto px-5 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
						placeholder="Confirm Password"
						type="password"
						{...register("confirmPassword")}
					/>
					{errors.confirmPassword && (
						<p className="text-red-500 text-xs pl-5 mt-1">{errors.confirmPassword.message}</p>
					)}
				</div>
			)}
			<div className="max-w-[400px] w-full mx-auto">
				<Button
					clickHandler={handleSubmit(onSubmit)}
					text={isSubmitting ? "Submitting..." : "Submit"}
					full
					isSubmitting={isSubmitting}
				/>
			</div>
			<p className="text-center">
				{isRegister ? "Already have an account? " : "Don't have an account? "}
				<button onClick={() => setIsRegister(!isRegister)} className="text-indigo-600 underline cursor-pointer">
					{isRegister ? "Sign in" : "Sign up"}
				</button>
			</p>
		</div>
	);
}
