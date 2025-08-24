<script setup lang="ts">
import type { LaboratoryClassData } from '@components/laboratory-classes/types';

defineProps<{
    timeText: string;
    title: string;
    laboratoryClass: LaboratoryClassData;
}>();
</script>

<template>
    <div class="event-content" :title>
        <p>{{ timeText }}</p>
        <p>
            <b>
                {{ laboratoryClass.exercise.name }}
            </b>
        </p>
        <div class="d-flex gap-1">
            <i class="bi bi-people-fill"></i>
            <span>{{ laboratoryClass.laboratoryGroup.name }}</span>
        </div>
        <div class="d-flex gap-1">
            <i class="bi bi-person-fill"></i>
            <span>{{ laboratoryClass.teacher.name }}</span>
        </div>
        <div class="d-flex gap-1">
            <i class="bi bi-building-fill"></i>
            <span>{{ laboratoryClass.exercise.classroom.name }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.event-content {
    width: 100%;

    p {
        margin: 0;
    }

    p,
    span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
