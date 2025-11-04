<script setup lang="ts" generic="T extends { id: string }">
import { ref, watchEffect } from 'vue';

const model = defineModel<T[]>({ required: true });

const {
    options,
    center = false,
    colors = {},
} = defineProps<{
    options: Readonly<Record<string, T>>;
    center?: boolean;
    colors?: Record<string, string>;
}>();

const selectedIds = ref(new Set<string>(model.value.map(item => item.id)));

watchEffect(() => {
    model.value = Object.entries(options)
        .map(([_, option]) => option)
        .filter(option => selectedIds.value.has(option.id));
});

const toggleBtnId = crypto.randomUUID();
</script>

<template>
    <div class="hstack flex-wrap gap-2" :class="{ 'justify-content-center': center }">
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
                :class="{
                    'btn-success': selectedIds.has(value.id) && !(value.id in colors),
                    'btn-light': !selectedIds.has(value.id),
                    'btn-colored': selectedIds.has(value.id) && value.id in colors,
                }"
                :style="{
                    '--str-color': colors[value.id],
                }"
                >{{ label }}</label
            >
        </div>
    </div>
</template>

<style scoped lang="scss">
.btn-light:hover {
    color: var(--bs-btn-hover-color);
    background-color: var(--bs-btn-hover-bg);
    border-color: var(--bs-btn-hover-border-color);
}

.btn-colored {
    color: white !important;
    background-color: var(--str-color) !important;
}
</style>
