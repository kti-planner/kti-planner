<script setup lang="ts">
import { computed, ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import { apiPatch } from '@components/api';
import type { LaboratoryClassData, LaboratoryClassEditApiData } from '@components/laboratory-classes/types';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserData } from '@components/users/types';
import UserSelector from '@components/users/UserSelector.vue';

const props = defineProps<{
    laboratoryClass: LaboratoryClassData;
    teachers: UserData[];
    semester: SemesterData;
    apiUrl: string;
    subject?: SubjectData | undefined;
}>();

const translations = {
    'en': {
        'Subject name': 'Subject name',
        'Exercise name': 'Exercise name',
        'Laboratory group': 'Laboratory group',
        'Classroom': 'Classroom',
        'Start date': 'Start date',
        'End date': 'End date',
        'Teacher': 'Teacher',
        'Save': 'Save',
    },
    'pl': {
        'Subject name': 'Nazwa przedmiotu',
        'Exercise name': 'Nazwa ćwiczenia',
        'Laboratory group': 'Grupa laboratoryjna',
        'Classroom': 'Sala',
        'Start date': 'Data rozpoczęcia',
        'End date': 'Data zakończenia',
        'Teacher': 'Nauczyciel',
        'Save': 'Zapisz',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const startDate = ref<string>(props.laboratoryClass.startDate);
const endDate = ref<string>(props.laboratoryClass.endDate);
const teacher = ref<UserData>(props.laboratoryClass.teacher);

async function saveLaboratoryClass() {
    if (!currentUser) {
        return;
    }

    const success = await apiPatch<boolean>(props.apiUrl, {
        id: props.laboratoryClass.id,
        startDate: startDate.value,
        endDate: endDate.value,
        teacherId: teacher.value.id,
    } satisfies LaboratoryClassEditApiData);

    if (success === undefined) {
        return;
    }

    if (success) {
        window.location.reload();
    }
}

const minDate = computed(() => `${props.semester.startDate}T00:00`);
const maxDate = computed(() => `${props.semester.endDate}T23:59`);

const subjectId = crypto.randomUUID();
const exerciseNameId = crypto.randomUUID();
const groupNameId = crypto.randomUUID();
const classroomId = crypto.randomUUID();
const startId = crypto.randomUUID();
const endId = crypto.randomUUID();
const teacherId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-3 mx-auto" @submit.prevent="saveLaboratoryClass">
        <div v-if="subject">
            <label :for="subjectId" class="form-label">{{ translate('Subject name') }}</label>
            <input :id="subjectId" type="text" :value="subject.name" readonly class="form-control" />
        </div>

        <div>
            <label :for="exerciseNameId" class="form-label">{{ translate('Exercise name') }}</label>
            <input
                :id="exerciseNameId"
                type="text"
                :value="laboratoryClass.exercise.name"
                readonly
                class="form-control"
            />
        </div>

        <div>
            <label :for="groupNameId" class="form-label">{{ translate('Laboratory group') }}</label>
            <input
                :id="groupNameId"
                type="text"
                :value="laboratoryClass.laboratoryGroup.name"
                readonly
                class="form-control"
            />
        </div>

        <div>
            <label :for="classroomId" class="form-label">{{ translate('Classroom') }}</label>
            <input
                :id="classroomId"
                type="text"
                :value="laboratoryClass.exercise.classroom.name"
                readonly
                class="form-control"
            />
        </div>

        <div>
            <label :for="startId" class="form-label">{{ translate('Start date') }}</label>
            <input
                :id="startId"
                v-model="startDate"
                type="datetime-local"
                required
                class="form-control"
                :readonly="!currentUser"
                :min="minDate"
                :max="maxDate"
            />
        </div>

        <div>
            <label :for="endId" class="form-label">{{ translate('End date') }}</label>
            <input
                :id="endId"
                v-model="endDate"
                type="datetime-local"
                required
                class="form-control"
                :readonly="!currentUser"
                :min="minDate"
                :max="maxDate"
            />
        </div>

        <div>
            <label :for="teacherId" class="form-label">{{ translate('Teacher') }}</label>
            <UserSelector :id="teacherId" v-model="teacher" required :options="teachers" :disabled="!currentUser" />
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
