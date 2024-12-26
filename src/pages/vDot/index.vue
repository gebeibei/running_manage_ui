<template>
    <div class="app-container">
        <div class="bg-white p-24 wh-full">
            <div class="w-50%">
                <el-form ref="formRef" :model="formData" label-position="top" label-suffix="：">
                    <el-form-item label="距离" prop="eventType">
                        <el-select v-model="formData.eventType" placeholder="请选择">
                            <el-option
                                :label="item.name" :value="item.type" v-for="item in EVENT_DISTANCE"
                                :key="item.type"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间(hh:mm:ss)" prop="time">
                        <el-input v-model="formData.time" placeholder="请输入" :disabled="!!formData.pace">
                            <template #suffix>
                                <img src="https://api.iconify.design/material-symbols:alarm-outline-rounded.svg" />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="配速(mm:ss)" prop="pace">
                        <el-input v-model="formData.pace" placeholder="请输入" :disabled="!!formData.time">
                            <template #suffix>
                                <img src="https://api.iconify.design/material-symbols:speed-rounded.svg" />
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">
                            查询
                        </el-button>
                        <el-button @click="onReset">
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus"
import { useReset } from "@/common/composables/useReset"
import { formatDateTime } from "@/common/utils/datetime"
import { formatPace } from "@/common/utils/utils"
import { EVENT_DISTANCE } from "@@/constants/const"
import { getDict } from "@@/utils/utils"

defineOptions({ name: "VDot" })

const TYPE_DISTANCE = getDict<typeof EVENT_DISTANCE, "type", "distance">(EVENT_DISTANCE, "type", "distance")
const TYPE_FORMAT = getDict<typeof EVENT_DISTANCE, "type", "format">(EVENT_DISTANCE, "type", "format")
const NAME_TYPE = getDict<typeof EVENT_DISTANCE, "name", "type">(EVENT_DISTANCE, "name", "type")

const formRef = ref<FormInstance>()
const { searchCondition: formData, reset } = useReset({
    eventType: NAME_TYPE["全程马拉松"],
    time: "",
    pace: ""
})
const onReset = () => {
    const eventType = formData.eventType
    reset()
    formData.eventType = eventType
}

const handleSearch = () => {
    console.log("🚀 ~ handleSearch ~ formData:", formData)

    if (formData.time && !formData.pace) {
        calcPaceByTime()
    }

    if (formData.pace && !formData.time) {
        calcTimeByPace()
    }
}

// 根据时间计算配速
const calcPaceByTime = () => {
    const time = formData.time
    // 格式化时间为秒
    const timeArr = time.split(":")
    if (!timeArr.length) return
    const format = `yyyy-MM-dd ${TYPE_FORMAT[formData.eventType][Math.abs(timeArr.length - 3)]}`
    const currentDay = formatDateTime(new Date(), "yyyy-MM-dd")
    const timeStr = `${currentDay} ${timeArr.map(n => n.padStart(2, "0")).join(":")}`
    const timeTotal = +new Date(formatDateTime(timeStr, format)) - +new Date(`${currentDay} 00:00:00`)
    // 距离
    const distance = TYPE_DISTANCE[formData.eventType] * 1000
    // 计算配速
    const pace = formatPace(Math.floor(distance / timeTotal))?.replace(/'|"/g, ":")
    console.log("🚀 ~ calcPaceByTime ~ Math.floor(distance / timeTotal):", distance, timeTotal)

    formData.pace = pace
}

// 根据配速计算时间
const calcTimeByPace = () => {
    const pace = formData.pace
    // 格式化时间为秒
    const paceArr = pace.split(":")
    let paceTotal
    if (paceArr.length == 2) {
        // 分秒
        paceTotal = Number(paceArr[0]) * 60 + Number(paceArr[1])
    } else if (paceArr.length == 1) {
        // 分
        paceTotal = Number(paceArr[0]) * 60
    } else {
        return
    }
    // 距离
    const distance = TYPE_DISTANCE[formData.eventType] * 1000
    // 计算时间
    const time = formatPace(Math.floor(paceTotal * distance / 1000))
    formData.time = time
}
</script>

<style lang="scss" scoped></style>
