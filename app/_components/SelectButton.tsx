import React from "react";

const SelectButton = ({
	children,
	name,
	value,
	checked,
	onChange,
}: {
	children: React.ReactNode;
	name: string;
	value: string | number;
	checked: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	return (
		<div className="flex gap-2">
			<input
				type="radio"
				id={name + value}
				name={name}
				value={value}
				checked={checked}
				onChange={onChange}
			/>
			<label htmlFor={name + value}>{children}</label>
		</div>
	);
};

export default SelectButton;
