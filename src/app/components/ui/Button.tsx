// TODO: Reference below and fix custom <Button> to fit company needs

import type { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

const Button: FC<ButtonProps> = ({ children, ...props }) => (
	<button
		className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
		{...props}
	>
		{children}
	</button>
);

export default Button;
