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
        <!-- <HeartRateChart :id="+runId" /> -->
        <div class="w-full">
            <MapGL :record-info="recordInfo" :provinces :countries />
        </div>
    </div>
</template>

<script lang="ts" setup>
// import HeartRateChart from "./components/heartRateChart.vue"
import MapGL from "./components/mapGL/MapGL.vue"

defineOptions({ name: "RecordDetail" })

const route = useRoute()
const runId = route.query.id as string
const { getDetailById, provinces, countries } = useRun()
const recordInfo = ref(getDetailById(+runId)!)
</script>

<style lang="scss" scoped></style>
