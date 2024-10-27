import React from "react";
import { BarLoader } from "react-spinners";

const Loader = () => {
	return (
		<div className="w-screen h-screen flex items-center bg-gray-800 justify-center">
			<BarLoader color="#1A5ED4" width={200} />
		</div>
	);
};

export default Loader;
