import React from "react";

const FormInput = ({
	children,
	type,
	placeholder,
	name,
}: {
	children: React.ReactNode;
	type: string;
	placeholder: string;
	name: string;
}) => {
	return (
		<div>
			<label
				htmlFor="email"
				className="mb-2 block text-sm font-medium text-white">
				{children}
			</label>
			<input
				type={type}
				name={name}
				id={type}
				className="block w-full rounded-lg border p-2.5 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
				placeholder={placeholder}
				required={true}
			/>
		</div>
	);
};

export default FormInput;
