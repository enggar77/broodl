"use client";
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useState, useEffect } from "react";

const AuthContext = React.createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null);
	const [userDataObj, setUserDataObj] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// AUTH HANDLERS
	function signup(email, password) {
		return createUserWithEmailAndPassword(auth, email, password);
	}

	async function login(email, password) {
		try {
			setError(null);
			await signInWithEmailAndPassword(auth, email, password);
		} catch (err) {
			setError("An error occurred. Please try again.");
			console.error(err.message);
		}
	}

	function logout() {
		setUserDataObj(null);
		setCurrentUser(null);
		return signOut(auth);
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			try {
				// Set the user to our local context state
				setLoading(true);
				setCurrentUser(user);
				if (!user) {
					console.log("No User Found");
					return;
				}

				// if user exists, fetch data from firestore database
				console.log("Fetching User Data");
				const docRef = doc(db, "users", user.uid);
				const docSnap = await getDoc(docRef);
				let firebaseData = {};
				if (docSnap.exists()) {
					console.log("Found User Data");
					firebaseData = docSnap.data();
				}
				setUserDataObj(firebaseData);
			} catch (err) {
				console.log(err.message);
			} finally {
				setLoading(false);
			}
		});
		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		userDataObj,
		setUserDataObj,
		signup,
		logout,
		login,
		loading,
		error,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
