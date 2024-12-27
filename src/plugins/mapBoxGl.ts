import type { App } from "vue"
import { MAPBOX_TOKEN } from "@/common/constants/const"
import mapboxVue from "vue3-mapbox-gl"
import "vue3-mapbox-gl/dist/style.css"

export function installMapBoxGl(app: App) {
    app.use(mapboxVue, {
        accessToken: MAPBOX_TOKEN
    })
}
