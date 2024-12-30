<template>
    <div class="app-container">
        <div class="bg-white p-24 wh-full grid grid-cols-2">
            <div>
                <el-form ref="formRef" :model="formData" label-position="top" label-suffix="：">
                    <el-form-item label="年份" prop="year">
                        <el-select v-model="formData.year" placeholder="请选择">
                            <el-option
                                :label="item.label" :value="item.value" v-for="item in timeOptions"
                                :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="formData.type" placeholder="请选择">
                            <el-option
                                :label="item.label" :value="item.value" v-for="item in typeOptions"
                                :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="formData.title" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="运动员" prop="athlete">
                        <el-input v-model="formData.athlete" placeholder="请输入"></el-input>
                    </el-form-item>

                    <div class="com-info-value com-shadow rd-4 p-16 mb-24 bg-#E8EAF0">
                        {{ cmdStr }}
                    </div>

                    <el-form-item>
                        <el-button type="primary" @click="copy(cmdStr)" v-if="isSupported">
                            <!-- by default, `copied` will be reset in 1.5s -->
                            {{ !copied ? '复制' : '已复制' }}
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
import { getDict } from "@@/utils/utils"
import { useClipboard } from "@vueuse/core"

defineOptions({ name: "GenerateSvgScript" })

const { years } = useRun()
const timeOptions: { label: string, value: string }[] = []
years.forEach((_value, key) => {
    timeOptions.push({
        label: `${key}年`,
        value: key
    })
})
const typeOptions = [
    { label: "网格", value: "grid" },
    // { label: "日历", value: "calendar" },
    // { label: "圆形", value: "circular" },
    { label: "Github风格", value: "github" }
] as const
const TYPE_LV = getDict<typeof typeOptions, "label", "value">(typeOptions, "label", "value")

const formRef = ref<FormInstance>()
const { searchCondition: formData, reset } = useReset({
    year: timeOptions[0].value,
    type: TYPE_LV["Github风格"],
    title: `${timeOptions[0].value} Running`,
    athlete: "gebeibei"
})

const cmdStr = computed(() => {
    return `python run_page/gen_svg.py --from-db --year ${formData.year} --title "${formData.title}" --type ${formData.type} --athlete "${formData.athlete}" --special-distance 10 --special-distance2 20 --special-color yellow --special-color2 red --output src/common/assets/icons/data-statis/${formData.type}_${formData.year}.svg --use-localtime --min-distance 0.5`
})
const { copy, copied, isSupported } = useClipboard({ source: cmdStr.value })
</script>
