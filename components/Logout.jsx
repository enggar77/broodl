"use client";
import React from "react";
import Button from "./Button";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Logout() {
	const { logout, currentUser } = useAuth();
	const pathname = usePathname();

	if (!currentUser || pathname !== "/dashboard") {
		return null;
	}

	return <Button text="Logout" clickHandler={logout} />;
}
