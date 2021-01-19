'use strict';

function handleSubmit() {
	try {
		const text = document.getElementById('inputArea').value.trim();
		const fragment = document.createDocumentFragment();
		for (const 音韻地位 of Qieyun.iter音韻地位()) {
			if (音韻地位.屬於(text)) {
				for (const { 字頭 } of 音韻地位.條目) {
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
