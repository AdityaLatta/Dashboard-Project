"use client";

import React from "react";
import { logouthandler } from "../actions/authActions";

const Logout = () => {
	const dialog = React.useRef<HTMLDialogElement>(null);
	return (
		<>
			<button
				onClick={() => dialog.current?.showModal()}
				className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-600 duration-700 hover:translate-x-2 lg:w-[90%] lg:justify-between lg:rounded-s-full lg:pl-1 lg:pr-5">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800">
					AL
				</div>
				<div className="hidden lg:block">Log-Out</div>
			</button>
			<dialog
				ref={dialog}
				className="rounded-lg p-4 shadow-lg backdrop:bg-black backdrop:opacity-65">
				<p>Are you sure you want to log out?</p>
				<div className="w-full text-right mt-3 flex justify-end gap-4">
					<button onClick={() => dialog.current?.close()}>
						Close
					</button>

					<form action={logouthandler}>
						<button type="submit">Logout</button>
					</form>
				</div>
			</dialog>
		</>
	);
};

export default Logout;
