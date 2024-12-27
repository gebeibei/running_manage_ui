## 简介

running_manage_ui 以[v3-admin-vite](https://github.com/un-pany/v3-admin-vite)为模板， 致力于打造出自己的跑步数据展示管理平台。

## 使用

<details>
<summary>推荐环境</summary>

<br>

- 新版 `Visual Studio Code`
- 安装 `.vscode/extensions.json` 文件中推荐的插件
- `node` 20.x 或 22+
- `pnpm` 9+

</details>

<details>
<summary>本地开发</summary>

<br>

```bash
# 进入项目目录
cd running_manage_ui

# 安装依赖
pnpm i

# 启动服务
pnpm dev
```

</details>

<details>
<summary>打包构建</summary>

<br>

```bash
# 打包构建预发布环境
pnpm build:staging

# 打包构建生产环境
pnpm build
```

</details>

<details>
<summary>本地预览</summary>

<br>

```bash
# 先执行打包构建命令生成 dist 目录后再执行以下预览命令
pnpm preview
```

</details>

<details>
<summary>代码检查</summary>

<br>

```bash
# 代码校验与格式化
pnpm lint

# 单元测试
pnpm test
```

</details>

<details>
<summary>代码提交规范</summary>

<br>

`feat` 新功能

`fix` 修复错误

`perf` 优化

`refactor` 重构代码

`docs` 文档和注释

`types` 类型相关

`test` 单测相关

`ci` 持续集成、工作流

`revert` 撤销更改

`chore` 琐事（更新依赖、修改配置等）

</details>

## 特性

**结构精简**：没有复杂的封装，没有复杂的类型体操，刚好够用

**详细的注释**：各个配置项都写有尽可能详细的注释

**最新的依赖**: 及时更新所有三方依赖至最新版

**有一点规范**: 代码风格统一、命名风格统一、注释风格统一

## 内置功能

**用户管理**：登录、登出演示

**权限管理**：页面级权限（动态路由）、按钮级权限（指令权限、权限函数）、路由守卫

**多环境**：开发环境（development）、预发布环境（staging）、生产环境（production）

**多主题**：普通、黑暗、深蓝, 三种主题模式

**多布局**：左侧、顶部、混合, 三种布局模式

**首页**：根据不同用户显示不同的 Dashboard 页面

**错误页**: 403、404

**兼容移动端**: 布局兼容移动端页面分辨率

**其他**：SVG 雪碧图、动态侧边栏、动态面包屑、标签页快捷导航、内容区放大与全屏、组合式函数

## 技术栈

**Vue3**：采用 Vue3 + script setup 最新的 Vue3 组合式 API

**Element Plus**：Element UI 的 Vue3 版本

**Pinia**: 传说中的 Vuex5

**Vite**：真的很快

**Vue Router**：路由路由

**TypeScript**：JavaScript 语言的超集

**pnpm**：更快速的，节省磁盘空间的包管理工具

**Scss**：和 Element Plus 保持一致

**CSS 变量**：主要控制项目的布局和颜色

**ESlint**：代码校验与格式化

**Axios**：发送网络请求（已封装好）

**UnoCSS**：具有高性能且极具灵活性的即时原子化 CSS 引擎

**handraw**: https://handraw.top/
