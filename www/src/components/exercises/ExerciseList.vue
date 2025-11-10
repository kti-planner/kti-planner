<script setup lang="ts">
import { computed } from 'vue';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import { useApiFetch } from '@components/api';
import type { ClassroomData } from '@components/classrooms/types';
import type { ExerciseData } from '@components/exercises/types';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import AddExercise from '@components/exercises/AddExercise.vue';

const translations = {
    'en': {
        'Laboratory groups': 'Laboratory groups',
        'Exercises': 'Exercises',
        'Teachers': 'Teachers',
        'Teacher email': 'Teacher email',
        'No course ID in subject data': 'No course ID in subject data',
    },
    'pl': {
        'Laboratory groups': 'Grupy laboratoryjne',
        'Exercises': 'Ćwiczenia',
        'Teachers': 'Prowadzący',
        'Teacher email': 'Email prowadzącego',
        'No course ID in subject data': 'Brak ID kursu w danych przedmiotu',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { subject, semester } = defineProps<{
    subject: SubjectData;
    semester: SemesterData;
    exercises: ExerciseData[];
    classrooms: ClassroomData[];
    nextExerciseNumber: number;
}>();

const subjectUrl = computed(() => `/semesters/${semester.slug}/subjects/${subject.slug}`);

const { data: laboratoryClasses, execute: refreshClasses } = useApiFetch<LaboratoryClassData[]>(
    `/api/subjects/${subject.id}/laboratory-classes/`,
);

const exerciseDateRanges = computed(() => {
    const dateRanges = new Map<string, { start: Date; end: Date }>();

    if (!laboratoryClasses.value) {
        return dateRanges;
    }

    for (const laboratoryClass of laboratoryClasses.value) {
        const start = new Date(laboratoryClass.startDate);
        const end = new Date(laboratoryClass.endDate);

        const range = dateRanges.get(laboratoryClass.exercise.id);
        if (range) {
            if (start.getTime() < range.start.getTime()) {
                range.start = start;
            }

            if (end.getTime() > range.end.getTime()) {
                range.end = end;
            }
        } else {
            dateRanges.set(laboratoryClass.exercise.id, { start, end });
        }
    }

    return dateRanges;
});

defineExpose({
    refreshClasses,
});
</script>

<template>
    <div>
        <h2 class="text-center fs-5">{{ translate('Exercises') }}</h2>
        <div v-if="exercises.length > 0" class="exercises-list list-group mx-auto">
            <a
                v-for="exercise in exercises"
                :key="exercise.id"
                :href="`${subjectUrl}/${exercise.exerciseNumber}/`"
                class="list-group-item list-group-item-action"
            >
                <div>{{ `${exercise.exerciseNumber}. ${exercise.name}` }}</div>
                <template v-if="exerciseDateRanges.has(exercise.id)">
                    <div>
                        <i class="bi bi-calendar2-event"></i>
                        {{
                            `${exerciseDateRanges.get(exercise.id)!.start.toLocaleDateString('pl-PL')} - ${exerciseDateRanges.get(exercise.id)!.end.toLocaleDateString('pl-PL')}`
                        }}
                    </div>
                </template>
            </a>
        </div>
        <AddExercise
            v-if="currentUser"
            :semester
            :subject
            :classrooms
            :next-exercise-number
            class="d-block mx-auto mt-3"
        />
    </div>
</template>
