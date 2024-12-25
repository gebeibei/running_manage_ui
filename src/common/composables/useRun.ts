/* eslint-disable unused-imports/no-unused-vars */
import data from "@/data/activities.json"
import { RUN_TITLES } from "@@/constants/const"
import { cloneDeep } from "lodash-es"

export type Coordinate = [number, number]

export type RunIds = Array<number> | []

export interface RunRecord {
    id: number
    origin: Activity
    startDate: string
    distance: string
    paceParts: string | null
    heartRate: string | undefined
    runTime: string
    moment: string
    location: {
        province: string
        city: string
        district: string
    }
    address: string
}

export interface Activity {
    run_id: number
    name: string
    distance: number
    moving_time: string
    type: string
    start_date: string
    start_date_local: string
    location_country?: string | null
    summary_polyline?: string | null
    average_heartrate?: number | null
    average_speed: number
    streak: number
}

export interface ListConfig {
    pageNum?: number
    pageSize?: number
    dates?: Array<string>
    distance?: number
    heartRate?: number
    pace?: number
    address?: string
    runTime?: string
};

const formatPace = (d: number) => {
    if (Number.isNaN(d)) return "0"
    const pace = (1000.0 / 60.0) * (1.0 / d)
    const minutes = Math.floor(pace)
    const seconds = Math.floor((pace - minutes) * 60.0)
    return `${minutes}'${seconds.toFixed(0).toString().padStart(2, "0")}"`
}

const convertMovingTime2Sec = (moving_time: string) => {
    if (!moving_time) return 0
    const splits = moving_time.split(", ")
    const days = splits.length === 2 ? Number.parseInt(splits[0]) : 0
    const time = splits.splice(-1)[0]
    const [hours, minutes, seconds] = time.split(":").map(Number)
    const totalSeconds = ((days * 24 + hours) * 60 + minutes) * 60 + seconds
    return totalSeconds
}

const formatRunTime = (moving_time: string) => {
    const totalSeconds = convertMovingTime2Sec(moving_time)
    const seconds = totalSeconds % 60
    const minutes = (totalSeconds - seconds) / 60
    if (minutes === 0) {
        return `${seconds}s`
    }
    return `${minutes}min`
}

const titleForRun = (run: Activity) => {
    const runDistance = run.distance / 1000
    const runHour = +run.start_date_local.slice(11, 13)
    if (runDistance > 20 && runDistance < 40) {
        return RUN_TITLES.HALF_MARATHON_RUN_TITLE
    }
    if (runDistance >= 40) {
        return RUN_TITLES.FULL_MARATHON_RUN_TITLE
    }
    if (runHour >= 0 && runHour <= 10) {
        return RUN_TITLES.MORNING_RUN_TITLE
    }
    if (runHour > 10 && runHour <= 14) {
        return RUN_TITLES.MIDDAY_RUN_TITLE
    }
    if (runHour > 14 && runHour <= 18) {
        return RUN_TITLES.AFTERNOON_RUN_TITLE
    }
    if (runHour > 18 && runHour <= 21) {
        return RUN_TITLES.EVENING_RUN_TITLE
    }
    return RUN_TITLES.NIGHT_RUN_TITLE
}

/**
 * 跑步记录数据
 */
const runRecords = cloneDeep(data)
    .reverse()
    .map((item: Activity) => {
        let location: { province: string, city: string, district: string } = {
            province: "",
            city: "",
            district: ""
        }
        item.location_country = item.location_country?.replace(/'/g, "\"").replace(/None/g, `null`)

        try {
            location = JSON.parse(item?.location_country as any) || {}
        } catch (error) {
            console.log("🚀 ~ runRecords ~ error:", error, item)
        }

        return {
            id: item.run_id,
            origin: cloneDeep(item),
            startDate: item.start_date_local,
            distance: (item.distance / 1000).toFixed(2),
            paceParts: item.average_speed ? formatPace(item.average_speed) : null,
            heartRate: item.average_heartrate?.toFixed(0),
            runTime: formatRunTime(item.moving_time),
            moment: titleForRun(item),
            location,
            address: `${location.province || ""}${location.city}${location.district || ""}`
        }
    })

export const useRun = () => {
    const total = ref(runRecords.length)
    const years: Map<string, RunRecord[]> = new Map()
    const provinces = new Map()

    const getDetailById = (id: number) => {
        return runRecords.find(item => item.id == id)
    }

    /**
     * 根据检索条件搜索数据
     * @param {object} props 检索条件
     * @param {number} props.pageNum 页码
     * @param {number} props.pageSize 每页条数
     * @param { Array } props.dates 日期列表
     * @param {number} props.distance 距离
     * @param {number} props.heartRate 心率
     * @param {number} props.pace 配速
     * @param {string} props.address 地址
     * @param {string} props.runTime 跑步时间
     * @returns { Array<RunRecord> } 跑步记录列表
     */
    const getList = (props: ListConfig = {}) => {
        const { pageNum = 15, pageSize = 1, dates = [], distance, heartRate, pace, address, runTime } = props
        const targetDataList = runRecords.filter((item) => {
            const flags = []
            if (dates.length) {
                flags.push(+new Date(item.startDate) >= +new Date(dates[0]) && +new Date(item.startDate) <= +new Date(dates[1]))
            }

            if (distance) {
                flags.push(item.origin.distance / 1000 >= distance)
            }

            if (heartRate) {
                item.origin.average_heartrate && flags.push(item.origin.average_heartrate >= heartRate)
            }

            if (pace) {
                item.paceParts && flags.push(+item.paceParts.replace("'", ":").replace("\"", "") <= pace)
            }

            if (address) {
                flags.push(item.address.includes(address))
            }

            if (runTime) {
                flags.push(item.runTime >= runTime)
            }

            return flags.every(item => item)
        })

        total.value = targetDataList.length

        return targetDataList.slice((pageNum - 1) * pageSize, pageNum * pageSize)
    }

    const analysisRunData = (list: RunRecord[]) => {
        let totalDistance = 0
        let pace = 0
        let paceNullCount = 0
        let heartRate = 0
        let heartRateNullCount = 0
        let totalMetersAvail = 0
        let totalSecondsAvail = 0

        list.forEach((item) => {
            const run = item.origin
            totalDistance += Number(run.distance)

            if (run.average_speed) {
                pace += run.average_speed
                totalMetersAvail += run.distance || 0
                totalSecondsAvail += (run.distance || 0) / run.average_speed
            } else {
                paceNullCount++
            }
            if (run.average_heartrate) {
                heartRate += run.average_heartrate
            } else {
                heartRateNullCount++
            }
        })

        const avgHeartRate = list.length === heartRateNullCount ? "" : (heartRate / (list.length - heartRateNullCount)).toFixed(0)

        return {
            totalRuns: list.length,
            avgPace: formatPace(totalDistance / totalSecondsAvail),
            avgHeartRate,
            totalDistance: (totalDistance / 1000).toFixed(0)
        }
    }

    const groupAllData = () => {
        runRecords.forEach((run) => {
            const year = run.startDate.slice(0, 4)
            const province = run.location.province
            if (years.has(year)) {
                years.get(year)?.push(run)
            } else {
                years.set(year, [run])
            }
            if (provinces.has(province)) {
                provinces.get(province).push(run)
            } else {
                provinces.set(province, [run])
            }
        })
    }

    return {
        total,
        runRecords,
        years,
        provinces,
        getList,
        getDetailById,
        analysisRunData,
        groupAllData
    }
}
