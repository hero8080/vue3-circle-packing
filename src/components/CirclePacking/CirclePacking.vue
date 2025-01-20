<script setup lang="ts">
import * as d3Hierarchy from 'd3-hierarchy'
import { onMounted, ref, watch } from 'vue'
// import data from './data.json'

// import { CirclePacking } from '@antv/g2plot/src/index.ts'
interface IData {
  name?: string
  value: number
}

interface IProps {
  animate?: boolean
  data: IData[]
}

const props = withDefaults(defineProps<IProps>(), {
  animate: false,
  data() {
    return []
  },
})

const container = ref()

const renderNodeList = ref([])

function getNodeList(nodes) {
  const nodeList = []
  if (!Array.isArray(nodes)) {
    return nodeList
  }
  nodes.forEach((node) => {
    const { children } = node
    const childrenNode = getNodeList(children)
    const { depth, height, r, value, x, y, data } = node

    nodeList.push({ depth, height, r, value, x, y, data }, ...childrenNode)
  })
  return nodeList
}

function initChart(data: any) {
  const packLayout = (data) =>
    d3Hierarchy
      .pack()
      .size([container.value.offsetHeight - 20, container.value.offsetHeight - 20])
      .padding(6)(
      d3Hierarchy
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.depth - a.depth),
    )
  const root = packLayout(data)
  const nodeList = getNodeList([root])
  renderNodeList.value = nodeList.slice(1)
}

function getStyle(item) {
  const itemSize = container.value.offsetHeight - 20
  const offsetWidth = container.value.offsetWidth - 20
  const scaleX = offsetWidth / itemSize
  return {
    left: item.x * scaleX + 20 / 2 + 'px',
    top: item.y + 20 / 2 + 5 + 'px',
    width: item.r * 2 + 'px',
    height: item.r * 2 + 'px',
  }
}

function getDelay() {
  const range = [0.2, 1]
  const delay = Number(range[1] + Math.random() * range[1] - range[0])
  return {
    'animation-delay': `${delay}s`,
  }
}

onMounted(() => {
  initChart({
    name: 'root',
    children: props.data,
  })
})

watch(
  () => props.data,
  () => {
    initChart({
      name: 'root',
      children: props.data,
    })
  },
)
</script>

<template>
  <div ref="container" style="width: 100%; height: 100%; position: relative">
    <template v-for="(item, index) in renderNodeList" :key="index">
      <div class="circle-item" style="position: absolute" :style="getStyle(item)">
        <div class="circle-item-child" :class="{ animate: animate }" :style="getDelay()">
          <slot v-bind="{ item: item, index, data: renderNodeList }"></slot>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.circle-item {
  border-radius: 1000px;
  transform: translate(-50%, -50%);
}

.circle-item-child {
  position: absolute;
  border-radius: 1000px;
  width: 100%;
  height: 100%;
}

.animate {
  animation-name: float;
  animation-duration: 3s; /* 动画持续时间 */
  animation-iteration-count: infinite; /* 无限循环 */
  animation-timing-function: ease-in-out; /* 平滑加速减速 */
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px); /* 向上移动20像素 */
  }
  100% {
    transform: translateY(0);
  }
}
</style>
