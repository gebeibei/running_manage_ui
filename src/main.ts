/* eslint-disable perfectionist/sort-imports */

// core
import { pinia } from "@/pinia"
import { router } from "@/router"
import { installPlugins } from "@/plugins"
import App from "@/App.vue"
import mapboxVue from "vue3-mapbox-gl"

// css
import "normalize.css"
import "nprogress/nprogress.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "vxe-table/lib/style.css"
import "@@/assets/styles/index.scss"
import "virtual:uno.css"
import "vue3-mapbox-gl/dist/style.css"
import { MAPBOX_TOKEN } from "./common/constants/const"

// 创建应用实例
const app = createApp(App)

// 安装插件（全局组件、自定义指令等）
installPlugins(app)

// 安装 pinia 和 router
app.use(pinia).use(router).use(mapboxVue, { accessToken: MAPBOX_TOKEN })

// router 准备就绪后挂载应用
router.isReady().then(() => {
    app.mount("#app")
})
