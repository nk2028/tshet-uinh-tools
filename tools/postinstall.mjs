/* https://nodejs.org/docs/latest/api/esm.html#https-and-http-imports
 *
 * Since node.JS@21.6.0 does not yet support `http(s)://` as a URL for module import, this script is needed to fetch the `常用字頻序表.txt`.
 * 因之 node.JS@21.6.0 尚不能支援 `http(s)://` 爲模塊導入 URL ，故需要此脚本獲取 `常用字頻序表.txt` 。
 * 
 */

import https from 'https';
import fs from 'fs';
const url = 'https://quantil.jsdelivr.net/gh/ayaka14732/syyon-vencie@main/texts/常用字頻序表.txt';

https.get(url, (res) => {
  const filePath = fs.createWriteStream('./src/常用字頻序表.txt');
  res.pipe(filePath);
  filePath.on('finish', () => {
    filePath.close();
    console.log('`常用字頻序表.txt` has also been updated | `常用字頻序表.txt` 也已更新');
  });
}).on('error', (err) => {
  console.log('Error | 錯誤: ', err.message);
});