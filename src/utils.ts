import { 資料, 音韻地位 } from "qieyun";
import 常用字頻序表 from "bundle-text:../常用字頻序表.txt";

export const 常見字頻序 = new Map<string, number>();

[...常用字頻序表].forEach((字, 頻序) => {
	常見字頻序.set(字, 頻序);
});

export const cmp = (a: string, b: string) => (常見字頻序.get(a) || 99999) - (常見字頻序.get(b) || 99999);

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
		return [音韻地位.from描述(用户輸入)];
	},
};

export function 佔位符(查詢方式: 查詢方式) {
	return {
		音韻表達式: "冬韻 平聲",
		音韻描述: "云三虞上",
	}[查詢方式];
}

export function* iter描述(音韻地位們: 音韻地位[]) {
	for (const { 描述 } of 音韻地位們) {
		yield 描述;
	}
}

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
		popup.offsetTop;
		popup.classList.add("fade");
	} else {
		alert("瀏覽器不支援複製到剪貼簿，操作失敗");
	}
	return result;
}
