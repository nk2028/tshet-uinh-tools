'use strict';

// --------
// Initialization

function hideLoadingOverlay() {
	document.querySelector('#loading-overlay').classList.add('hidden');
}

let 常見字 = new Set();
let 常見字頻序 = {};

Promise.allSettled([
	fetch('https://cdn.jsdelivr.net/gh/ayaka14732/syyon-vencie@69bc015/texts/%E5%B8%B8%E7%94%A8%E5%AD%97%E9%A0%BB%E5%BA%8F%E8%A1%A8.txt')
		.then((response) => response.text())
		.then((text) => {
			[...text].forEach((字, 頻序) => {
				常見字.add(字);
				常見字頻序[字] = 頻序;
			});
		})
		.catch((err) => {
			alert(err);
		}),
	new Promise((resolve) => window.addEventListener('load', () => resolve(), { once: true})),
]).then(() => {
	new ResizeObserver(() => {
		displayResult();
	}).observe(document.getElementById('outputArea'));
	hideLoadingOverlay();
});

// --------
// Display

function 創建單字HTML(字頭, index) {
	const a = document.createElement('a');
	a.classList.add('char');
	//a.target = '_blank';
	//a.href = `https://ytenx.org/zim?dzih=${encodeURIComponent(字頭)}&dzyen=1`;
	a.onclick = () => console.log(`# click: ${字頭} (#${index})`);
	a.innerText = 字頭;
	return a;
}

const queryResult = { 字頭: [], elems: [], charsPerLine: null };

function setResult(字頭結果) {
	queryResult.字頭 = 字頭結果;
	queryResult.elems = [];
	字頭結果.forEach((字頭, i) => {
		const a = 創建單字HTML(字頭, i);
		queryResult.elems.push(a);
	});
	displayResult(true);
}

function displayResult(force = false) {
	const outputArea = document.getElementById('outputArea');
	if (!queryResult.elems.length) {
		outputArea.innerHTML = '';
		return;
	}

	const lineWidth = outputArea.getBoundingClientRect().width;
	const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
	const charsPerLine = Math.max(Math.floor(lineWidth / (1.6 * rem)), 1);
	if (queryResult.charsPerLine === charsPerLine && !force) {
		return;
	}
	queryResult.charsPerLine = charsPerLine;

	outputArea.innerHTML = '';
	const fragment = document.createDocumentFragment();
	let line = null;
	queryResult.elems.forEach((a, i) => {
		if (i % charsPerLine === 0) {
			if (line) {
				fragment.appendChild(line);
			}
			line = document.createElement('div');
			line.classList.add('line');
			line.style.order = i / charsPerLine;
		}
		line.appendChild(a);
	});
	fragment.appendChild(line);
	outputArea.appendChild(fragment);
}

// --------
// Query

const cmp = (a, b) => (常見字頻序[a] || 99999) - (常見字頻序[b] || 99999);

const 查詢音韻地位 = {
	'音韻表達式': (用户輸入) => {
		let 音韻地位們 = [];
		for (const 音韻地位 of Qieyun.資料.iter音韻地位()) {
			if (音韻地位.屬於(用户輸入)) {
				音韻地位們.push(音韻地位);
			}
		}
		return 音韻地位們;
	},
	'音韻描述': (用户輸入) => {
		return [Qieyun.音韻地位.from描述(用户輸入)];
	}
};

function 查詢() {
	const 顯示哪些字 = document.getElementById('form顯示哪些字').顯示哪些字.value;
	const 查詢方式 = document.forms['query'].elements['查詢方式'].value;
	const 用户輸入 = document.forms['query'].elements['用户輸入'].value.trim();

	document.getElementById('outputArea').innerHTML = '';
	document.querySelector('input[name="用户輸入"]').classList.remove('invalid')

	try {
		const 音韻地位們 = 查詢音韻地位[查詢方式](用户輸入);

		const 結果 = new Set();
		for (const 音韻地位 of 音韻地位們) {
			const 條目 = Qieyun.資料.query音韻地位(音韻地位);
			if (顯示哪些字 === '一個音韻地位只顯示一個代表字' && 條目.length) {
				結果.add(條目[0].字頭);
			} else {
				for (const { 字頭 } of 條目) {
					if (顯示哪些字 === '顯示所有字' || 常見字.has(字頭)) {
						結果.add(字頭);
					}
				}
			}
		}

		setResult([...結果].sort(cmp));
		document.getElementById('errorArea').innerText = '';
	} catch (err) {
		document.getElementById('outputArea').innerHTML = '';
		document.querySelector('input[name="用户輸入"]').classList.add('invalid')
		document.getElementById('errorArea').innerText = `${err}\n${err.stack}`;
	}
}

function 佔位符(查詢方式) {
	return {
		'音韻表達式': '冬韻 平聲',
		'音韻描述': '云三虞上'
	}[查詢方式];
}
