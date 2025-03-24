"use client";
import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import { Chau_Philomene_One } from "next/font/google";
import { Play, Pause, RotateCcw } from "lucide-react";
const chauPhilomeneOne = Chau_Philomene_One({
	weight: "400", // Chau Philomene One only has a single weight (400)
	subsets: ["latin"],
});

function Pomodoro() {
	const focusTime: number = 25 * 60;
	const breakTime: number = 5 * 60;
	const [time, setTime] = useState<number>(focusTime);
	const [isFocus, setIsFocus] = useState<boolean>(true);
	const [showReset, isShowReset] = useState<boolean>(false);
	const [isRunning, setIsRunning] = useState<boolean>(false);

	const sound = new Howl({ src: ["/sounds/lebron.mp3"] });

	useEffect(() => {
		let timer: NodeJS.Timeout | null = null;

		if (isRunning && time > 0) {
			isShowReset(true);
			timer = setInterval(() => {
				setTime((prevTime) => prevTime - 1);
			}, 1000);
			sound.pause();
		} else if (time === 0) {
			sound.play(); // Play sound when timer reaches 0
			setIsFocus((prev) => !prev);
			setTime(isFocus ? breakTime : focusTime);
		}

		return () => {
			if (timer) clearInterval(timer);
		};
	}, [isRunning, time, isFocus]);

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const handleReset = () => {
		setIsRunning(false); // Stop the timer when resetting
		isShowReset(false);
		sound.pause();
		setTime(isFocus ? focusTime : breakTime); // Reset to the current mode's initial time
	};

	return (
		<main
			className={`${chauPhilomeneOne.className} ${
				isFocus ? "bg-white text-black" : "bg-black text-white"
			}`}
		>
			<div className="flex justify-center items-center h-screen text-center">
				<div>
					<h1 className="text-2xl">{isFocus ? "Focus Time" : "Break Time"}</h1>
					<h2 className="text-[130px] tracking-widest">{formatTime(time)}</h2>
					<button
						className={`mt-4 px-6 py-3 ${
							isFocus ? "bg-black" : "bg-white"
						} rounded-xl mr-2 cursor-pointer`}
						onClick={() => setIsRunning((prev) => !prev)}
					>
						{isRunning ? (
							<Pause color={isFocus ? "white" : "black"} size={25} />
						) : (
							<Play color={isFocus ? "white" : "black"} size={25} />
						)}
					</button>
					<button
						className={`mt-4 px-6 py-3 bg-blue-400 text-white rounded-xl cursor-pointer ${
							showReset ? "" : "hidden"
						}`}
						onClick={handleReset}
					>
						<RotateCcw />
					</button>
				</div>
			</div>
		</main>
	);
}

export default Pomodoro;
