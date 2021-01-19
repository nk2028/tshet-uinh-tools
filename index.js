'use strict';

let commonChars;

fetch('https://raw.githubusercontent.com/ayaka14732/syyon-vencie/69bc015b5c3df4cb3f1a856d49d9bf8a3271396e/texts/%E5%B8%B8%E7%94%A8%E5%AD%97%E9%A0%BB%E5%BA%8F%E8%A1%A8.txt')
.then((response) => response.text())
.then((text) => commonChars = new Set(text));

function handleSubmit() {
	const showRareChar = document.getElementById('rareCharSwitch').checked;

	if (!showRareChar && commonChars == null) {
		alert('Loading, please wait...');
		return;
	}

	try {
		const text = document.getElementById('inputArea').value.trim();
		const fragment = document.createDocumentFragment();
		for (const 音韻地位 of Qieyun.iter音韻地位()) {
			if (音韻地位.屬於(text)) {
				for (const { 字頭 } of 音韻地位.條目) {
					if (showRareChar || commonChars.has(字頭)) {
						const a = document.createElement('a');
						a.classList.add('char');
						a.target = '_blank';
						a.href = `https://ytenx.org/zim?dzih=${encodeURIComponent(字頭)}&dzyen=1`;
						a.innerText = 字頭;
						fragment.appendChild(a);
					}
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
