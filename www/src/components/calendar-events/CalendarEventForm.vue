<script setup lang="ts">
import { computed, ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import { apiPatch, apiPost } from '@components/api';
import type {
    CalendarEventCreateApiData,
    CalendarEventData,
    CalendarEventEditApiData,
} from '@components/calendar-events/types';
import type { ClassroomData } from '@components/classrooms/types';
import type { SemesterData } from '@components/semesters/types';
import { parseDateLocalYyyyMmDd } from '@components/utils';

const props = defineProps<{
    semester: SemesterData;
    classrooms: ClassroomData[];
    calendarEvent?: Partial<CalendarEventData>;
}>();

const isEditing = computed(() => props.calendarEvent?.id !== undefined);

const name = ref<string>(props.calendarEvent?.name ?? '');
const date = ref<string>(props.calendarEvent?.startDate?.split('T')[0] ?? '');
const startTime = ref<string>(props.calendarEvent?.startDate?.split('T')[1] ?? '');
const endTime = ref<string>(props.calendarEvent?.endDate?.split('T')[1] ?? '');
const classroomId = ref<string | undefined>(props.calendarEvent?.classroom?.id);

async function submit() {
    if (name.value === '' || classroomId.value === undefined) {
        return;
    }

    const success =
        props.calendarEvent?.id === undefined
            ? await apiPost<boolean>(`/semesters/${props.semester.slug}/api/calendar-events/`, {
                  name: name.value,
                  classroomId: classroomId.value,
                  durations: [
                      {
                          startDate: `${date.value}T${startTime.value}`,
                          endDate: `${date.value}T${endTime.value}`,
                      },
                  ],
              } satisfies CalendarEventCreateApiData)
            : await apiPatch<boolean>(`/semesters/${props.semester.slug}/api/calendar-events/`, {
                  id: props.calendarEvent.id,
                  name: name.value,
                  classroomId: classroomId.value,
                  startDate: `${date.value}T${startTime.value}`,
                  endDate: `${date.value}T${endTime.value}`,
              } satisfies CalendarEventEditApiData);

    if (success === undefined) {
        return;
    }

    if (success) {
        window.location.reload();
    }
}

const translations = {
    'en': {
        'Name': 'Name',
        'Classroom': 'Classroom',
        'Teacher': 'Teacher',
        'Save': 'Save',
        'Add': 'Add',
        'Manage classrooms': 'Manage classrooms',
        'Date': 'Date',
        'Start time': 'Start time',
        'End time': 'End time',
    },
    'pl': {
        'Name': 'Nazwa',
        'Classroom': 'Sala',
        'Teacher': 'Nauczyciel',
        'Save': 'Zapisz',
        'Add': 'Dodaj',
        'Manage classrooms': 'Zarządzaj salami',
        'Date': 'Data',
        'Start time': 'Czas rozpoczęcia',
        'End time': 'Czas zakończenia',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const dateId = crypto.randomUUID();
const startTimeId = crypto.randomUUID();
const endTimeId = crypto.randomUUID();
const nameId = crypto.randomUUID();
const classroomInputId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
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
            <label :for="nameId" class="form-label">{{ translate('Name') }}</label>
            <input :id="nameId" v-model="name" type="text" class="form-control" required autofocus />
        </div>
        <div v-else>
            {{ translate('Name') }}:
            <br />
            {{ name }}
        </div>

        <div v-if="calendarEvent?.user">
            {{ translate('Teacher') }}:
            <br />
            {{ calendarEvent.user.name }}
        </div>

        <div v-if="currentUser">
            <label :for="classroomInputId" class="form-label">{{ translate('Classroom') }}</label>
            <select :id="classroomInputId" v-model="classroomId" class="form-select" required>
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
        <div v-else>
            {{ translate('Classroom') }}:
            <br />
            {{ calendarEvent?.classroom?.name }}
        </div>

        <div v-if="currentUser" class="text-center">
            <button type="submit" class="btn btn-success">{{ translate(isEditing ? 'Save' : 'Add') }}</button>
        </div>
    </form>
</template>
