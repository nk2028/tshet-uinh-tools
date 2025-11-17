import { 資料, 音韻地位 } from "tshet-uinh";

import 常用字頻序表 from "../常用字頻序表.txt?raw";

export const 常見字頻序 = new Map<string, number>();

[...常用字頻序表].forEach((字, 頻序) => {
	常見字頻序.set(字, 頻序);
});

export const compare字頭order = (a: string, b: string) => (常見字頻序.get(a) ?? 99999) - (常見字頻序.get(b) ?? 99999);

/** 條目的校正後字頭，但應刪條目（沒有校正字頭）則用字頭原貌 */
export function 條目有效字頭(條目: 資料.資料條目): string {
	// NOTE Non-null assertion safe because 字頭校正 and 字頭原貌 cannot be both null
	return (條目.字頭校正 ?? 條目.字頭原貌)!;
}

export type 查詢方式 = "音韻表達式" | "音韻描述";
export type 顯示哪些字 = "只顯示常用字" | "一個音韻地位只顯示一個代表字" | "顯示所有字";

export const 查詢音韻地位: Record<查詢方式, (用户輸入: string) => 音韻地位[]> = {
	音韻表達式(用户輸入) {
		const 音韻地位們 = [];
		for (const 音韻地位 of 資料.iter音韻地位()) {
			if (音韻地位.屬於(用户輸入)) {
				音韻地位們.push(音韻地位);
			}
		}
		return 音韻地位們;
	},
	音韻描述(用户輸入) {
		return [音韻地位.from描述(用户輸入, true)];
	},
};

export function 佔位符(查詢方式: 查詢方式) {
	return {
		音韻表達式: "冬韻 平聲",
		音韻描述: "云合三虞上",
	}[查詢方式];
}

export const 屬性後綴 = new Set("母等韻音攝組聲");

export async function copyToClipboard(str: string, popup: HTMLElement) {
	const result = await (async () => {
		// NOTE whole expression wrapped in an async closure, so that it still
		// catches in case that `navigator.clipboard` does not exist
		await navigator.clipboard.writeText(str);
		return true;
	})().catch(() => {
		const textArea = document.createElement("textarea");
		textArea.value = str;
		textArea.style.position = "fixed";
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		try {
			return document.execCommand("copy");
		} catch {
			return false;
		} finally {
			document.body.removeChild(textArea);
		}
	});
	if (result) {
		popup.classList.remove("fade");
		// NOTE Reading `.offsetTop` triggers DOM reflow and thus restarts animation
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		popup.offsetTop;
		popup.classList.add("fade");
	} else {
		alert("瀏覽器不支援複製到剪貼簿，操作失敗");
	}
	return result;
}
