<script setup lang="ts">
import { computed, ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import type { ClassroomData } from '@components/classrooms/types';
import type { ExerciseData } from '@components/exercises/types';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserData } from '@components/users/types';
import AddExercise from '@components/exercises/AddExercise.vue';
import GenerateClasses from '@components/laboratory-classes/GenerateClasses.vue';
import LaboratoryGroupList from '@components/laboratory-groups/LaboratoryGroupList.vue';
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

const { subject, semester } = defineProps<{
    subject: SubjectData;
    semester: SemesterData;
    allUsers: UserData[];
    exercises: ExerciseData[];
    classrooms: ClassroomData[];
    nextExerciseNumber: number;
}>();

const selectedLaboratoryGroups = ref<LaboratoryGroupData[]>([]);
const subjectUrl = computed(() => `/semesters/${semester.slug}/${subject.slug}`);
</script>

<template>
    <h1 class="text-center fs-4 mb-3">
        {{ subject.name }}
        <EditSubject v-if="currentUser" :semester :subject :all-users />
    </h1>
    <div class="row g-4">
        <div class="col-12 col-lg-9 mb-2 order-2 order-lg-1">
            <SubjectCalendar />
        </div>
        <div class="col-12 col-lg-3 order-1 order-lg-2 d-flex gap-3 flex-column-reverse flex-lg-column">
            <div>
                <LaboratoryGroupList
                    v-model="selectedLaboratoryGroups"
                    :api-url="`${subjectUrl}/api/laboratory-groups/`"
                />
                <GenerateClasses
                    v-if="currentUser"
                    :group="selectedLaboratoryGroups.length === 1 ? (selectedLaboratoryGroups[0] ?? null) : null"
                    :exercises
                    :semester
                    class="mt-3"
                />
            </div>
            <div>
                <h2 class="text-center fs-5">{{ translate('Exercises') }}</h2>
                <div class="exercises-list list-group mx-auto my-2">
                    <a
                        v-for="exercise in exercises"
                        :key="exercise.id"
                        :href="`${subjectUrl}/${exercise.exerciseNumber}/`"
                        class="list-group-item list-group-item-action"
                    >
                        {{ `${exercise.exerciseNumber}. ${exercise.name}` }}
                    </a>
                </div>
                <div v-if="currentUser !== null" class="my-2">
                    <AddExercise :semester :subject :classrooms :next-exercise-number />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.exercises-list {
    max-width: 600px;
}
</style>
