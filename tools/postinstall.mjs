// https://nodejs.org/docs/latest/api/esm.html#https-and-http-imports
// 因之 node.JS@21.6.0 尚不能支持 `http(s)://` 为模块导入 URL ，故需要此脚本获取 `常用字頻序表.txt` 。
// Since node.JS@21.6.0 does not yet support `http(s)://` as a URL for module import, this script is needed to fetch the `常用字頻序表.txt`.

import https from 'https';
import fs from 'fs';
const url = 'https://quantil.jsdelivr.net/gh/ayaka14732/syyon-vencie@main/texts/常用字頻序表.txt';

https.get(url, (res) => {
  const filePath = fs.createWriteStream('./src/常用字頻序表.txt');
  res.pipe(filePath);
  filePath.on('finish', () => {
    filePath.close();
    console.log('`常用字頻序表.txt` Updated too | `常用字頻序表.txt` 也已更新');
  });
}).on('error', (err) => {
  console.log('Error | 錯誤: ', err.message);
});