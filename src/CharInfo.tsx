import { useMemo, useState } from "react";
import { 資料 } from "tshet-uinh";

function tabClassName(active: boolean, isQueried: boolean) {
	const classes = ["tab", "pure-button"];
	if (active) {
		classes.push("pure-button-active");
	}
	classes.push(isQueried ? "queried" : "not-queried");
	return classes.join(" ");
}

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
		const by地位 = new Map<string, 資料.資料條目[]>();

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
							className={tabClassName(i === tabIndex, isQueried音韻地位(描述))}
							onClick={() => setTabIndex(i)}
						>
							{描述}
						</button>
					))}
				</div>
				<div className="pages">
					{條目結果.map(([描述, 各條目], i) => (
						<ul key={描述} className={`page${i === tabIndex ? "" : " hidden"}`}>
							{各條目.map(條目 => {
								const { 字頭: 條目字頭, 字頭說明, 反切, 直音, 釋義, 來源, 韻目 } = 條目;
								const 音注 = 反切 ? 反切 + (來源 === "廣韻" ? "切" : "反") : "音" + 直音;
								return (
									<li key={i} className="pageItem">
										<p>
											<span className="headword">{條目字頭}</span> {音注}
										</p>
										{釋義 ? <p>{釋義}</p> : null}
										{字頭說明 ? <p className="headwordNote">{字頭說明}</p> : null}
										<p>{來源} {韻目}韻</p>
									</li>
								);
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
