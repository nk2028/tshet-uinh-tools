import { useMemo, useState } from "react";
import { 資料 } from "tshet-uinh";

interface Props {
	show: boolean;
	index: number;
	字頭: string;
	isQueried音韻地位: (描述: string) => boolean;
	charsPerLine: number;
	charWidth: number;
}

export default function CharInfo({ show, index, 字頭, isQueried音韻地位, charsPerLine, charWidth }: Props) {
	const [tabIndex, setTabIndex] = useState(0);

	const 條目結果originalOrder = useMemo(() => {
		const by地位 = new Map<string, 資料.檢索結果[]>();

		for (const 條目 of 資料.query字頭(字頭)) {
			const key = 條目.音韻地位.描述;
			if (!by地位.has(key)) {
				by地位.set(key, []);
			}
			by地位.get(key)!.push(條目);
		}

		return [...by地位];
	}, [字頭]);

	const 條目結果 = useMemo<typeof 條目結果originalOrder>(() => {
		const sorted: (typeof 條目結果originalOrder)[] = [[], []];
		for (const entry of 條目結果originalOrder) {
			const 描述 = entry[0];
			sorted[+isQueried音韻地位(描述)].push(entry);
		}
		return [...sorted[1], ...sorted[0]];
	}, [條目結果originalOrder, isQueried音韻地位]);

	const 字頭URI = encodeURIComponent(字頭);

	return (
		<div
			id="charInfo"
			className={`charInfo${show ? "" : " hidden"}`}
			style={{ order: Math.floor(index / charsPerLine) }}
		>
			<div id="infoArrow" className="arrow" style={{ left: (index % charsPerLine) * charWidth + "px" }}></div>
			<div id="infoMain" className="infoMain">
				<div className="tabs pure-button-group">
					{條目結果.map(([描述], i) => (
						<button
							key={描述}
							className={`tab pure-button${i === tabIndex ? " pure-button-active" : ""}`}
							onClick={() => setTabIndex(i)}
						>
							{描述}
						</button>
					))}
				</div>
				<div className="pages">
					{條目結果.map(([描述, 條目們], i) => (
						<ul key={描述} className={`page${i === tabIndex ? "" : " hidden"}`}>
							{條目們.map(條目 => {
								const { 反切: 反切_, 釋義, 來源 } = 條目;
								const 反切 = 反切_ ? `${反切_}${來源?.文獻 === "王三" ? "反" : "切"} ` : "";
								const 來源括註 = 來源 && ["廣韻", "王三"].includes(來源.文獻)
									? `［${來源.文獻} ${來源.韻目}韻］`
									: "";
								return <li key={i} className="pageItem">{`${反切}${釋義}${來源括註}`}</li>;
							})}
						</ul>
					))}
				</div>
				<div className="links">
					<div>
						<a
							href={`https://ytenx.org/zim?dzih=${字頭URI}&dzyen=1`}
							target="_blank"
							rel="noreferrer"
						>
							{`在韻典網查詢「${字頭}」字`}
						</a>
					</div>
					<div>
						<a
							href={`https://zi.tools/zi/${字頭URI}`}
							target="_blank"
							rel="noreferrer"
						>
							{`在字統網查詢「${字頭}」字`}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
