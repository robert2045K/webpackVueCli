module.exports = {
    root:true,
    env: {
        node:true,
    },
    // 继随vue3的规则
    extends:["plugin:vue/vue3-essential", "eslint:recommended"],
    parserOptions: {
        parser: "@babel/eslint-parser",
        /**
         * 这个错误 [eslint] Failed to load config "plugin:vue/vue3-essential" 通常是因为 ESLint 无法正确解析 eslint-plugin-vue 插件。
         * 虽然你的 package.json 中已经包含了 eslint-plugin-vue，但有时候配置文件的解析器选项可能会导致问题。
         * 我修改了 .eslintrc.js，在 parserOptions 中添加了 requireConfigFile: false。这通常有助于解决 @babel/eslint-parser 在某些情况下找不到 Babel 配置文件的问题，从而间接修复插件加载失败的情况。*/
        //現「解析錯誤：未偵測到 Babel 設定檔」的錯誤，是因為 ESLint 在使用 Babel 解析器時有問題。@babel/eslint-parser它要求專案根目錄中存在 Babel 設定檔。您可以透過以下兩種方式解決此問題
        //vue.config.js如果您的專案 Babel 配置已經在其他地方處理（例如在Vue CLI 的文件中），或者如果您希望 ESLint 使用其預設解析行為而沒有特定的 Babel 配置文件
        "requireConfigFile": false,
    }
}