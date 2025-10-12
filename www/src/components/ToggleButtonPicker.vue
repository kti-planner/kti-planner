<script setup lang="ts" generic="T extends { id: string }">
import { ref, useId, watchEffect } from 'vue';

const model = defineModel<T[]>({ required: true });

const { options } = defineProps<{
    options: Readonly<Record<string, T>>;
}>();

const selectedIds = ref(new Set<string>());

watchEffect(() => {
    model.value = Object.entries(options)
        .map(([_, option]) => option)
        .filter(option => selectedIds.value.has(option.id));
});

const toggleBtnId = useId();
</script>

<template>
    <div class="hstack flex-wrap justify-content-center gap-2">
        <div v-for="(value, label) in options" :key="value.id">
            <input
                :id="`${toggleBtnId}-${value.id}`"
                v-model="selectedIds"
                :value="value.id"
                type="checkbox"
                class="btn-check"
                autocomplete="off"
            />
            <label
                :for="`${toggleBtnId}-${value.id}`"
                class="btn"
                :class="selectedIds.has(value.id) ? 'btn-success' : 'btn-light'"
                >{{ label }}</label
            >
        </div>
    </div>
</template>

<style scoped lang="scss">
.btn:hover {
    color: var(--bs-btn-hover-color);
    background-color: var(--bs-btn-hover-bg);
    border-color: var(--bs-btn-hover-border-color);
}
</style>
