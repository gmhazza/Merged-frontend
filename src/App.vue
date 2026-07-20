<script setup>
import Navbar from './components/navbar.vue'
import { RouterView } from 'vue-router'
</script>


<template>
  <Navbar  />
  <RouterView style="max-height: 90vh; min-height: 90vh;" />
</template>

<style scoped>
</style>