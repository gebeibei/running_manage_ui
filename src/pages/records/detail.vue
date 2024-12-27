<template>
    <div class="com-page">
        <div class=" grid grid-cols-2 mb-24">
            <div>
                <div class="grid grid-cols-3 gap-col-24 gap-row-24">
                    <div>
                        <div class="zrx-info-label lh-24 f-c m-b-8">
                            跑步距离
                            <el-image src="https://api.iconify.design/mdi:map-marker-distance.svg" class="ml-8 f-c"></el-image>
                        </div>
                        <div class="zrx-info-value empty">
                            {{ recordInfo.distance }}KM
                        </div>
                    </div>
                    <div>
                        <div class="zrx-info-label lh-24 f-c m-b-8">
                            跑步配速
                            <el-image src="https://api.iconify.design/ph:chart-line-up.svg" class="ml-8 f-c"></el-image>
                        </div>
                        <div class="zrx-info-value empty">
                            {{ recordInfo.paceParts }}
                        </div>
                    </div>
                    <div>
                        <div class="zrx-info-label lh-24 f-c m-b-8">
                            跑步心率
                            <el-image src="https://api.iconify.design/streamline:heart-rate-pulse-graph.svg" class="ml-8 f-c"></el-image>
                        </div>
                        <div class="zrx-info-value empty">
                            {{ recordInfo.heartRate }}
                        </div>
                    </div>
                    <div>
                        <div class="zrx-info-label lh-24 f-c m-b-8">
                            跑步时长
                            <el-image src="https://api.iconify.design/material-symbols:alarm.svg" class="ml-8 f-c"></el-image>
                        </div>
                        <div class="zrx-info-value empty">
                            {{ recordInfo.runTime }}
                        </div>
                    </div>
                    <div>
                        <div class="zrx-info-label lh-24 f-c m-b-8">
                            跑步日期
                            <el-image src="https://api.iconify.design/material-symbols:calendar-clock.svg" class="ml-8 f-c"></el-image>
                        </div>
                        <div class="zrx-info-value empty">
                            {{ recordInfo.startDate }}
                        </div>
                    </div>
                    <div>
                        <div class="zrx-info-label lh-24 f-c m-b-8">
                            地点
                            <el-image src="https://api.iconify.design/material-symbols:location-on.svg" class="ml-8 f-c"></el-image>
                        </div>
                        <div class="zrx-info-value empty">
                            {{ recordInfo.address }}
                        </div>
                    </div>
                </div>
            </div>

            <div></div>
        </div>
        <Mapbox :options="options" :register="register" @move="onMove" @load="onLoad" width="100%" :height="MAP_HEIGHT" class="relative">
            <GeoJsonSource id="data" type="geojson" :data="geoData">
                <FillLayer
                    id="province"
                    :style="
                        {
                            paint: {
                                'fill-color': PROVINCE_FILL_COLOR,
                            },
                        }
                    "
                    :filter="filterProvinces"
                />
                <FillLayer
                    id="countries"
                    :style="
                        {
                            paint: {
                                'fill-color': COUNTRY_FILL_COLOR,
                                'fill-opacity': [`case`, [`==`, [`get`, `name`], `中国`], 0.1, 0.5],
                            },
                        }
                    "
                    :filter="filterCountries"
                />
                <LineLayer
                    id="runs2"
                    :style="{
                        'line-color': ['get', 'color'],
                        'line-width': isBigMap && lights ? 1 : 2,
                        'line-dasharray': dash,
                        'line-opacity': isSingleRun || isBigMap || !lights ? 1 : LINE_OPACITY,
                        'line-blur': 1,
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round',
                        },
                    }"
                />
            </GeoJsonSource>

            <Marker
                key="maker_start"
                :lnglat="[startLon, startLat]"
            >
                <div :style="markerStyle">
                    <div v-html="StartSvg" class="wh-full mt-12 b-0 p-0"></div>
                </div>
            </Marker>

            <Marker
                key="maker_end"
                :lnglat="[endLon, endLat]"
            >
                <div :style="markerStyle">
                    <div v-html="EndSvg" class="wh-full mt-12 b-0 p-0"></div>
                </div>
            </Marker>

            <div class="h-29 w-710 absolute bottom-0 left-120 cursor-pointer" style="color: rgb(224, 237, 94);">
                {{ runTitle }}
            </div>

            <FullscreenControl
                :style="{
                    position: 'absolute',
                    marginTop: '29.2px',
                    right: '0px',
                    top: '0px',
                    opacity: 0.3,
                }"
            />

            <LightsControl v-if="!PRIVACY_MODE" v-model="lights" />
            <NavigationControl :show-compass="false" position="bottom-right" style="opacity: 0.3;"></NavigationControl>
        </Mapbox>
    </div>
