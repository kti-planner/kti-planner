<script setup lang="ts">
const id = crypto.randomUUID();
</script>

<template>
    <div :id class="accordion">
        <slot></slot>
    </div>
</template>
