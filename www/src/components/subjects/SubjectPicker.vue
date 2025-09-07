<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { SubjectData } from '@components/subjects/types';

const model = defineModel<SubjectData[]>('selected', { default: [] });

const { subjects } = defineProps<{
    subjects: SubjectData[];
}>();

const selectedSubjectIds = ref(new Set<string>());

watchEffect(() => {
    model.value = subjects.filter(group => selectedSubjectIds.value.has(group.id));
});
</script>

<template>
    <div v-if="subjects && subjects.length > 0" class="d-flex flex-wrap gap-2">
        <template v-for="subject in subjects" :key="subject.id">
            <input
                :id="subject.id"
                v-model="selectedSubjectIds"
                :value="subject.id"
                type="checkbox"
                class="btn-check"
                autocomplete="off"
            />
            <label
                class="btn group-btn"
                :class="selectedSubjectIds.has(subject.id) ? 'btn-success' : 'btn-light'"
                :for="subject.id"
            >
                {{ subject.name }}
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
