import { ChangeEvent, FormEvent, MouseEvent, useCallback, useMemo, useReducer, useRef, useState } from "react";

import { 資料, type 音韻地位 } from "tshet-uinh";

import OutputArea from "./OutputArea";
import {
	compare字頭order,
	copyToClipboard,
	佔位符,
	屬性後綴,
	常見字頻序,
	type 查詢方式,
	查詢音韻地位,
	條目有效字頭,
	type 顯示哪些字,
} from "./utils";

interface Query {
	查詢方式: 查詢方式;
	用户輸入: string;
}

export interface 音韻地位結果 {
	error: unknown;
	各音韻地位: 音韻地位[];
}

const initial查詢方式: 查詢方式 = "音韻表達式";
const initialQuery = {
	查詢方式: initial查詢方式,
	用户輸入: 佔位符(initial查詢方式),
} as const satisfies Query;

export default function App() {
	// Form states

	const [edited, setEdited] = useState(false);
	const [用户輸入, set用户輸入] = useReducer((_: string, 用户輸入: string) => {
		setEdited(true);
		return 用户輸入;
	}, initialQuery.用户輸入);
	const [查詢方式, set查詢方式] = useReducer((_: 查詢方式, 查詢方式: 查詢方式) => {
		set用户輸入(佔位符(查詢方式));
		return 查詢方式;
	}, initialQuery.查詢方式);
	const [顯示哪些字, set顯示哪些字] = useState<顯示哪些字>("只顯示常用字");

	// Responsive UI states

	const [charWidth, setCharWidth] = useState(1);
	const [charsPerLine, setCharsPerLine] = useState(1);

	const observeOutputArea = useCallback((outputArea: HTMLOutputElement | null) => {
		if (outputArea) {
			new ResizeObserver(entries => {
				const charWidth = 1.6 * parseFloat(getComputedStyle(document.documentElement).fontSize);
				const lineWidth = entries[0].contentRect.width;
				setCharWidth(charWidth);
				setCharsPerLine(Math.max(Math.floor(lineWidth / charWidth), 1));
			}).observe(outputArea);
		}
	}, []);

	// Functionality states

	const [query, setQuery] = useState<Query>(initialQuery);
	// `queryId` is used for resetting OutputArea
	const [queryId, setQueryId] = useState(0);
	const 音韻地位結果 = useMemo<音韻地位結果>(() => {
		const { 查詢方式, 用户輸入 } = query;
		let error: unknown = null;
		let 各音韻地位: 音韻地位[] = [];
		try {
			各音韻地位 = 查詢音韻地位[查詢方式](用户輸入);
		} catch (e) {
			error = e;
		}
		return { error, 各音韻地位 };
	}, [query]);
	const 字頭結果 = useMemo(() => {
		const { error, 各音韻地位 } = 音韻地位結果;
		if (error) {
			return [];
		}
		const 結果 = new Set<string>();
		for (const 音韻地位 of 各音韻地位) {
			const 各條目 = 資料.query音韻地位(音韻地位);
			if (顯示哪些字 === "一個音韻地位只顯示一個代表字" && 各條目.length) {
				結果.add(各條目.map(條目有效字頭).reduce((prev, cur) => compare字頭order(cur, prev) < 0 ? cur : prev));
			} else {
				for (const 條目 of 各條目) {
					const 字頭 = 條目有效字頭(條目);
					if (顯示哪些字 === "顯示所有字" || 常見字頻序.has(字頭)) {
						結果.add(字頭);
					}
				}
			}
		}
		return [...結果].sort(compare字頭order);
	}, [顯示哪些字, 音韻地位結果]);

	// UI actions

	const copyPopup = useRef<HTMLSpanElement>(null!);
	const onClickCopy = useCallback(() => void copyToClipboard(字頭結果.join(""), copyPopup.current), [字頭結果]);

	const onQuerySubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setEdited(false);
			setQuery({ 查詢方式, 用户輸入 });
			setQueryId(x => x + 1);
		},
		[查詢方式, 用户輸入],
	);
	const onForm顯示哪些字Submit = useCallback((event: FormEvent<HTMLFormElement>) => event.preventDefault(), []);

	const 用户輸入Input = useRef<HTMLInputElement>(null!);
	const onTipsClick = useCallback(({ target }: MouseEvent<HTMLLIElement>) => {
		const { tagName, textContent } = target as HTMLElement;
		if (tagName === "B") {
			const inputElement = 用户輸入Input.current;
			const { selectionStart, selectionEnd, value } = inputElement;

			let text = value.slice(0, selectionStart ?? value.length);
			let textAfterCursor = value.slice(selectionEnd ?? value.length);
			if (!屬性後綴.has(textContent) && text && !text.endsWith(" ")) text += " ";
			text += textContent + " ";
			if (textAfterCursor.startsWith(" ")) textAfterCursor = textAfterCursor.slice(1);
			set用户輸入(inputElement.value = text + textAfterCursor);

			inputElement.selectionStart = inputElement.selectionEnd = text.length;
			inputElement.focus();
		}
	}, []);

	const on查詢方式Change = useCallback(
		({ currentTarget: { value } }: ChangeEvent<HTMLSelectElement>) => set查詢方式(value as 查詢方式),
		[],
	);
	const on用户輸入Input = useCallback(
		({ currentTarget: { value } }: FormEvent<HTMLInputElement>) => set用户輸入(value),
		[],
	);
	const on顯示哪些字Change = useCallback(
		({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
			set顯示哪些字(value as 顯示哪些字);
			setQueryId(x => x + 1);
		},
		[],
	);

	return (
		<>
			<form className="pure-form" name="query" onSubmit={onQuerySubmit}>
				<div className="query-container">
					<div className="query-select">
						<span>根據</span>
						<select name="查詢方式" value={查詢方式} onChange={on查詢方式Change}>
							<option>音韻表達式</option>
							<option>音韻描述</option>
						</select>
						<span>查字</span>
					</div>
					<input
						name="用户輸入"
						type="text"
						value={用户輸入}
						className={音韻地位結果.error && !edited ? "invalid" : ""}
						onInput={on用户輸入Input}
						ref={用户輸入Input}
					/>
					<input className="pure-button" type="submit" value="查詢" />
				</div>
				<ul className="tips">
					<li className={查詢方式 === "音韻描述" ? "" : "hidden"}>
						音韻描述格式必須為：<b>母</b>&#x2002;呼&#x2002;等&#x2002;類&#x2002;<b>韻</b>&#x2002;<b>聲</b>
						，粗體者不可省略（詳見{" "}
						<a href="https://nk2028.shn.hk/tshet-uinh-js/">
							<span lang="en-HK">TshetUinh.js</span>
						</a>
						）
					</li>
					<li className={查詢方式 === "音韻表達式" ? "clickable" : "hidden"} onClick={onTipsClick}>
						支援的音韻表達式運算符：幫<b>母</b>、脣<b>音</b>、幫<b>組</b>
						、<b>開口</b>、<b>合口</b>、<b>開合中立</b>
						、一<b>等</b>
						、<b>A類</b>、<b>B類</b>、<b>C類</b>、<b>不分類</b>
						、東<b>韻</b>、通<b>攝</b>
						、平<b>聲</b>、<b>仄聲</b>、<b>舒聲</b>
						、<b>全清</b>、<b>次清</b>、<b>全濁</b>、<b>次濁</b>、<b>清音</b>、<b>濁音</b>
						、<b>銳音</b>、<b>鈍音</b>
						、<b>陰聲韻</b>、<b>陽聲韻</b>、<b>入聲韻</b>
						、<b>且</b>（可省略）、<b>或</b>、<b>非</b>、括號（詳見{" "}
						<a href="https://nk2028.shn.hk/tshet-uinh-js/">
							<span lang="en-HK">TshetUinh.js</span>
						</a>
						）
					</li>
				</ul>
			</form>
			<h2>查詢結果</h2>
			<form id="form顯示哪些字" className="radio-container" onSubmit={onForm顯示哪些字Submit}>
				<label className="pure-radio">
					<input
						type="radio"
						name="顯示哪些字"
						onChange={on顯示哪些字Change}
						value="只顯示常用字"
						checked={顯示哪些字 === "只顯示常用字"}
					/>
					只顯示常用字
				</label>
				<label className="pure-radio">
					<input
						type="radio"
						name="顯示哪些字"
						onChange={on顯示哪些字Change}
						value="一個音韻地位只顯示一個代表字"
						checked={顯示哪些字 === "一個音韻地位只顯示一個代表字"}
					/>
					一個音韻地位只顯示一個代表字
				</label>
				<label className="pure-radio">
					<input
						type="radio"
						name="顯示哪些字"
						onChange={on顯示哪些字Change}
						value="顯示所有字"
						checked={顯示哪些字 === "顯示所有字"}
					/>
					顯示所有字
				</label>
				<button className="pure-button copyButton" onClick={onClickCopy}>
					複製所有字到剪貼簿
					<span id="copyPopup" className="popup" ref={copyPopup}>
						已複製
					</span>
				</button>
			</form>
			<OutputArea
				key={queryId}
				音韻地位結果={音韻地位結果}
				字頭結果={字頭結果}
				charsPerLine={charsPerLine}
				charWidth={charWidth}
				ref={observeOutputArea}
			>
			</OutputArea>
		</>
	);
}
