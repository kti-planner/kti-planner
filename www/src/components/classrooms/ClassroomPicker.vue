<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { ClassroomData } from '@components/classrooms/types';

const model = defineModel<ClassroomData[]>('selected', { default: [] });

const { classrooms } = defineProps<{
    classrooms: ClassroomData[];
}>();

const selectedClassroomIds = ref(new Set<string>());

watchEffect(() => {
    model.value = classrooms.filter(group => selectedClassroomIds.value.has(group.id));
});
</script>

<template>
    <div v-if="classrooms && classrooms.length > 0" class="d-flex flex-wrap gap-2">
        <template v-for="classroom in classrooms" :key="classroom.id">
            <input
                :id="classroom.id"
                v-model="selectedClassroomIds"
                :value="classroom.id"
                type="checkbox"
                class="btn-check"
                autocomplete="off"
            />
            <label
                class="btn group-btn"
                :class="selectedClassroomIds.has(classroom.id) ? 'btn-success' : 'btn-light'"
                :for="classroom.id"
            >
                {{ classroom.name }}
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
