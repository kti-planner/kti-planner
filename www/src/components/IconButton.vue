<script setup lang="ts">
const {
    icon,
    position = 'static',
    disabled = false,
} = defineProps<{
    icon: string;
    position?: 'static' | 'absolute' | undefined;
    disabled?: boolean | undefined;
}>();

const emit = defineEmits<{
    click: [];
}>();
</script>

<template>
    <button type="button" class="btn" :style="{ position }" :disabled="disabled" @click="emit('click')">
        <i class="bi" :class="`bi-${icon}`"></i>
    </button>
</template>

<style scoped lang="scss">
.btn {
    --bs-btn-font-size: inherit;
    vertical-align: inherit;
    border: 0;
    --bs-btn-hover-border-color: transparent;
    --bs-btn-active-border-color: transparent;
    --bs-btn-disabled-border-color: transparent;
    --bs-btn-padding-x: 0;
    --bs-btn-padding-y: 0;
}
</style>
