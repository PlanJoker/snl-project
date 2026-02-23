// TODO: Reference below and fix custom <input> to fit company needs

import type { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
}

const Input: FC<InputProps> = ({ label, ...props }) => (
	<div className="mb-4">
		{label && (
			<label className="block text-sm font-medium text-gray-700">{label}</label>
		)}
		<input
			className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
			{...props}
		/>
	</div>
);

export default Input;
