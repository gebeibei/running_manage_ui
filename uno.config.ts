import presetRemToPx from "@unocss/preset-rem-to-px"
import { defineConfig, presetAttributify, presetUno, transformerVariantGroup } from "unocss"

export default defineConfig({
    shortcuts: [
        {
            "wh-full": "w-full h-full",
            /** 水平居中 */
            "x-center": "absolute left-50% translate-x--50%",
            /** 垂直 */
            "y-center": "absolute top-50% translate-y--50%",
            /** 水平垂直居中 */
            "x-y-center": "absolute top-50% left-50% translate-x--50% translate-y--50%",
            "flex-col": "flex flex-col",
            "text-ellipsis": "truncate",
            "flex-0-auto": "shrink-0 grow-0 flex-basis-auto",
            "flex-x-auto": "flex-auto w-0",
            "flex-y-auto": "flex-auto h-0"
        },
        [/^((is|hint)-)?empty$/, () => "empty:before:content-empty"],
        [/^(text-)?ellipsis$/, () => "truncate"],
        [/^text-ellipsis-(\d+)$/, ([, lines]) => `line-clamp-${lines} break-all`],
        // 同时集成水平或者垂直方向的margin、padding
        // m-v-120 --> m-t-120 m-b-120  m-h-120 --> m-l-120 m-r-120
        // m-y-120 --> m-t-120 m-b-120  m-x-120 --> m-l-120 m-r-120
        // p-v-120 --> p-t-120 p-b-120  p-h-120 --> p-l-120 p-r-120
        // p-y-120 --> p-t-120 p-b-120  p-x-120 --> p-l-120 p-r-120
        [
            /^(m|p)-([vhxy])-(\d+)$/,
            ([, key, direction, d]) => {
                const keyMap = {
                    h: ["l", "r"],
                    v: ["t", "b"],
                    x: ["l", "r"],
                    y: ["t", "b"]
                }
                const dir = keyMap[direction as keyof typeof keyMap]
                return `${key}-${dir[0]}-${d} ${key}-${dir[1]}-${d}`
            }
        ],
        // 集成flex布局的样式
        // f-c-c --> flex items-center justify-center
        [
            /^f-(([cse])(-([cseba]))*)$/,
            ([, , g1, , g2]) => {
                let style = ``
                const temps = [
                    { k: "c", v: "center" },
                    { k: "s", v: "start" },
                    { k: "e", v: "end" },
                    { k: "b", v: "between" },
                    { k: "a", v: "around" }
                ]

                const r1 = temps.find(i => i.k === g1)
                style = `flex items-${r1?.v || "center"}`

                if (g2) {
                    const r2 = temps.find(i => i.k === g2)
                    style += ` justify-${r2?.v || "center"}`
                }

                return style
            }
        ]
    ],
    transformers: [transformerVariantGroup()],
    presets: [
        presetUno(),
        presetAttributify(),
        presetRemToPx({ baseFontSize: 4 }) as any
    ],
    rules: [
        [
            /^f-(\d+)$/,
            ([, d]) => {
                return { "font-size": `${d}px` }
            }
        ],
        [
            "line-clamp-more",
            { "overflow": "hidden", "display": "-webkit-box", "-webkit-line-clamp": "var(--line-clamp, 2)", "-webkit-box-orient": "vertical" }
        ],
        [
            /^calc-(m?w|m?h)-(\d+)$/,
            ([, hor, d]) => ({ [{ w: "width", h: "height", mw: "max-width", mh: "max-height" }[hor] as string]: `calc(100% - ${d}px)` })
        ],
        ["content-empty", { content: `"- -"` }]
    ],
    theme: {
        colors: {

        }
    }
})
