<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import { apiDelete, apiPatch, apiPost } from '@components/api';
import type { EventConflict } from '@components/calendar/types';
import { CalendarEventRepeatState } from '@components/calendar-events/state';
import type {
    CalendarEventCreateApiData,
    CalendarEventData,
    CalendarEventEditApiData,
} from '@components/calendar-events/types';
import { type ClassroomData, formatClassroomName } from '@components/classrooms/types';
import type { SemesterData } from '@components/semesters/types';
import type { UserPublicData } from '@components/users/types';
import { formatDateLocalYyyyMmDd, parseDateLocalYyyyMmDd } from '@components/utils';
import ButtonWithConfirmationPopover from '@components/ButtonWithConfirmationPopover.vue';
import UserSelector from '@components/users/UserSelector.vue';

const props = defineProps<{
    semester: SemesterData;
    classrooms: ClassroomData[];
    calendarEvent: Pick<CalendarEventData, 'startDate' | 'endDate'> & Partial<CalendarEventData>;
    users: UserPublicData[];
}>();

const emit = defineEmits<{
    submit: [];
}>();

const isEditing = computed(() => props.calendarEvent?.id !== undefined);

const name = ref<string>(props.calendarEvent.name ?? '');
const date = ref<string>(props.calendarEvent.startDate.split('T')[0] ?? '');
const startTime = ref<string>(props.calendarEvent.startDate.split('T')[1] ?? '');
const endTime = ref<string>(props.calendarEvent.endDate.split('T')[1] ?? '');

const user = ref<UserPublicData | null>(
    props.calendarEvent?.user ??
        (currentUser
            ? {
                  id: currentUser.id,
                  name: currentUser.name,
                  role: currentUser.role,
              }
            : null),
);

const classroomId = ref<string | null | undefined>(
    props.calendarEvent?.classroom === null ? null : props.calendarEvent?.classroom?.id,
);

const repeatOptions = ref(new CalendarEventRepeatState(props.semester, parseDateLocalYyyyMmDd(date.value)));
watch(date, newDate => (repeatOptions.value.startDate = parseDateLocalYyyyMmDd(newDate)));

const eventConflicts = ref<EventConflict[]>([]);

async function submit() {
    if (name.value === '' || classroomId.value === undefined || !user.value) {
        return;
    }

    const conflicts =
        props.calendarEvent?.id === undefined
            ? await apiPost<EventConflict[]>(`/semesters/${props.semester.slug}/api/calendar-events/`, {
                  name: name.value,
                  userId: user.value.id,
                  classroomId: classroomId.value,
                  durations: repeatOptions.value.generateDurations(startTime.value, endTime.value),
              } satisfies CalendarEventCreateApiData)
            : await apiPatch<EventConflict[]>(`/semesters/${props.semester.slug}/api/calendar-events/`, {
                  id: props.calendarEvent.id,
                  name: name.value,
                  userId: user.value.id,
                  classroomId: classroomId.value,
                  startDate: `${date.value}T${startTime.value}`,
                  endDate: `${date.value}T${endTime.value}`,
              } satisfies CalendarEventEditApiData);

    if (conflicts === undefined) {
        return;
    }

    if (conflicts.length === 0) {
        emit('submit');
        return;
    }

    eventConflicts.value = conflicts;
}