</template>

<script lang="ts" setup>
import type { Coordinate, IViewState } from "@/common/utils/utils"
import type { ExpressionSpecification, MapOptions } from "mapbox-gl"
import { useRun } from "@/common/composables/useRun"
import {
    COUNTRY_FILL_COLOR,
    IS_CHINESE,
    LIGHTS_ON,
    LINE_OPACITY,
    MAP_HEIGHT,
    MAP_LAYER_LIST,
    PRIVACY_MODE,
    PROVINCE_FILL_COLOR,
    ROAD_LABEL_DISPLAY,
    USE_DASH_LINE
} from "@/common/constants/const"
import { geoJsonForMap, geoJsonForRuns, getBoundsForGeoData, titleForShow } from "@/common/utils/utils"
import EndSvg from "@@/assets/icons/end.svg?raw"
import StartSvg from "@@/assets/icons/start.svg?raw"
import MapboxLanguage from "@mapbox/mapbox-gl-language"
import { useMapbox } from "vue3-mapbox-gl"
import LightsControl from "./LightsControl.vue"
import "./mapbox.css"
/** https://monzeye.github.io/vue3-mapbox-gl-doc/ */

defineOptions({ name: "RecordDetail" })

const size = 5
const markerStyle = {
    transform: `translate(${-size / 2}px,${-size}px)`,
    maxWidth: "25px"
}

const route = useRoute()
const runId = route.query.id as string
const { getDetailById, provinces, countries } = useRun()
const recordInfo = ref(getDetailById(+runId)!)
const geoData = ref(geoJsonForRuns([recordInfo.value as any].map(n => n.origin)))
const bounds = getBoundsForGeoData(geoData.value)
const viewState = reactive<Required<IViewState>>({ ...bounds } as any)
const filterProvinces: ExpressionSpecification = ["name", [...provinces.slice()]]
const filterCountries: ExpressionSpecification = ["name", [...countries.slice()]]
const runTitle = recordInfo.value?.origin && titleForShow(recordInfo.value?.origin)

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

const keepWhenLightsOff = ["runs2"]
const options: Partial<MapOptions> = {
    style: "mapbox://styles/mapbox/dark-v10",
    zoom: viewState.zoom,
    center: [viewState.longitude, viewState.latitude]
}
const [register, { getMapInstance, getStyle, getCenter, getZoom }] = useMapbox()
const switchLayerVisibility = (lights: boolean) => {
    const map = getMapInstance.value
    const styleJson = getStyle()
    styleJson?.layers.forEach((it: { id: string }) => {
        if (!keepWhenLightsOff.includes(it.id)) {
            map?.setLayoutProperty(it.id, "visibility", lights ? "visible" : "none")
        }
    })
}
const onLoad = () => {
    const map = getMapInstance.value
    if (map && IS_CHINESE) {
        map.addControl(new MapboxLanguage({
            defaultLanguage: "zh-Hans"
        }))
    }

    map?.on("style.load", () => {
        if (!ROAD_LABEL_DISPLAY) {
            MAP_LAYER_LIST.forEach((id) => {
                map?.removeLayer(id)
            })
        }
        switchLayerVisibility(lights.value)
    })

    if (map) {
        switchLayerVisibility(lights.value)
    }
}

const onMove = () => {
    const poi = getCenter() as { lng: number, lat: number }
    const zoom = getZoom()
    if (zoom) viewState.zoom = zoom
    if (poi) {
        viewState.longitude = poi.lng
        viewState.latitude = poi.lat
    }
}
</script>

<style lang="scss" scoped></style>
