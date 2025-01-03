/* eslint-disable unused-imports/no-unused-vars */
import data from "@/data/activities.json"
import { cloneDeep } from "lodash-es"
import { formatPace, formatRunTime, titleForRun } from "../utils/utils"

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

/**
 * 跑步记录数据
 */
const runRecords = cloneDeep(data)
    .reverse()
    .map((item: Activity) => {
        let location: RunRecord["location"] = {
            province: "",
            country: "",
            city: "",
            district: ""
        }
        item.location_country = item.location_country?.replace(/'/g, "\"").replace(/None/g, `null`)

        try {
            location = JSON.parse(item?.location_country as any || "{}")
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

let hasGrouped = false
export const useRun = () => {
    const total = ref(runRecords.length)
    const years: Map<string, RunRecord[]> = new Map()
    const provinces: Set<string> = new Set()
    const countries: Set<string> = new Set()

    const getDetailById = (id: number) => {
        return runRecords.find(item => item.id == id)
    }

    const getHeartRateDataBId = async (id: number) => {
        try {
            const response = await fetch(`../../../GPX_OUT/${id}.gpx`)
            const gpxData = await response.text()

            // 解析GPX数据
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(gpxData, "text/xml")
            const trackPoints = xmlDoc.querySelectorAll("trkpt")

            // 提取心率数据
            const heartRates: number[] = []
            console.log("🚀 ~ trackPoints.forEach ~ hr:", trackPoints[0].querySelector("gpxtpx\\:hr"))
            trackPoints.forEach((point) => {
                const hr = point.querySelector("gpxtpx\\:hr")
                if (hr && hr.textContent) {
                    heartRates.push(Number.parseInt(hr.textContent))
                }
            })
            // console.log("🚀 ~ getHeartRateDataBId ~ heartRates:", heartRates)
            return heartRates
        } catch (error) {
            console.error("Error fetching GPX data:", error)
            return []
        }
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

    /** 按照年份、国家、省份对跑步数据进行分组 */
    const groupAllData = () => {
        runRecords.forEach((run) => {
            const year = run.startDate.slice(0, 4)
            const { province, country } = run.location
            if (years.has(year)) {
                const _temp = years.get(year)
                const target = _temp?.find(item => item.id === run.id)
                if (!target) years.get(year)?.push(run)
            } else {
                years.set(year, [run])
            }
            if (province) provinces.add(province)
            if (country) countries.add(country)
        })
    }
    if (!hasGrouped) {
        groupAllData()
        hasGrouped = true
    }

    return {
        total,
        runRecords,
        years,
        provinces: [...provinces],
        countries: [...countries],
        getList,
        getDetailById,
        getHeartRateDataBId,
        analysisRunData,
        groupAllData
    }
}
