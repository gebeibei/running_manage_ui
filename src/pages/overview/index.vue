<template>
    <div class="app-container">
        <div class="h-full p-l-16 p-r-8">
            <div class="h-110 grid grid-cols-4 gap-col-16px">
                <div v-for="item in indexList" :key="item.key" class="com-shadow f-c rd-2px p-l-26 bg-white">
                    <div class="size-40 rd-50% m-r-10 f-c-c" :class="[item.iconBg]">
                        <el-image :src="item.icon" class="size-24" />
                    </div>
                    <div>
                        <div class="c-font op-70 f-14 lh-24px m-b-6">
                            {{ item.label }}
                        </div>
                        <div class="f-c-c" v-if="item.type === 'number'">
                            <el-statistic
                                :value="+indexData.total[item.key]"
                                class="font-bold f-24 c-font op-90 lh-24px"
                            />
                            <span class="f-16 lh-24px font-400 c-font op-90">{{ item.unit }}</span>
                        </div>
                        <div class="font-bold f-24 c-font op-90 lh-24px" v-else>
                            {{ indexData.total[item.key] }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="com-shadow bg-white p-24 m-t-24 grid grid-cols-2 gap-col-24">
                <div v-for="([prop], idx) in years" :key="idx">
                    <div class="com-header">
                        {{ prop }}
                    </div>

                    <div class="f-c gap-col-24">
                        <template v-for="n in indexList" :key="n.key">
                            <div class="f-c" v-if="indexData[prop]?.[n.key]">
                                <div class="com-info-label">
                                    {{ n.label }} :
                                </div>
                                <div class="com-info-value empty">
                                    {{ indexData[prop]?.[n.key] }}
                                    <span>{{ n.unit }}</span>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div v-html="svgRawContent[prop]" class="mt-12 flex svg-box" />
                </div>

                <div v-html="svgGithubIcon" class="mt-12 grid-col-start-1 flex svg-box" />
                <div v-html="svgGridIcon" class="mt-12 flex svg-box" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRun } from "@/common/composables/useRun"
import svgGithubIcon from "@@/assets/icons/data-statis/github.svg?raw"
import svgGridIcon from "@@/assets/icons/data-statis/grid.svg?raw"

defineOptions({ name: "Overview" })

const { years, runRecords, analysisRunData } = useRun()

type RawKeys = ReturnType<typeof analysisRunData>

const svgRawContent = ref<Record<string, string>>({})

/** 批量加载svg */
async function loadSvgs() {
    try {
        const modules = import.meta.glob(`../../common/assets/icons/data-statis/github_*.svg`, { eager: true, import: "default", query: "?raw" })
        for (const path in modules) {
            const svgModule = modules[path]
            const year = path.replace(/.*\/github_(\d+)\.svg$/, "$1")
            svgRawContent.value[year] = svgModule as string
        }
    } catch (error) {
        console.error(`Failed to load SVG:`, error)
    }
}
loadSvgs()

const indexList = ref([
    {
        label: "总里程",
        key: "totalDistance",
        type: "number",
        unit: "KM",
        icon: "https://api.iconify.design/arcticons:weekly-runs.svg",
        iconBg: "bg-#E8EAF0"
    },
    {
        label: "总次数",
        key: "totalRuns",
        unit: "次",
        type: "number",
        icon: "https://api.iconify.design/radix-icons:counter-clockwise-clock.svg",
        iconBg: "bg-#E8EAF0"
    },
    { label: "平均配速", key: "avgPace", type: "text", unit: "", icon: "https://api.iconify.design/bi:speedometer2.svg", iconBg: "bg-#E8EAF0" },
    {
        label: "平均心率",
        key: "avgHeartRate",
        type: "number",
        unit: "",
        icon: "https://api.iconify.design/material-symbols:favorite.svg",
        iconBg: "bg-#E8EAF0"
    }
] as const)

const indexData = ref<Record<string, RawKeys>>({})

indexData.value.total = analysisRunData(runRecords)
onMounted(() => {
    years.forEach((value, key) => {
        indexData.value[key] = analysisRunData(value)
    })
    console.log("🚀 ~ indexData:", indexData.value, years)
})
</script>

<style scoped>
.svg-box {
    @apply w-auto h-auto mb-24;
}
</style>
