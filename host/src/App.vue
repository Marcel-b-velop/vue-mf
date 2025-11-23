<script setup lang="ts"></script>

<template>
  <div>
    <div class="mb-8 flex flex-row justify-around gap-4">
      <h1 class="text-2xl font-bold">Host</h1>
    </div>
    <nav class="flex gap-4 mb-8">
      <RouterLink class="btn rounded-border btn-primary bg-primary p-4" to="/">Go to Home</RouterLink>
      <RouterLink class="btn rounded-border btn-primary bg-primary p-4" to="/about">Go to About</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped></style>

