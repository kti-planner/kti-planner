<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import type { ClassroomData } from '@components/classrooms/types';
import type { ExerciseData } from '@components/exercises/types';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { ScheduleChangeData, SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserData } from '@components/users/types';
import AddExercise from '@components/exercises/AddExercise.vue';
import GenerateClasses from '@components/laboratory-classes/GenerateClasses.vue';
import LaboratoryGroupListModal from '@components/laboratory-groups/LaboratoryGroupListModal.vue';
import EditSubject from '@components/subjects/EditSubject.vue';
import SubjectCalendar from '@components/subjects/SubjectCalendar.vue';
import ToggleButtonPicker from '@components/ToggleButtonPicker.vue';

const translations = {
    'en': {
        'Laboratory groups': 'Laboratory groups',
        'Exercises': 'Exercises',
        'Teachers': 'Teachers',
    },
    'pl': {
        'Laboratory groups': 'Grupy laboratoryjne',
        'Exercises': 'Ćwiczenia',
        'Teachers': 'Prowadzący',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { subject, semester, laboratoryGroups } = defineProps<{
    subject: SubjectData;
    semester: SemesterData;
    allUsers: UserData[];
    exercises: ExerciseData[];
    classrooms: ClassroomData[];
    laboratoryGroups: LaboratoryGroupData[];
    nextExerciseNumber: number;
    scheduleChanges: ScheduleChangeData[];
}>();

const selectedLaboratoryGroups = ref<LaboratoryGroupData[]>([]);
const calendar = useTemplateRef('calendar');
const subjectUrl = computed(() => `/semesters/${semester.slug}/subjects/${subject.slug}`);

const laboratoryGroupOptions = computed(() => Object.fromEntries(laboratoryGroups.map(group => [group.name, group])));
</script>

<template>
    <h1 class="text-center fs-4 mb-3">
        {{ subject.name }}
        <EditSubject v-if="currentUser" :semester :subject :all-users />
    </h1>
    <div class="row g-4">
        <div class="col-12 col-lg-9 mb-2 order-2 order-lg-1">
            <SubjectCalendar
                ref="calendar"
                :api-url="`${subjectUrl}/api/laboratory-classes/`"
                :selected-laboratory-groups
                :schedule-changes
                :semester
                :subject
                :teachers="subject.teachers"
            />
        </div>
        <div class="col-12 col-lg-3 order-1 order-lg-2 d-flex gap-4 flex-column-reverse flex-lg-column">
            <div>
                <h2 class="text-center fs-5">
                    {{ translate('Laboratory groups') }}
                    <LaboratoryGroupListModal
                        v-if="currentUser"
                        :groups="laboratoryGroups"
                        :api-url="`${subjectUrl}/api/laboratory-groups/`"
                    />
                </h2>
                <ToggleButtonPicker v-model="selectedLaboratoryGroups" :options="laboratoryGroupOptions" />
                <GenerateClasses
                    v-if="currentUser"
                    :initial-group="
                        selectedLaboratoryGroups.length === 1 ? (selectedLaboratoryGroups[0] ?? null) : null
                    "
                    :exercises
                    :semester
                    :laboratory-groups
                    :schedule-changes
                    :api-url="`${subjectUrl}/api/laboratory-classes/`"
                    class="d-block mx-auto mt-3"
                    @done="calendar?.refreshClasses()"
                />
            </div>
            <div>
                <h2 class="text-center fs-5">{{ translate('Exercises') }}</h2>
                <div v-if="exercises.length > 0" class="exercises-list list-group mx-auto">
                    <a
                        v-for="exercise in exercises"
                        :key="exercise.id"
                        :href="`${subjectUrl}/${exercise.exerciseNumber}/`"
                        class="list-group-item list-group-item-action"
                    >
                        {{ `${exercise.exerciseNumber}. ${exercise.name}` }}
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
        </div>
    </div>
    <h2 class="fs-5">
        {{ translate('Teachers') }}
    </h2>
    <ul>
        <li v-for="teacher in subject.teachers" :key="teacher.id">{{ teacher.name }} &lt;{{ teacher.email }}&gt;</li>
    </ul>
</template>

<style scoped lang="scss">
.exercises-list {
    max-width: 600px;
}
</style>
