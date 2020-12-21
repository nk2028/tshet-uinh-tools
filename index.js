'use strict';

function handleSubmit() {
	try {
		const text = document.getElementById('inputArea').value.trim();
		const fragment = document.createDocumentFragment();
		for (let i = 1; i <= 3874; i++) {
			if (Qieyun.get音韻地位(i).屬於(text)) {
				for (const [字頭, 解釋] of Qieyun.query小韻號(i)) {
					const a = document.createElement('a');
					a.classList.add('char');
					a.target = '_blank';
					a.href = `https://ytenx.org/zim?dzih=${encodeURIComponent(字頭)}&dzyen=1`;
					a.innerText = 字頭;
					fragment.appendChild(a);
				}
			}
		}
		document.getElementById('outputArea').innerHTML = '';
		document.getElementById('outputArea').appendChild(fragment);
		document.getElementById('errorArea').innerText = '';
	} catch (error) {
		document.getElementById('outputArea').innerHTML = '';
		document.getElementById('errorArea').innerText = `${error}\n${error.stack}`;
	}
}

window.addEventListener('DOMContentLoaded', (event) => handleSubmit());
