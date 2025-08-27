<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';

const model = defineModel<LaboratoryGroupData[]>('selected', { default: [] });

const { groups } = defineProps<{
    groups: LaboratoryGroupData[];
}>();

const selectedGroupIds = ref(new Set<string>());

watchEffect(() => {
    model.value = groups.filter(group => selectedGroupIds.value.has(group.id));
});
</script>

<template>
    <div v-if="groups && groups.length > 0" class="d-flex flex-wrap gap-2">
        <template v-for="group in groups" :key="group.id">
            <input
                :id="group.id"
                v-model="selectedGroupIds"
                :value="group.id"
                type="checkbox"
                class="btn-check"
                autocomplete="off"
            />
            <label
                class="btn group-btn"
                :class="selectedGroupIds.has(group.id) ? 'btn-success' : 'btn-light'"
                :for="group.id"
            >
                {{ group.name }}
            </label>
        </template>
    </div>
</template>

<style scoped lang="scss">
.group-btn:hover {
    color: var(--bs-btn-hover-color);
    background-color: var(--bs-btn-hover-bg);
    border-color: var(--bs-btn-hover-border-color);
}
</style>
