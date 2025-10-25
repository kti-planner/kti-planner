<script setup lang="ts">
import { computed } from 'vue';
import { langId } from '@components/frontend/lang';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { SubjectData } from '@components/subjects/types';

const translations = {
    'en': {
        'Group': 'Group',
        'Teacher': 'Teacher',
        'Classroom': 'Classroom',
        'Unknown [teacher]': 'Unknown',
        'Unknown [classroom]': 'Unknown',
    },
    'pl': {
        'Group': 'Grupa',
        'Teacher': 'Nauczyciel',
        'Classroom': 'Sala',
        'Unknown [teacher]': 'Nieznany',
        'Unknown [classroom]': 'Nieznana',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { laboratoryClass, subject, hideExerciseName } = defineProps<{
    timeText: string;
    laboratoryClass: LaboratoryClassData;
    subject?: SubjectData | undefined;
    hideExerciseName?: boolean | undefined;
}>();

const title = computed(
    () =>
        (subject ? `${subject.name}\n` : '') +
        `${laboratoryClass.exercise.name}\n` +
        `${translate('Group')}: ${laboratoryClass.laboratoryGroup.name}\n` +
        `${translate('Teacher')}: ${laboratoryClass.teacher?.name ?? translate('Unknown [teacher]')}\n` +
        `${translate('Classroom')}: ${laboratoryClass.exercise.classroom?.name ?? translate('Unknown [classroom]')}`,
);
</script>

<template>
    <div class="event-content" :title>
        <p class="text-truncate">{{ timeText }}</p>
        <p v-if="subject" class="text-truncate fw-bold">
            {{ subject.name }}
        </p>
        <p v-if="!hideExerciseName" class="text-truncate" :class="{ 'fw-bold': !subject }">
            {{ laboratoryClass.exercise.name }}
        </p>
        <div class="text-truncate">
            <i class="bi bi-people-fill"></i>
            <span class="ms-1">{{ laboratoryClass.laboratoryGroup.name }}</span>
        </div>
        <div class="text-truncate">
            <i class="bi bi-person-fill"></i>
            <span class="ms-1">{{ laboratoryClass.teacher?.name ?? translate('Unknown [teacher]') }}</span>
        </div>
        <div class="text-truncate">
            <i class="bi bi-building-fill"></i>
            <span class="ms-1">{{ laboratoryClass.exercise.classroom?.name ?? translate('Unknown [classroom]') }}</span>
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
