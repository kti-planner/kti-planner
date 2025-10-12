<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import { apiPatch } from '@components/api';
import type { LaboratoryClassData, LaboratoryClassEditApiData } from '@components/laboratory-classes/types';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserPublicData } from '@components/users/types';
import { formatDateLocalHhMm, formatDateLocalYyyyMmDd, parseDateLocalYyyyMmDd } from '@components/utils';
import UserSelector from '@components/users/UserSelector.vue';

const { laboratoryClass, semester, apiUrl } = defineProps<{
    laboratoryClass: LaboratoryClassData;
    teachers: UserPublicData[];
    semester: SemesterData;
    apiUrl: string;
    subject: SubjectData;
    showSubject?: boolean | undefined;
}>();

const translations = {
    'en': {
        'Subject': 'Subject',
        'Exercise': 'Exercise',
        'Laboratory group': 'Laboratory group',
        'Classroom': 'Classroom',
        'Date': 'Date',
        'Start time': 'Start time',
        'End time': 'End time',
        'Teacher': 'Teacher',
        'Save': 'Save',
    },
    'pl': {
        'Subject': 'Przedmiot',
        'Exercise': 'Ćwiczenie',
        'Laboratory group': 'Grupa laboratoryjna',
        'Classroom': 'Sala',
        'Date': 'Data',
        'Start time': 'Czas rozpoczęcia',
        'End time': 'Czas zakończenia',
        'Teacher': 'Nauczyciel',
        'Save': 'Zapisz',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const date = ref<string>(formatDateLocalYyyyMmDd(new Date(laboratoryClass.startDate)));
const startTime = ref<string>(formatDateLocalHhMm(new Date(laboratoryClass.startDate)));
const endTime = ref<string>(formatDateLocalHhMm(new Date(laboratoryClass.endDate)));
const teacher = ref<UserPublicData>(laboratoryClass.teacher);

async function saveLaboratoryClass() {
    if (!currentUser) {
        return;
    }

    const success = await apiPatch<boolean>(apiUrl, {
        id: laboratoryClass.id,
        startDate: `${date.value}T${startTime.value}`,
        endDate: `${date.value}T${endTime.value}`,
        teacherId: teacher.value.id,
    } satisfies LaboratoryClassEditApiData);

    if (success === undefined) {
        return;
    }

    if (success) {
        window.location.reload();
    }
}

const dateId = crypto.randomUUID();
const startTimeId = crypto.randomUUID();
const endTimeId = crypto.randomUUID();
const teacherId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-3 mx-auto" @submit.prevent="saveLaboratoryClass">
        <div v-if="showSubject">
            {{ translate('Subject') }}:
            <br />
            <a :href="`/semesters/${semester.slug}/subjects/${subject.slug}/`" class="link-success">
                {{ subject.name }}
            </a>
        </div>

        <div>
            {{ translate('Exercise') }}:
            <br />
            <a
                :href="`/semesters/${semester.slug}/subjects/${subject.slug}/${laboratoryClass.exercise.exerciseNumber}/`"
                class="link-success"
            >
                {{ laboratoryClass.exercise.name }}
            </a>
        </div>

        <div>
            {{ translate('Laboratory group') }}:
            <br />
            {{ laboratoryClass.laboratoryGroup.name }}
        </div>

        <div>
            {{ translate('Classroom') }}:
            <br />
            {{ laboratoryClass.exercise.classroom.name }}
        </div>

        <template v-if="currentUser">
            <div>
                <label :for="dateId" class="form-label">{{ translate('Date') }}</label>
                <input
                    :id="dateId"
                    v-model="date"
                    type="date"
                    :min="semester.startDate"
                    :max="semester.endDate"
                    required
                    class="form-control"
                />
            </div>

            <div>
                <label :for="startTimeId" class="form-label">{{ translate('Start time') }}</label>
                <input :id="startTimeId" v-model="startTime" type="time" step="300" required class="form-control" />
            </div>

            <div>
                <label :for="endTimeId" class="form-label">{{ translate('End time') }}</label>
                <input :id="endTimeId" v-model="endTime" type="time" step="300" required class="form-control" />
            </div>
        </template>
        <div v-else>
            {{ translate('Date') }}:
            <br />
            {{ parseDateLocalYyyyMmDd(date).toLocaleDateString('pl-PL') }} {{ startTime }} - {{ endTime }}
        </div>

        <div v-if="currentUser">
            <label :for="teacherId" class="form-label">{{ translate('Teacher') }}</label>
            <UserSelector :id="teacherId" v-model="teacher" required :options="teachers" :disabled="!currentUser" />
        </div>
        <div v-else>
            {{ translate('Teacher') }}:
            <br />
            {{ teacher.name }}
        </div>

        <div v-if="currentUser" class="text-center">
            <button type="submit" class="btn btn-success">
                {{ translate('Save') }}
            </button>
        </div>
    </form>
</template>

<style scoped lang="scss">
form {
    max-width: 500px;
}
</style>
