import { 資料 } from "tshet-uinh";
import { forwardRef, useEffect, useMemo, useState } from "react";

interface Props {
	字頭們: string[];
	描述們: ReadonlySet<string>;
	charsPerLine: number;
	charWidth: number;
	toggleCharInfo: { current: ((i: number) => void) | undefined };
}

export default forwardRef<HTMLDivElement, Props>(function CharInfo(
	{ 字頭們, 描述們, charsPerLine, charWidth, toggleCharInfo }: Props,
	ref,
) {
	const [hidden, setHidden] = useState(true);
	const [index, setIndex] = useState(0);
	const [tabIndex, setTabIndex] = useState(0);

	const 字頭 = 字頭們[index];
	const 地位們 = useMemo(() => {
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

	toggleCharInfo.current = i => {
		if (i === index && !hidden) setHidden(true);
		else {
			setHidden(false);
			setIndex(i);
		}
	};

	useEffect(() => {
		const tabIndex = 地位們.findIndex(([描述]) => 描述們.has(描述));
		setTabIndex(tabIndex === -1 ? 0 : tabIndex);
	}, [index, 地位們, 描述們]);

	const 字頭URI = encodeURIComponent(字頭);

	return (
		<div
			id="charInfo"
			className={`charInfo${hidden ? " hidden" : ""}`}
			style={{ order: Math.floor(index / charsPerLine) }}
			ref={ref}
		>
			<div id="infoArrow" className="arrow" style={{ left: (index % charsPerLine) * charWidth + "px" }}></div>
			<div id="infoMain" className="infoMain">
				<div className="tabs pure-button-group">
					{地位們.map(([描述], i) => (
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
					{地位們.map(([描述, 條目們], i) => (
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
});
