<script setup lang="ts">
import { computed, ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPatch, apiPost } from '@components/api';
import type { ClassroomData } from '@components/classrooms/types';
import type { ExerciseCreateApiData, ExerciseData, ExerciseEditApiData } from '@components/exercises/types';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserPublicData } from '@components/users/types';
import UserSelector from '@components/users/UserSelector.vue';

const props = defineProps<{
    semester: SemesterData;
    subject: SubjectData;
    exercise?: Partial<ExerciseData>;
    classrooms: ClassroomData[];
}>();

const isEditing = computed(() => props.exercise?.id !== undefined);

const submitFailed = ref(false);

const exerciseName = ref<string | undefined>(props.exercise?.name);
const exerciseNumber = ref<number | undefined>(props.exercise?.exerciseNumber);
const exerciseClassroomId = ref<string | undefined>(props.exercise?.classroom?.id);
const teacher = ref<UserPublicData | null>(props.exercise?.teacher ?? props.subject.teachers[0] ?? null);

async function submit() {
    if (
        exerciseName.value === undefined ||
        exerciseNumber.value === undefined ||
        exerciseClassroomId.value === undefined ||
        teacher.value?.id === undefined
    ) {
        return;
    }

    const success =
        props.exercise?.id === undefined
            ? await apiPost<boolean>('/semesters/api/exercises/', {
                  name: exerciseName.value,
                  exerciseNumber: exerciseNumber.value,
                  subjectId: props.subject.id,
                  classroomId: exerciseClassroomId.value,
                  teacherId: teacher.value.id,
              } satisfies ExerciseCreateApiData)
            : await apiPatch<boolean>('/semesters/api/exercises/', {
                  id: props.exercise.id,
                  name: exerciseName.value,
                  exerciseNumber: exerciseNumber.value,
                  classroomId: exerciseClassroomId.value,
                  teacherId: teacher.value.id,
              } satisfies ExerciseEditApiData);

    if (success === undefined) {
        return;
    }

    submitFailed.value = !success;

    if (success) {
        const newUrl = `/semesters/${props.semester.slug}/subjects/${props.subject.slug}/${exerciseNumber.value}/`;

        if (isEditing.value) {
            window.history.replaceState({}, '', newUrl);
            window.location.reload();
        } else {
            window.location.assign(newUrl);
        }
    }
}

const translations = {
    'en': {
        'Exercise number': 'Exercise number',
        'Exercise name': 'Exercise name',
        'Teacher': 'Teacher',
        'Classroom': 'Classroom',
        'Save': 'Save',
        'Add': 'Add',
        'Exercise with this name or number already exists.': 'Exercise with this name or number already exists.',
        'Manage classrooms': 'Manage classrooms',
    },
    'pl': {
        'Exercise number': 'Numer ćwiczenia',
        'Exercise name': 'Nazwa ćwiczenia',
        'Teacher': 'Nauczyciel',
        'Classroom': 'Sala',
        'Save': 'Zapisz',
        'Add': 'Dodaj',
        'Exercise with this name or number already exists.': 'Ćwiczenie o podanej nazwie lub numerze już isnieje.',
        'Manage classrooms': 'Zarządzaj salami',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const numberId = crypto.randomUUID();
const nameId = crypto.randomUUID();
const teacherId = crypto.randomUUID();
const classroomId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label :for="numberId" class="form-label">{{ translate('Exercise number') }}</label>
            <input :id="numberId" v-model="exerciseNumber" type="number" :min="0" class="form-control" required />
        </div>

        <div>
            <label :for="nameId" class="form-label">{{ translate('Exercise name') }}</label>
            <input :id="nameId" v-model="exerciseName" type="text" class="form-control" required autofocus />
        </div>

        <div>
            <label :for="teacherId" class="form-label">{{ translate('Teacher') }}</label>
            <UserSelector :id="teacherId" v-model="teacher" :options="subject.teachers" required />
        </div>

        <div>
            <label :for="classroomId" class="form-label">{{ translate('Classroom') }}</label>
            <select :id="classroomId" v-model="exerciseClassroomId" class="form-select" required>
                <option v-for="classroom in classrooms" :key="classroom.id" :value="classroom.id">
                    {{ classroom.name }}
                </option>
            </select>
            <a
                href="/classrooms/"
                class="d-block mt-2 link-success link-underline-opacity-0 link-underline-opacity-100-hover"
                >{{ translate('Manage classrooms') }}</a
            >
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate(isEditing ? 'Save' : 'Add') }}</button>
        </div>

        <div v-if="submitFailed" class="text-center text-danger">
            {{ translate('Exercise with this name or number already exists.') }}
        </div>
    </form>
</template>
