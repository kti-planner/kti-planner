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
        <p class="text-truncate">{{ timeText }}</p>
        <p class="text-truncate fw-bold">
            {{ laboratoryClass.exercise.name }}
        </p>
        <div class="text-truncate">
            <i class="bi bi-people-fill"></i>
            <span class="ms-1">{{ laboratoryClass.laboratoryGroup.name }}</span>
        </div>
        <div class="text-truncate">
            <i class="bi bi-person-fill"></i>
            <span class="ms-1">{{ laboratoryClass.teacher.name }}</span>
        </div>
        <div class="text-truncate">
            <i class="bi bi-building-fill"></i>
            <span class="ms-1">{{ laboratoryClass.exercise.classroom.name }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.event-content {
    width: 100%;

    p {
        margin: 0;
    }
}
</style>
