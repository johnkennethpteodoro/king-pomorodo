"use client";
import React, { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { Chau_Philomene_One } from "next/font/google";
import { Play, Pause, RotateCcw, Crown } from "lucide-react";

const chauPhilomeneOne = Chau_Philomene_One({
	weight: "400",
	subsets: ["latin"],
});

function Pomodoro() {
	const focusTime: number = 25 * 60;
	const breakTime: number = 5 * 60;
	const [time, setTime] = useState<number>(focusTime);
	const [isFocus, setIsFocus] = useState<boolean>(true);
	const [showReset, isShowReset] = useState<boolean>(false);
	const [isRunning, setIsRunning] = useState<boolean>(false);

	const sound = useRef<Howl | null>(null);

	useEffect(() => {
		sound.current = new Howl({ src: ["/sounds/lebron.mp3"] });
	}, []);

	useEffect(() => {
		let timer: NodeJS.Timeout | null = null;

		if (isRunning && time > 0) {
			isShowReset(true);
			timer = setInterval(() => {
				setTime((prevTime) => prevTime - 1);
			}, 1000);
		} else if (time === 0) {
			sound.current?.play(); // Play sound when timer reaches 0
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
		setIsRunning(false);
		setIsFocus(true);
		isShowReset(false);
		sound.current?.pause();
		setTime(focusTime);
	};

	return (
		<main
			className={`${chauPhilomeneOne.className} ${
				isFocus ? "bg-white text-black" : "bg-black text-white"
			}`}
		>
			<div className="flex justify-center items-center h-screen text-center">
				<div>
					<div className="relative">
						<Crown
							color="orange"
							size={25}
							className="absolute left-[106px] -top-[8px] -rotate-45"
						/>
						<h1 className="text-[25px] text-center mb-[30px]">King Pomorodo</h1>
					</div>

					<h1 className={`text-[20px] ${isFocus ? "text-green-500" : "text-red-400"}`}>
						{isFocus ? "Focus Time" : "Break Time"}
					</h1>
					<h2 className="text-[130px] tracking-widest w-[400px]">{formatTime(time)}</h2>
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
						className={`mt-4 px-6 py-3 bg-zinc-400 text-white rounded-xl cursor-pointer ${
							showReset ? "" : "hidden"
						}`}
						onClick={handleReset}
					>
						<RotateCcw size={25} />
					</button>
				</div>
			</div>
		</main>
	);
}

export default Pomodoro;
