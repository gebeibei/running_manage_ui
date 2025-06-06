// const
const MAPBOX_TOKEN
    // For security reasons, please avoid using the default public token provided by Mapbox as much as possible.
    // Instead, manually add a new token and apply URL restrictions.
    // (please refer to https://github.com/yihong0618/running_page/issues/643#issuecomment-2042668580)
    = "pk.eyJ1IjoieWlob25nMDYxOCIsImEiOiJja2J3M28xbG4wYzl0MzJxZm0ya2Fua2p2In0.PNKfkeQwYuyGOTT_x9BJ4Q"
const MUNICIPALITY_CITIES_ARR = [
    "北京市",
    "上海市",
    "天津市",
    "重庆市",
    "香港特别行政区",
    "澳门特别行政区"
]
const MAP_LAYER_LIST = [
    "road-label",
    "waterway-label",
    "natural-line-label",
    "natural-point-label",
    "water-line-label",
    "water-point-label",
    "poi-label",
    "airport-label",
    "settlement-subdivision-label",
    "settlement-label",
    "state-label",
    "country-label"
]

const USE_GOOGLE_ANALYTICS = false
const GOOGLE_ANALYTICS_TRACKING_ID = ""

// styling: set to `true` if you want dash-line route
const USE_DASH_LINE = true
// styling: route line opacity: [0, 1]
const LINE_OPACITY = 0.4
// styling: map height
const MAP_HEIGHT = "600px"
// set to `false` if you want to hide the road label characters
const ROAD_LABEL_DISPLAY = true
// set to `true` if you want to display only the routes without showing the map.
const PRIVACY_MODE = false
// set to `false` if you want to make light off as default, only effect when `PRIVACY_MODE` = false
const LIGHTS_ON = true

// IF you outside China please make sure IS_CHINESE = false
const IS_CHINESE = true
const USE_ANIMATION_FOR_GRID = false
const CHINESE_INFO_MESSAGE = (yearLength: number, year: string): string => {
    const yearStr = year === "Total" ? "所有" : ` ${year} `
    return `我用 App 记录自己跑步 ${yearLength} 年了，下面列表展示的是${yearStr}的数据`
}
const ENGLISH_INFO_MESSAGE = (yearLength: number, year: string): string =>
    `Running Journey with ${yearLength} Years, the table shows year ${year} data`

// not support English for now
const CHINESE_LOCATION_INFO_MESSAGE_FIRST
    = "我跑过了一些地方，希望随着时间推移，地图点亮的地方越来越多"
const CHINESE_LOCATION_INFO_MESSAGE_SECOND = "不要停下来，不要停下奔跑的脚步"

const INFO_MESSAGE = IS_CHINESE ? CHINESE_INFO_MESSAGE : ENGLISH_INFO_MESSAGE
const FULL_MARATHON_RUN_TITLE = IS_CHINESE ? "全程马拉松" : "Full Marathon"
const HALF_MARATHON_RUN_TITLE = IS_CHINESE ? "半程马拉松" : "Half Marathon"
const MORNING_RUN_TITLE = IS_CHINESE ? "清晨跑步" : "Morning Run"
const MIDDAY_RUN_TITLE = IS_CHINESE ? "午间跑步" : "Midday Run"
const AFTERNOON_RUN_TITLE = IS_CHINESE ? "午后跑步" : "Afternoon Run"
const EVENING_RUN_TITLE = IS_CHINESE ? "傍晚跑步" : "Evening Run"
const NIGHT_RUN_TITLE = IS_CHINESE ? "夜晚跑步" : "Night Run"

const RUN_TITLES = {
    FULL_MARATHON_RUN_TITLE,
    HALF_MARATHON_RUN_TITLE,
    MORNING_RUN_TITLE,
    MIDDAY_RUN_TITLE,
    AFTERNOON_RUN_TITLE,
    EVENING_RUN_TITLE,
    NIGHT_RUN_TITLE
}

export {
    CHINESE_LOCATION_INFO_MESSAGE_FIRST,
    CHINESE_LOCATION_INFO_MESSAGE_SECOND,
    GOOGLE_ANALYTICS_TRACKING_ID,
    INFO_MESSAGE,
    IS_CHINESE,
    LIGHTS_ON,
    LINE_OPACITY,
    MAP_HEIGHT,
    MAP_LAYER_LIST,
    MAPBOX_TOKEN,
    MUNICIPALITY_CITIES_ARR,
    PRIVACY_MODE,
    ROAD_LABEL_DISPLAY,
    RUN_TITLES,
    USE_ANIMATION_FOR_GRID,
    USE_DASH_LINE,
    USE_GOOGLE_ANALYTICS
}

const nike = "rgb(224,237,94)" // if you want change the main color change here src/styles/variables.scss
const dark_vanilla = "rgb(228,212,220)"

// If your map has an offset please change this line
// issues #92 and #198
export const NEED_FIX_MAP = false
export const MAIN_COLOR = nike
export const PROVINCE_FILL_COLOR = "#47b8e0"
export const COUNTRY_FILL_COLOR = dark_vanilla

/** 常见的锻炼距离 */
export const EVENT_DISTANCE = ([
    {
        distance: 42.195,
        type: "FULL_MARATHON",
        name: "全程马拉松",
        format: ["HH:mm:ss", "HH:mm:00", "hh:00:00"]
    },
    {
        distance: 21.0975,
        type: "HALF_MARATHON",
        name: "半程马拉松",
        format: ["HH:mm:ss", "HH:mm:00", "hh:00:00"]
    },
    {
        distance: 1,
        type: "KM_1",
        name: "1KM",
        format: ["HH:mm:ss", "00:mm:ss", "00:mm:00"]
    },
    {
        distance: 3,
        type: "KM_3",
        name: "3KM",
        format: ["HH:mm:ss", "00:mm:ss", "00:mm:00"]
    },
    {
        distance: 5,
        type: "KM_5",
        name: "5KM",
        format: ["HH:mm:ss", "00:mm:ss", "00:mm:00"]
    },
    {
        distance: 10,
        type: "KM_10",
        name: "10KM",
        format: ["HH:mm:ss", "00:mm:ss", "00:mm:00"]
    }
    // {
    //     distance: 0.4,
    //     type: "M_400",
    //     name: "400M"
    // },
    // {
    //     distance: 0.8,
    //     type: "M_800",
    //     name: "800M"
    // },
    // {
    //     distance: 1.5,
    //     type: "M_1500",
    //     name: "1500M"
    // }
]) as const
