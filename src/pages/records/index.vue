<template>
    <div class="app-container">
        <el-card v-loading="loading" shadow="never" class="search-wrapper">
            <el-form ref="searchFormRef" :model="searchCondition">
                <div class="grid grid-cols-4 gap-x-24">
                    <el-form-item prop="username" label="用户名">
                        <el-input placeholder="请输入最小配速(mm:ss)" v-model="searchCondition.pace" />
                    </el-form-item>
                    <el-form-item prop="phone" label="手机号">
                        <el-input placeholder="请输入最小心率" v-model="searchCondition.heartRate" />
                    </el-form-item>
                    <el-form-item label="距离">
                        <el-input placeholder="请输入最小距离" v-model="searchCondition.distance">
                            <template #suffix>
                                KM
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="运动时长">
                        <el-input placeholder="请输入最小运动时长(hh:mm:ss)" v-model="searchCondition.runTime" />
                    </el-form-item>
                    <el-form-item label="运动日期">
                        <el-date-picker
                            type="daterange"
                            end-placeholder="结束日期"
                            start-placeholder="开始日期"
                            v-model="searchCondition.dates"
                        />
                    </el-form-item>
                    <el-form-item label="地点">
                        <el-input placeholder="请输入关键词" v-model="searchCondition.address" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="handleSearch">
                            查询
                        </el-button>
                        <el-button :icon="Refresh" @click="resetSearch">
                            重置
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-card>
        <el-card v-loading="loading" shadow="never">
            <div class="table-wrapper">
                <el-table :data="tableData" height="100%">
                    <el-table-column prop="moment" label="Moment" show-overflow-tooltip />
                    <el-table-column prop="startDate" label="Date" show-overflow-tooltip />
                    <el-table-column prop="distance" label="KM" show-overflow-tooltip />
                    <el-table-column prop="paceParts" label="Pace" show-overflow-tooltip />
                    <el-table-column prop="heartRate" label="BPM" show-overflow-tooltip />
                    <el-table-column prop="runTime" label="Time" show-overflow-tooltip />
                    <el-table-column prop="address" label="Address" show-overflow-tooltip />
                    <el-table-column label="操作" width="160" show-overflow-tooltip>
                        <template #default="{ row }">
                            <el-button link type="primary" @click="toView(row)">
                                详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pager-wrapper">
                <el-pagination
                    background
                    :layout="paginationData.layout"
                    :page-sizes="paginationData.pageSizes"
                    :total="paginationData.total"
                    :page-size="paginationData.pageSize"
                    :current-page="paginationData.currentPage"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus"
import { useReset } from "@/common/composables/useReset"
import { useRun } from "@/common/composables/useRun"
import { usePagination } from "@@/composables/usePagination"
import { Refresh, Search } from "@element-plus/icons-vue"

defineOptions({
    // 命名当前组件
    name: "Records"
})

const router = useRouter()
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const { total, getList } = useRun()

// #region 查
const tableData = ref<ReturnType<typeof getList>>([])
const searchFormRef = ref<FormInstance | null>(null)
const { searchCondition, reset } = useReset({
    pace: null,
    distance: null,
    heartRate: null,
    runTime: "",
    address: "",
    dates: []
})
function getTableData() {
    loading.value = true
    tableData.value = getList({ ...searchCondition, pageNum: paginationData.currentPage, pageSize: paginationData.pageSize } as any)
    paginationData.total = total.value
    loading.value = false
}
function handleSearch() {
    paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
function resetSearch() {
    reset()
    searchFormRef.value?.resetFields()
    handleSearch()
}
// #endregion

const toView = (row: any) => {
    router.push({
        path: "/recordDetail",
        query: { id: row.id }
    })
}

// 监听分页参数的变化
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<style lang="scss" scoped>
.search-wrapper {
    margin-bottom: 20px;
    :deep(.el-card__body) {
        padding-bottom: 2px;
    }
}

.toolbar-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.table-wrapper {
    margin-bottom: 20px;
}

.pager-wrapper {
    display: flex;
    justify-content: flex-end;
}
</style>
