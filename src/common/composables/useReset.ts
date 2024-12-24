import { cloneDeep, isFunction } from "lodash-es"

/**
 * @description 表格检索重置相关的hook
 * @template T
 * @param { T } defaultCondition 包含搜索框各个字段和默认值的对象
 * @date 2022-10-27
 */
export const useReset = <T extends object>(defaultCondition: T) => {
    /** @type { T } */
    const searchCondition = reactive(cloneDeep(defaultCondition))

    /**
     * @description 重置传入对象
     * @param { Function } callback 重置后的回调
     * @date 2023-03-13
     */
    // eslint-disable-next-line ts/no-unsafe-function-type
    const reset = (callback: Function = () => {}) => {
        Object.assign(searchCondition, cloneDeep(defaultCondition))

        if (callback && isFunction(callback)) callback()
    }

    return {
        searchCondition,
        reset
    }
}
