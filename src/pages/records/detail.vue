<script lang="ts" setup>
import type { Coordinate } from "@/common/utils/utils"
import { useRun } from "@/common/composables/useRun"
import { COUNTRY_FILL_COLOR, IS_CHINESE, LIGHTS_ON, LINE_OPACITY, MAPBOX_TOKEN, PRIVACY_MODE, PROVINCE_FILL_COLOR, USE_DASH_LINE } from "@/common/constants/const"
import { geoJsonForMap, geoJsonForRuns, getBoundsForGeoData } from "@/common/utils/utils"
import MapboxLanguage from "@mapbox/mapbox-gl-language"
// import * as mapboxPolyline from "@mapbox/polyline"
// import { FeatureCollection } from "geojson"
import mapboxgl from "mapbox-gl"
import "./mapbox.css"

defineOptions({ name: "RecordDetail" })

const route = useRoute()
const runId = route.query.id as string
const { getDetailById, provinces, countries } = useRun()
const recordInfo = ref(getDetailById(+runId))
const geoData = ref(geoJsonForRuns([recordInfo.value as any]))
const bounds = getBoundsForGeoData(geoData.value)
const viewState = reactive({ ...bounds })
const filterProvinces = provinces.slice()
const filterCountries = countries.slice()
filterProvinces.unshift("in", "name")
filterCountries.unshift("in", "name")

const isSingleRun
    = geoData.value.features.length === 1
    && geoData.value.features[0].geometry.coordinates.length
const lights = ref(PRIVACY_MODE ? false : LIGHTS_ON)
const initGeoDataLength = geoData.value.features.length
const isBigMap = (viewState.zoom ?? 0) <= 3
if (isBigMap && IS_CHINESE) {
    // Show boundary and line together, combine geoData(only when not combine yet)
    if (geoData.value.features.length === initGeoDataLength) {
        geoData.value = {
            type: "FeatureCollection",
            features: geoData.value.features.concat(geoJsonForMap().features as any)
        }
    }
}
const dash = USE_DASH_LINE && !isSingleRun && !isBigMap ? [2, 2] : [2, 0]
let startLon = 0
let startLat = 0
let endLon = 0
let endLat = 0
if (isSingleRun) {
    const points = geoData.value.features[0].geometry.coordinates as Coordinate[];
    [startLon, startLat] = points[0];
    [endLon, endLat] = points[points.length - 1]
}

mapboxgl.accessToken = MAPBOX_TOKEN

const initMap = () => {
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v10"
    })

    map.on("style.load", () => {
        map?.addControl(new MapboxLanguage({ defaultLanguage: "zh-Hans" }))

        map.addSource("source", { data: geoData.value, type: "geojson" })
        map.addLayer({ type: "fill", source: "source", id: "province", filter: filterProvinces, paint: { "fill-color": PROVINCE_FILL_COLOR } })
        map.addLayer({ type: "fill", source: "source", id: "countries", filter: filterCountries, paint: { "fill-color": COUNTRY_FILL_COLOR, "fill-opacity": ["case", ["==", ["get", "name"], "中国"], 0.1, 0.5] } })
        map.addLayer({ type: "line", source: "source", id: "runs2", layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": ["get", "color"], "line-width": isBigMap && lights.value ? 1 : 2, "line-dasharray": dash, "line-opacity": isSingleRun || isBigMap || !lights.value ? 1 : LINE_OPACITY } })

        // 添加起点，终点
        const startEndGeojson = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {
                        typeColor: "start"
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [startLon, startLat]
                    }
                },
                {
                    type: "Feature",
                    properties: {
                        typeColor: "end"
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [endLon, endLat]
                    }
                }
            ]
        }

        map.addSource("startEndSource", {
            type: "geojson",
            data: startEndGeojson as any
        })
        // 起点和终点
        map.addLayer({
            id: "startEnd-layer",
            type: "circle",
            source: "startEndSource",
            paint: {
                "circle-radius": 10,
                "circle-color": ["match", ["get", "typeColor"], "start", "green", "end", "red", "#cccccc"]
            }
        })
    })
}

onMounted(() => {
    initMap()
})
</script>

<template>
    <div class="app-container p-24">
        <div class="w-900 h-400" id="map" />
    </div>
</template>

<style lang="scss" scoped></style>
