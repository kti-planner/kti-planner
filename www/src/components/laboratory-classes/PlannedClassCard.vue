<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import { formatDateLocalHhMm, formatDateLocalYyyyMmDd } from '@components/utils';
import type { PlannedClass } from '@components/laboratory-classes/GenerateClassesForm.vue';

const translations = {
    'en': {
        'Unknown [teacher]': 'Unknown',
        'Unknown [classroom]': 'Unknown',
    },
    'pl': {
        'Unknown [teacher]': 'Nieznany',
        'Unknown [classroom]': 'Nieznana',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

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
            <div>
                <i class="bi bi-person-fill"></i>
                <span class="ms-1">{{ plannedClass.exercise.teacher?.name ?? translate('Unknown [teacher]') }}</span>
            </div>
            <div>
                <i class="bi bi-building-fill"></i>
                <span class="ms-1">{{
                    plannedClass.exercise.classroom?.name ?? translate('Unknown [classroom]')
                }}</span>
            </div>
        </div>
    </div>
</template>
