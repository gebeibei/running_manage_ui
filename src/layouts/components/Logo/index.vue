<template>
    <div class="layout-logo-container" :class="{ 'collapse': props.collapse, 'layout-mode-top': isTop }">
        <transition name="layout-logo-fade">
            <router-link v-if="props.collapse" key="collapse" to="/">
                <img :src="logo" class="layout-logo">
            </router-link>
            <router-link v-else key="expand" to="/">
                <img :src="logoText" class="layout-logo-text">
            </router-link>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import logoText from "@@/assets/images/layouts/logo-text-3.png?url"
import logo from "@@/assets/images/running_bg.png?url"
import { useLayoutMode } from "@@/composables/useLayoutMode"

interface Props {
    collapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    collapse: true
})

const { isTop } = useLayoutMode()
</script>

<style lang="scss" scoped>
.layout-logo-container {
    position: relative;
    width: 100%;
    height: var(--v3-header-height);
    line-height: var(--v3-header-height);
    text-align: center;
    overflow: hidden;
    .layout-logo {
        display: none;
    }
    .layout-logo-text {
        height: 100%;
        vertical-align: middle;
    }
}

.layout-mode-top {
    height: var(--v3-navigationbar-height);
    line-height: var(--v3-navigationbar-height);
}

.collapse {
    .layout-logo {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        display: inline-block;
    }
    .layout-logo-text {
        display: none;
    }
}
</style>
