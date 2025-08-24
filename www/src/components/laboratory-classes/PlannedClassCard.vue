<script setup lang="ts">
import { formatDateLocalHhMm, formatDateLocalYyyyMmDd } from '@components/utils';
import type { PlannedClass } from '@components/laboratory-classes/GenerateClassesForm.vue';

defineProps<{
    plannedClass: PlannedClass;
}>();
</script>

<template>
    <div class="card">
        <div class="card-body">
            <h3 class="card-title fs-6">
                {{ `${plannedClass.exercise.exerciseNumber}. ${plannedClass.exercise.name}` }}
            </h3>
            <h4 class="card-subtitle mb-2 text-body-secondary fs-6">
                {{
                    `${formatDateLocalYyyyMmDd(plannedClass.start)} ${formatDateLocalHhMm(plannedClass.start)} - ${formatDateLocalHhMm(plannedClass.end)}`
                }}
            </h4>
            <div class="d-flex gap-1">
                <i class="bi bi-person-fill"></i>
                <span>{{ plannedClass.exercise.teacher.name }}</span>
            </div>
            <div class="d-flex gap-1">
                <i class="bi bi-building-fill"></i>
                <span>{{ plannedClass.exercise.classroom.name }}</span>
            </div>
        </div>
    </div>
</template>
