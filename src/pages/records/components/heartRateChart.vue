<template>
    <div class="line-chart-box">
        <div ref="heartRateRef"></div>
    </div>
</template>

<script lang="ts" setup>
const { id } = defineProps<{ id: number }>()

// 使用echarts绘制心率的曲线图
const heartRateRef = ref()

const { getHeartRateDataBId } = useRun()
getHeartRateDataBId(id)
</script>

<style lang="scss" scoped></style>