async function doDelete() {
    if (!props.calendarEvent.id) {
        return;
    }

    const result = await apiDelete<boolean>(
        `/semesters/${props.semester.slug}/api/calendar-events/`,
        new URLSearchParams({ id: props.calendarEvent.id }),
    );

    if (result) {
        emit('submit');
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
        'Repeats': 'Repeats',
        'Repeats every': 'Repeats every',
        'week': 'week',
        'weeks': 'weeks',
        'Ends': 'Ends',
        'When the semester ends': 'When the semester ends',
        'Before the semester ends': 'Before the semester ends',
        'Last event': 'Last event',
        'Repeat amount': 'Repeat amount',
        'The events do not fit in the semester': 'The events do not fit in the semester',
        'The following issues were found': 'The following issues were found',
        'Holiday': 'Holiday',
        'Another class takes place in this classroom': 'Another class takes place in this classroom',
        'Delete event': 'Delete event',
        'Outside of semester': 'Outside of semester',
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
        'Repeats': 'Powtarza się',
        'Repeats every': 'Powtarza się co',
        'week': 'tydzień',
        'weeks': 'tygodnie',
        'Ends': 'Kończy się',
        'When the semester ends': 'Razem z końcem semestru',
        'Before the semester ends': 'Przed końcem semestru',
        'Last event': 'Ostatnie wydarzenie',
        'Repeat amount': 'Ilość powtórzeń',
        'The events do not fit in the semester': 'Wydarzenia nie mieszczą się w semestrze',
        'The following issues were found': 'Znaleziono następujące problemy',
        'Holiday': 'Dzień wolny',
        'Another class takes place in this classroom': 'W wybranej sali odbywają się inne zajęcia',
        'Delete event': 'Usuń wydarzenie',
        'Outside of semester': 'Poza semestrem',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const dateId = crypto.randomUUID();
const startTimeId = crypto.randomUUID();
const endTimeId = crypto.randomUUID();
const repeatsId = crypto.randomUUID();
const repeatWeekAmountId = crypto.randomUUID();
const repeatWeekId = crypto.randomUUID();
const repeatEndId = crypto.randomUUID();
const repeatEndDateId = crypto.randomUUID();
const repeatCountId = crypto.randomUUID();
const nameId = crypto.randomUUID();
const userId = crypto.randomUUID();
const classroomInputId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-2 mx-auto" style="max-width: 500px" @submit.prevent="submit">
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

        <div v-if="currentUser && !isEditing" class="form-check">
            <input :id="repeatsId" v-model="repeatOptions.repeats" class="form-check-input" type="checkbox" />
            <label class="form-check-label" :for="repeatsId">{{ translate('Repeats') }}</label>
        </div>

        <template v-if="repeatOptions.repeats">
            <div class="input-group">
                <span :id="repeatWeekAmountId" class="input-group-text">{{ translate('Repeats every') }}:</span>
                <input
                    v-model="repeatOptions.repeatWeeks"
                    type="number"
                    :min="1"
                    class="form-control"
                    :aria-label="translate('Repeats every')"
                    :aria-describedby="`${repeatWeekAmountId} ${repeatWeekId}`"
                />
                <span
                    :id="repeatWeekId"
                    class="input-group-text text-center d-inline-block"
                    :style="{ minWidth: '94px' }"
                    >{{ repeatOptions.repeatWeeks === 1 ? translate('week') : translate('weeks') }}</span
                >
            </div>

            <div>
                <label :for="repeatEndId" class="form-label">{{ translate('Ends') }}</label>
                <select :id="repeatEndId" v-model="repeatOptions.endsBeforeSemester" class="form-select" required>
                    <option :value="false">{{ translate('When the semester ends') }}</option>
                    <option :value="true">{{ translate('Before the semester ends') }}</option>
                </select>
            </div>

            <div v-if="repeatOptions.endsBeforeSemester">
                <div class="row">
                    <div class="col">
                        <label :for="repeatEndDateId" class="form-label">{{ translate('Last event') }}</label>
                        <input
                            :id="repeatEndDateId"
                            v-model="repeatOptions.repeatEndDate"
                            type="date"
                            :min="date"
                            :max="semester.endDate"
                            required
                            class="form-control"
                        />
                    </div>
                    <div class="col">
                        <label :for="repeatCountId" class="form-label">{{ translate('Repeat amount') }}</label>
                        <input
                            :id="repeatCountId"
                            v-model="repeatOptions.repeatCount"
                            type="number"
                            :min="0"
                            required
                            class="form-control"
                        />
                    </div>
                </div>

                <p v-if="!repeatOptions.containedInSemester" class="text-danger mt-2 mb-0">
                    {{ translate('The events do not fit in the semester') }}
                </p>
            </div>
        </template>

        <div v-if="currentUser">
            <label :for="nameId" class="form-label">{{ translate('Name') }}</label>
            <input :id="nameId" v-model="name" type="text" class="form-control" required autofocus />
        </div>
        <div v-else>
            {{ translate('Name') }}:
            <br />
            {{ name }}
        </div>

        <div v-if="currentUser">
            <label :for="userId" class="form-label">{{ translate('Teacher') }}</label>
            <UserSelector :id="userId" v-model="user" :options="users" required />
        </div>
        <div v-else>
            {{ translate('Teacher') }}:
            <br />
            {{ user?.name }}
        </div>

        <div v-if="currentUser">
            <label :for="classroomInputId" class="form-label">{{ translate('Classroom') }}</label>
            <select :id="classroomInputId" v-model="classroomId" class="form-select" required>
                <option v-for="classroom in classrooms" :key="classroom.id" :value="classroom.id">
                    {{ classroom.name }}
                </option>
                <option :value="null">{{ formatClassroomName(null, langId) }}</option>
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
            {{ formatClassroomName(calendarEvent.classroom, langId) }}
        </div>

        <div v-if="currentUser" class="text-center mt-2">
            <button type="submit" class="btn btn-success">
                {{ translate(isEditing ? 'Save' : 'Add') }}
            </button>
            <ButtonWithConfirmationPopover v-if="isEditing" class="btn btn-danger ms-4" @click="doDelete()">
                {{ translate('Delete event') }}
            </ButtonWithConfirmationPopover>
        </div>

        <ul v-if="eventConflicts.length > 0">
            <li v-for="conflict in eventConflicts" :key="conflict.startDate">
                {{ `${formatDateLocalYyyyMmDd(new Date(conflict.startDate))}: ` }}
                <span class="text-danger">
                    {{
                        conflict.type === 'holiday'
                            ? translate('Holiday')
                            : conflict.type === 'other-event'
                              ? translate('Another class takes place in this classroom')
                              : translate('Outside of semester')
                    }}
                </span>
            </li>
        </ul>
    </form>
</template>
