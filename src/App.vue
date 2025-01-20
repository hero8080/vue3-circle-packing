<script setup lang="ts">
import CirclePacking from '@/components/CirclePacking/CirclePacking.vue'
</script>

<template>
  <div style="width: 100%;height: 100%;background-color: darkgray;display: flex;align-items: center;justify-content: center;">
    <div style="width: 500px;height: 300px;background-color: white">
      <CirclePacking animate>
        <template #default="{item}">
          <div style="width: 100%;height: 100%;background-color: dodgerblue;border-radius: 50%"></div>
        </template>
      </CirclePacking>
    </div>
  </div>
</template>

