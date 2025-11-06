<script setup lang="ts">
import { computed } from 'vue';
import { langId } from '@components/frontend/lang';
import { formatClassroomName } from '@components/classrooms/types';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import { makeSubjectStudyDetails, type SubjectData } from '@components/subjects/types';

const translations = {
    'en': {
        'Group': 'Group',
        'Teacher': 'Teacher',
        'Classroom': 'Classroom',
        'Unknown [teacher]': 'Unknown',
    },
    'pl': {
        'Group': 'Grupa',
        'Teacher': 'Nauczyciel',
        'Classroom': 'Sala',
        'Unknown [teacher]': 'Nieznany',
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
        (subject ? `${subject.fullName}\n${makeSubjectStudyDetails(subject, langId)}\n` : '') +
        `${laboratoryClass.exercise.exerciseNumber}. ${laboratoryClass.exercise.name}\n` +
        `${translate('Group')}: ${laboratoryClass.laboratoryGroup.name}\n` +
        `${translate('Teacher')}: ${laboratoryClass.teacher?.name ?? translate('Unknown [teacher]')}\n` +
        `${translate('Classroom')}: ${formatClassroomName(laboratoryClass.exercise.classroom, langId)}`,
);
</script>

<template>
    <div class="event-content" :title>
        <p class="text-truncate">{{ timeText }}</p>
        <p v-if="subject" class="text-truncate fw-bold">
            {{ subject.fullName }}
        </p>
        <p v-if="!hideExerciseName" class="text-truncate" :class="{ 'fw-bold': !subject }">
            {{ `${laboratoryClass.exercise.exerciseNumber}. ${laboratoryClass.exercise.name}` }}
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
            <span class="ms-1">{{ formatClassroomName(laboratoryClass.exercise.classroom, langId) }}</span>
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
