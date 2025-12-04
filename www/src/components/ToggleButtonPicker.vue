<script setup lang="ts" generic="T extends { id: string }">
import { computed } from 'vue';

const model = defineModel<T[]>({ required: true });

const {
    options,
    center = false,
    fullWidthOptions = false,
} = defineProps<{
    options: Readonly<Record<string, T>>;
    center?: boolean | undefined;
    colors?: Record<string, string>;
    fullWidthOptions?: boolean | undefined;
}>();

const selectedIds = computed(() => new Set<string>(model.value.map(item => item.id)));

function onChange(event: Event, value: T): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
        return;
    }

    if (target.checked) {
        if (!model.value.find(item => item.id === value.id)) {
            model.value.push(value);
        }
    } else {
        const index = model.value.findIndex(item => item.id === value.id);

        if (index !== -1) {
            model.value.splice(index, 1);
        }
    }
}

const toggleBtnId = crypto.randomUUID();
</script>

<template>
    <div class="hstack flex-wrap gap-2" :class="{ 'justify-content-center': center }">
        <div v-for="(value, label) in options" :key="value.id" :class="{ 'w-100': fullWidthOptions }">
            <input
                :id="`${toggleBtnId}-${value.id}`"
                type="checkbox"
                class="btn-check"
                autocomplete="off"
                :checked="selectedIds.has(value.id)"
                @change="event => onChange(event, value)"
            />
            <label
                :for="`${toggleBtnId}-${value.id}`"
                class="btn"
                :class="{
                    'btn-success': selectedIds.has(value.id) && !colors,
                    'btn-light': !selectedIds.has(value.id),
                    'btn-highlight': colors !== null,
                    'btn-colored': selectedIds.has(value.id) && colors,
                    'w-100': fullWidthOptions,
                }"
                :style="{
                    '--str-color': colors ? colors[value.id] : undefined,
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

.btn-highlight {
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        display: block;
        position: absolute;
        width: 10px;
        top: 0;
        left: 0;
        bottom: 0;
        background-color: var(--str-color);
    }
}

.btn-colored {
    color: white !important;
    background-color: var(--str-color) !important;
    border-color: var(--str-color) !important;
}
</style>
