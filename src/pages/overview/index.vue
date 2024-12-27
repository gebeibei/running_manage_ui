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
                                :value="indexData[item.key] as number"
                                class="font-bold f-24 c-font op-90 lh-24px"
                            />
                            <span class="f-16 lh-24px font-400 c-font op-90">{{ item.unit }}</span>
                        </div>
                        <div class="font-bold f-24 c-font op-90 lh-24px" v-else>
                            {{ indexData[item.key as keyof typeof indexData] }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="com-shadow bg-white p-24 m-t-24 grid grid-cols-2">
                <div v-for="(run, idx) in years" :key="idx" class="mb-24">
                    <div class="com-header">
                        {{ run[0] }}
                    </div>

                    <div class="f-c gap-col-24">
                        <template v-for="n in indexList" :key="n.key">
                            <div class="f-c" v-if="indexData[run[0] as '2024']?.[n.key]">
                                <div class="com-info-label">
                                    {{ n.label }} :
                                </div>
                                <div class="com-info-value empty">
                                    {{ indexData[run[0] as '2024']?.[n.key] }}
                                    <span>{{ n.unit }}</span>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div v-html="svgRawContent[run[0] as '2024']" class="mt-12 w-100%" />
                </div>

                <div v-html="svgGithubIcon" class="mt-12 grid-col-start-1 w-100%" />
                <div v-html="svgGridIcon" class="mt-12 w-100%" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRun } from "@/common/composables/useRun"
import svgGithubIcon from "@@/assets/icons/data-statis/github.svg?raw"
import svgGridIcon from "@@/assets/icons/data-statis/grid.svg?raw"

defineOptions({ name: "Overview" })

const { runRecords, years, analysisRunData, groupAllData } = useRun()

type CurrentYear = "2024"
type RawKeys = ReturnType<typeof analysisRunData>

const svgRawContent = ref<Record<string, string>>({})
async function loadSvgByYear(year: string) {
    try {
        // 根据年份动态生成SVG文件名
        const svgFileName = `github_${year}.svg`
        // 动态导入SVG文件并获取原始字符串
        const svgModule = await import(`../../common/assets/icons/data-statis/${svgFileName}?raw`)
        svgRawContent.value[year as string] = svgModule.default
    } catch (error) {
        console.error(`Failed to load SVG for year ${year}:`, error)
    }
}

const indexList = ref<{ label: string, key: keyof RawKeys, type: string, unit: string, icon: string, iconBg: string }[]>([
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
])

const indexData = ref<RawKeys & { [x in CurrentYear]?: RawKeys }>({
    totalDistance: "",
    totalRuns: 0,
    avgPace: "",
    avgHeartRate: ""
})

indexData.value = analysisRunData(runRecords)
groupAllData()
years.forEach((value, key) => {
    indexData.value[key as CurrentYear] = analysisRunData(value)
    loadSvgByYear(key)
})
</script>
