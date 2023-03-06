import { 資料 } from "qieyun";
import { forwardRef, memo, useMemo, useRef } from "react";
import CharInfo from "./CharInfo";
import { cmp, iter描述, 常見字頻序, 查詢方式, 查詢音韻地位, 顯示哪些字 } from "./utils";

export default memo(
	forwardRef<
		HTMLOutputElement,
		{
			查詢方式: 查詢方式;
			用户輸入: string;
			setInvalid: (invalid: boolean) => void;
			顯示哪些字: 顯示哪些字;
			charsPerLine: number;
			charWidth: number;
			copy字頭: { current: string };
		}
	>(function OutputArea({ 查詢方式, 用户輸入, setInvalid, 顯示哪些字, charsPerLine, charWidth, copy字頭 }, ref) {
		const toggleCharInfo = useRef<(i: number) => void>();

		try {
			const 音韻地位們 = useMemo(() => 查詢音韻地位[查詢方式](用户輸入), [查詢方式, 用户輸入]);
			const 字頭們 = useMemo(() => {
				const 結果 = new Set<string>();
				for (const 音韻地位 of 音韻地位們) {
					const 條目 = 資料.query音韻地位(音韻地位);
					if (顯示哪些字 === "一個音韻地位只顯示一個代表字" && 條目.length) {
						結果.add(條目[0].字頭);
					} else {
						for (const { 字頭 } of 條目) {
							if (顯示哪些字 === "顯示所有字" || 常見字頻序.has(字頭)) {
								結果.add(字頭);
							}
						}
					}
				}
				return [...結果].sort(cmp);
			}, [查詢方式, 用户輸入, 顯示哪些字]);

			setInvalid(false);
			const lines: JSX.Element[][] = [];
			let chars: JSX.Element[] = [];
			copy字頭.current = 字頭們.join("");
			字頭們.forEach((字頭, i) => {
				if (!(i % charsPerLine)) {
					if (i) lines.push(chars);
					chars = [];
				}
				chars.push(
					<button key={字頭} className="char" onClick={() => toggleCharInfo.current?.(i)}>
						{字頭}
					</button>
				);
			});
			lines.push(chars);
			return (
				<output id="outputArea" ref={ref}>
					{lines.map((chars, order) => (
						<div key={order} className="line" style={{ order }}>
							{chars}
						</div>
					))}
					<CharInfo
						key={copy字頭.current}
						字頭們={字頭們}
						描述們={new Set(iter描述(音韻地位們))}
						charsPerLine={charsPerLine}
						charWidth={charWidth}
						toggleCharInfo={toggleCharInfo}
					/>
				</output>
			);
		} catch (err) {
			setInvalid(true);
			return <output id="errorArea" lang="en-x-code" ref={ref}>{`${err}\n${(err as Error).stack}`}</output>;
		}
	})
);
