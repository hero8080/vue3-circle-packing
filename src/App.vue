<script setup lang="ts">
import CirclePacking from '@/components/CirclePacking/CirclePacking.vue'
</script>

<template>
  <div style="width: 100%;height: 100%;background-color: darkgray;display: flex;align-items: center;justify-content: center;">
    <div style="width: 500px;height: 300px;background-color: white">
      <CirclePacking animate>
        <template #default="{item}">
          {{item}}
        </template>
      </CirclePacking>
    </div>
  </div>
</template>

