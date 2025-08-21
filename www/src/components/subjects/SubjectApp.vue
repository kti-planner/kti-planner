<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import type { ClassroomData } from '@components/classrooms/types';
import type { ExerciseData } from '@components/exercises/types';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserData } from '@components/users/types';
import AddExercise from '@components/exercises/AddExercise.vue';
import EditSubject from '@components/subjects/EditSubject.vue';
import SubjectCalendar from '@components/subjects/SubjectCalendar.vue';

const translations = {
    'en': {
        'Exercises': 'Exercises',
    },
    'pl': {
        'Exercises': 'Ćwiczenia',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

defineProps<{
    subject: SubjectData;
    semester: SemesterData;
    isLoggedIn: boolean;
    allUsers: UserData[];
    exercises: ExerciseData[];
    classrooms: ClassroomData[];
    nextExerciseNumber: number;
}>();

const url = window.location.pathname;
</script>

<template>
    <h1 class="text-center fs-4 mb-3">
        {{ subject.name }}
        <EditSubject v-if="isLoggedIn" :semester :subject :all-users />
    </h1>
    <div class="row g-4">
        <div class="col-12 col-lg-9 mb-2 order-2 order-lg-1">
            <SubjectCalendar />
        </div>
        <div class="col-12 col-lg-3 order-1 order-lg-2">
            <h2 class="text-center fs-5">{{ translate('Exercises') }}</h2>
            <div class="exercises-list list-group mx-auto my-2">
                <a
                    v-for="exercise in exercises"
                    :key="exercise.id"
                    :href="`${url}${exercise.exerciseNumber}/`"
                    class="list-group-item list-group-item-action"
                >
                    {{ `${exercise.exerciseNumber}. ${exercise.name}` }}
                </a>
            </div>
            <div v-if="isLoggedIn" class="my-2">
                <AddExercise :semester :subject :classrooms :next-exercise-number />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.exercises-list {
    max-width: 600px;
}
</style>
