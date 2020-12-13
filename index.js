'use strict';

function handleSubmit() {
	try {
		const text = document.getElementById('inputArea').value;
		const res = [];
		for (let i = 1; i <= 3874; i++) {
			if (Qieyun.get音韻地位(i).屬於(text)) {
				for (const [字頭, 解釋] of Qieyun.query小韻號(i)) {
					res.push(`<a class="char" target="_blank" href="https://ytenx.org/zim?dzih=${encodeURIComponent(字頭)}&dzyen=1">${字頭}</a>`);
				}
			}
		}
		document.getElementById('outputArea').innerHTML = res.length === 0 ? '〈無字〉' : res.join('');
		document.getElementById('errorArea').innerText = '';
	} catch (error) {
		document.getElementById('outputArea').innerHTML = '';
		document.getElementById('errorArea').innerText = `${error}\n${error.stack}`;
	}
}
