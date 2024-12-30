import dayjs from "dayjs"

const INVALID_DATE = "N/A"

/** 格式化日期时间, template默认为YYYY-MM-DD HH:mm:ss */
export function formatDateTime(datetime: string | number | Date = "", template: string = "YYYY-MM-DD HH:mm:ss") {
    const day = dayjs(datetime)
    return day.isValid() ? day.format(template) : INVALID_DATE
}
