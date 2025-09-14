<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { UserData } from '@components/users/types';
import UserSelector from '@components/users/UserSelector.vue';

const props = defineProps<{
    laboratoryClass: LaboratoryClassData;
    teachers: UserData[];
}>();

const translations = {
    'en': {
        'Exercise name': 'Exercise name',
        'Laboratory group': 'Laboratory group',
        'Classroom': 'Classroom',
        'Start date': 'Start date',
        'End date': 'End date',
        'Teacher': 'Teacher',
        'Save': 'Save',
    },
    'pl': {
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

const exerciseNameId = crypto.randomUUID();
const groupNameId = crypto.randomUUID();
const classroomId = crypto.randomUUID();
const startId = crypto.randomUUID();
const endId = crypto.randomUUID();
const teacherId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-3 mx-auto" @submit.prevent>
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
            <input :id="startId" v-model="startDate" type="datetime-local" required class="form-control" />
        </div>

        <div>
            <label :for="endId" class="form-label">{{ translate('End date') }}</label>
            <input :id="endId" v-model="endDate" type="datetime-local" required class="form-control" />
        </div>

        <div>
            <label :for="teacherId" class="form-label">{{ translate('Teacher') }}</label>
            <UserSelector :id="teacherId" v-model="teacher" :options="teachers" />
        </div>

        <div class="text-center">
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
