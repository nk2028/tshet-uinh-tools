# Phonological Position Query Tool

The URL of this query tool is [nk2028.shn.hk/tshet-uinh-tools/](https://nk2028.shn.hk/tshet-uinh-tools/ "音韻地位查詢器") .

## Deployment Instructions

This project uses Vite as the bundling tool. For ease of deployment on GitHub Pages and similar services, `package.json` and `vite.config.mts` are set by default to use the public path `/tshet-uinh-tools/`. When browsing, be sure to pay attention to whether the URL is in the form of `website.domain/tshet-uinh-tools/`.

If you are debugging, maintaining, or wish to independently deploy on services like Cloudflare Pages, which by default store resources at the root path `/`, please add the flag `--base=/` when executing `run build`, i.e., `run build --base=/`. Alternatively, modifying the relevant parameters in `package.json` and `vite.config.mts` is also an effective method. This way, you can access the project directly using the domain format `website.domain`.


# 音韻地位查詢器

查詢器地址在 [nk2028.shn.hk/tshet-uinh-tools/](https://nk2028.shn.hk/tshet-uinh-tools/ "音韻地位查詢器") 。

## 部署說明

本項目採用 Vite 爲打包工具。爲方便部署在 GitHub Pages 及同類型的服務上， `package.json` 與 `vite.config.mts` 默認設置公共路徑爲 `/tshet-uinh-tools/` ，您瀏覽時務必注意 URL 是否爲類似 `website.domain/tshet-uinh-tools/` 的形式。

若您在調試、維護，或想自行部署在 Cloudflare Pages 等默認保存資源在一級路徑 `/` 下的服務，請在打包構建 `run build` 時附上標識參數 `--base=/` ，即 `run build --base=/` ，或修改 `package.json` 與 `vite.config.mts` 中的相關參數亦是可行的方法。如此您就可以直接以域名 `website.domain` 的形式訪問了。
