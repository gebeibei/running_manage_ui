<template>
    <div class="app-container">
        <div class="bg-white p-24 wh-full">
            <div class="w-50%">
                <el-form ref="formRef" :model="formData" label-position="top" label-suffix="：">
                    <el-form-item label="距离" prop="eventType">
                        <el-select v-model="formData.eventType" placeholder="请选择">
                            <el-option :label="item.name" :value="item.type" v-for="item in EVENT_DISTANCE" :key="item.type"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间(hh:mm:ss)" prop="time">
                        <el-input v-model="formData.time" placeholder="请输入">
                            <template #suffix>
                                <img src="https://api.iconify.design/material-symbols:alarm-outline-rounded.svg" />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="配速(mm:ss)" prop="pace">
                        <el-input v-model="formData.pace" placeholder="请输入">
                            <template #suffix>
                                <img src="https://api.iconify.design/material-symbols:speed-rounded.svg" />
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">
                            查询
                        </el-button>
                        <el-button @click="reset()">
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
import { EVENT_DISTANCE } from "@@/constants/const"
import { getDict } from "@@/utils/utils"

defineOptions({ name: "VDot" })
// https://api.iconify.design/material-symbols:alarm-outline-rounded.svg

// const TYPE_DISTANCE = getDict<typeof EVENT_DISTANCE, "type", "distance">(EVENT_DISTANCE, "type", "distance")
const TYPE_NAME = getDict<typeof EVENT_DISTANCE, "type", "name">(EVENT_DISTANCE, "type", "name")

const formRef = ref<FormInstance>()
const { searchCondition: formData, reset } = useReset({
    eventType: TYPE_NAME.FULL_MARATHON,
    time: "",
    pace: ""
})

const handleSearch = () => {
    console.log("🚀 ~ handleSearch ~ formData:", formData)
}
</script>

<style lang="scss" scoped></style>
