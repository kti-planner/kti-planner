<script setup lang="ts">
import { computed, ref } from 'vue';
import { langId } from '@components/frontend/lang';
import type { ClassroomData } from '@components/classrooms/types';
import type { ExerciseData } from '@components/exercises/types';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserData } from '@components/users/types';
import UserSelector from '@components/users/UserSelector.vue';

const props = defineProps<{
    semester: SemesterData;
    subject: SubjectData;
    exercise?: Partial<ExerciseData>;
    classrooms: ClassroomData[];
}>();

const isEditing = computed(() => props.exercise?.id !== undefined);

const addingFailed = ref(false);

const exerciseName = ref<string | undefined>(props.exercise?.name);
const exerciseNumber = ref<number | undefined>(props.exercise?.exerciseNumber);
const exerciseClassroomId = ref<string | undefined>(props.exercise?.classroomId);
const teacher = ref<UserData | null>(props.exercise?.teacher ?? props.subject.teachers[0] ?? null);

async function submit() {
    try {
        const result = !isEditing.value
            ? await fetch('/semesters/api/exercises/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      name: exerciseName.value,
                      exerciseNumber: exerciseNumber.value,
                      subjectId: props.subject.id,
                      classroomId: exerciseClassroomId.value,
                      teacherId: teacher.value?.id,
                  }),
              })
            : await fetch('/semesters/api/exercises/', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      id: props.exercise?.id,
                      name: exerciseName.value,
                      exerciseNumber: exerciseNumber.value,
                      classroomId: exerciseClassroomId.value,
                      teacherId: teacher.value?.id,
                  }),
              });

        if (!result.ok) {
            console.error('API request failed!');
            return;
        }

        const addingSuccess = (await result.json()) as boolean;
        addingFailed.value = !addingSuccess;

        if (addingSuccess) {
            const newUrl = `/semesters/${props.semester.slug}/${props.subject.slug}/${exerciseNumber.value}/`;

            if (isEditing.value) {
                window.history.replaceState({}, '', newUrl);
                window.location.reload();
            } else {
                window.location.assign(newUrl);
            }
        }
    } catch (error) {
        console.log(error);
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
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label for="exerciseNumber" class="form-label">{{ translate('Exercise number') }}</label>
            <input id="exerciseNumber" v-model="exerciseNumber" type="number" :min="0" class="form-control" required />
        </div>

        <div>
            <label for="exerciseName" class="form-label">{{ translate('Exercise name') }}</label>
            <input id="exerciseName" v-model="exerciseName" type="text" class="form-control" required autofocus />
        </div>

        <div>
            <label for="exerciseTeacher" class="form-label">{{ translate('Teacher') }}</label>
            <UserSelector id="exerciseTeacher" v-model="teacher" :options="subject.teachers" required />
        </div>

        <div>
            <label for="exerciseClassroom" class="form-label">{{ translate('Classroom') }}</label>
            <select id="exerciseClassroom" v-model="exerciseClassroomId" class="form-select" required>
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

        <div v-if="addingFailed" class="text-center text-danger">
            {{ translate('Exercise with this name or number already exists.') }}
        </div>
    </form>
</template>
