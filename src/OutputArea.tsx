import { forwardRef, memo, useMemo, useState } from "react";
import CharInfo from "./CharInfo";

import type { JSX } from "react";
import type { 音韻地位結果 } from "./App";

interface Props {
	音韻地位結果: 音韻地位結果;
	字頭結果: string[];
	charsPerLine: number;
	charWidth: number;
}

export default memo(
	forwardRef<HTMLOutputElement, Props>(function OutputArea(
		{ 音韻地位結果, 字頭結果, charsPerLine, charWidth }: Props,
		ref,
	) {
		const [showCharInfo, setShowCharInfo] = useState(false);
		const [infoIndex, setInfoIndex] = useState(0);

		const { error, 各音韻地位 } = 音韻地位結果;

		const isQueried音韻地位 = useMemo<(描述: string) => boolean>(() => {
			const set = new Set(各音韻地位.map(地位 => 地位.描述));
			return set.has.bind(set);
		}, [各音韻地位]);

		if (error) {
			let message = String(error as Error);
			if (import.meta.env.DEV) {
				if (error instanceof Error && error.stack) {
					message += `\n${error.stack}`;
				}
			}
			return (
				<output id="errorArea" lang="en-x-code" ref={ref}>
					{message}
				</output>
			);
		}

		const onCharClicked = (i: number) => {
			if (infoIndex === i) {
				setShowCharInfo(x => !x);
			} else {
				setInfoIndex(i);
				setShowCharInfo(true);
			}
		};

		const lines: JSX.Element[][] = [];
		let chars: JSX.Element[] = [];
		字頭結果.forEach((字頭, i) => {
			if (!(i % charsPerLine)) {
				if (i) lines.push(chars);
				chars = [];
			}
			chars.push(
				<button key={字頭} className="char" onClick={() => onCharClicked(i)}>
					{字頭}
				</button>,
			);
		});
		lines.push(chars);

		return 字頭結果.length
			? (
				<output id="outputArea" ref={ref}>
					{lines.map((chars, order) => (
						<div key={order} className="line" style={{ order }}>
							{chars}
						</div>
					))}
					<CharInfo
						key={字頭結果[infoIndex]}
						show={showCharInfo}
						index={infoIndex}
						字頭={字頭結果[infoIndex]}
						isQueried音韻地位={isQueried音韻地位}
						charsPerLine={charsPerLine}
						charWidth={charWidth}
					/>
				</output>
			)
			: (
				<output id="outputArea" className="noResult" ref={ref}>
					無結果
				</output>
			);
	}),
);
