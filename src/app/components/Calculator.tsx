"use client";
import { useState } from "react";

export default function Calculator() {
	const [number, setNumber] = useState<number>(0);
	const [result, setResult] = useState<string>("D");
	const [randomNumber, setRandonNumber] = useState<number>(0);

	// State to store the user input
	const [inputValue, setInputValue] = useState<string>("");

	// Handler to update the state when the input changes
	const handleInputChange = (e: any) => {
		setInputValue(e.target.value);
		console.log(inputValue);
	};

	const calculateScore = () => {
		const parsedValue = Number(inputValue);
		if (parsedValue > 90) {
			setResult("A");
		} else if (parsedValue > 80) {
			setResult("B");
		}
		console.log(result);
	};

	return (
		<div className="w-96 h-64 bg-slate-100 text-black">
			<p>put your score:</p>
			<input
				type="text"
				placeholder="Your WAM"
				value={inputValue} // Controlled input
				onChange={handleInputChange} // Update state on change
			/>
			<button onClick={calculateScore}>calculate!</button>
			<div className="w-96 h-64 bg-amber-600">{Math.random()}</div>
		</div>
	);
}
