<script setup lang="ts">
import { ref, watch } from 'vue';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import { apiDelete, apiPatch } from '@components/api';
import type { EventConflict } from '@components/calendar/types';
import { formatClassroomName } from '@components/classrooms/types';
import type { LaboratoryClassData, LaboratoryClassEditApiData } from '@components/laboratory-classes/types';
import type { SemesterData } from '@components/semesters/types';
import { makeSubjectStudyDetails, type SubjectData } from '@components/subjects/types';
import type { UserPublicData } from '@components/users/types';
import { formatDateLocalHhMm, formatDateLocalYyyyMmDd, parseDateLocalYyyyMmDd } from '@components/utils';
import ButtonWithConfirmationPopover from '@components/ButtonWithConfirmationPopover.vue';
import UserSelector from '@components/users/UserSelector.vue';

const { laboratoryClass, semester, subject } = defineProps<{
    laboratoryClass: LaboratoryClassData;
    teachers: UserPublicData[];
    semester: SemesterData;
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
        'Unknown [teacher]': 'Unknown',
        'Save': 'Save',
        'The selected date is a holiday': 'The selected date is a holiday',
        'There is another class during this time': 'There is another class during this time',
        'Delete class': 'Delete class',
        'The selected date is outside of the semester': 'The selected date is outside of the semester',
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
        'Unknown [teacher]': 'Nieznany',
        'Save': 'Zapisz',
        'The selected date is a holiday': 'Wybrana data jest dniem wolnym',
        'There is another class during this time': 'W tym czasie odbywają się inne zajęcia',
        'Delete class': 'Usuń zajęcia',
        'The selected date is outside of the semester': 'Wybrana data jest poza semestrem',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const emit = defineEmits<{
    submit: [];
}>();

const date = ref<string>(formatDateLocalYyyyMmDd(new Date(laboratoryClass.startDate)));
const startTime = ref<string>(formatDateLocalHhMm(new Date(laboratoryClass.startDate)));
const endTime = ref<string>(formatDateLocalHhMm(new Date(laboratoryClass.endDate)));
const teacher = ref<UserPublicData | null>(laboratoryClass.teacher);
const eventConflict = ref<EventConflict | null>(null);

async function saveLaboratoryClass() {
    if (!currentUser || !teacher.value) {
        return;
    }

    eventConflict.value = null;

    const conflicts = await apiPatch<EventConflict[]>(`/api/subjects/${subject.id}/laboratory-classes/`, {
        id: laboratoryClass.id,
        startDate: `${date.value}T${startTime.value}`,
        endDate: `${date.value}T${endTime.value}`,
        teacherId: teacher.value.id,
    } satisfies LaboratoryClassEditApiData);

    if (conflicts === undefined) {
        return;
    }

    if (conflicts.length === 0) {
        emit('submit');
        return;
    }

    eventConflict.value = conflicts[0]!;
}

async function doDelete() {
    const result = await apiDelete<boolean>(
        `/api/subjects/${subject.id}/laboratory-classes/`,
        new URLSearchParams({ id: laboratoryClass.id }),
    );

    if (result) {
        emit('submit');
    }
}

watch([startTime, date], () => {
    if (subject.durationMinutes === null || date.value === '' || startTime.value === '') {
        return;
    }

    const endDate = new Date(`${date.value}T${startTime.value}`);
    endDate.setMinutes(endDate.getMinutes() + subject.durationMinutes);
    endTime.value = formatDateLocalHhMm(endDate);
});

const dateId = crypto.randomUUID();
const startTimeId = crypto.randomUUID();
const endTimeId = crypto.randomUUID();
const teacherId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-2 mx-auto" @submit.prevent="saveLaboratoryClass">
        <div v-if="showSubject">
            {{ translate('Subject') }}:
            <br />
            <a :href="`/semesters/${semester.slug}/subjects/${subject.slug}/`" class="link-success">
                {{ subject.fullName }} - {{ makeSubjectStudyDetails(subject, langId) }}
            </a>
        </div>

        <div>
            {{ translate('Exercise') }}:
            <br />
            <a
                :href="`/semesters/${semester.slug}/subjects/${subject.slug}/${laboratoryClass.exercise.exerciseNumber}/`"
                class="link-success"
            >
                {{ `${laboratoryClass.exercise.exerciseNumber}. ${laboratoryClass.exercise.name}` }}
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
            {{ formatClassroomName(laboratoryClass.exercise.classroom, langId) }}
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
            {{ teacher?.name ?? translate('Unknown [teacher]') }}
        </div>

        <div v-if="currentUser" class="text-center mt-2">
            <button type="submit" class="btn btn-success">
                {{ translate('Save') }}
            </button>
            <ButtonWithConfirmationPopover class="btn btn-danger ms-4" @click="doDelete()">
                {{ translate('Delete class') }}
            </ButtonWithConfirmationPopover>
        </div>

        <div v-if="eventConflict" class="text-center text-danger">
            {{
                eventConflict.type === 'holiday'
                    ? translate('The selected date is a holiday')
                    : eventConflict.type === 'other-event'
                      ? translate('There is another class during this time')
                      : translate('The selected date is outside of the semester')
            }}
        </div>
    </form>
</template>

<style scoped lang="scss">
form {
    max-width: 500px;
}
</style>
