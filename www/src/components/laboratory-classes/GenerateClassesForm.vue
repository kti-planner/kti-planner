<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPost } from '@components/api';
import type { EventConflict } from '@components/calendar/types';
import type { ExerciseData } from '@components/exercises/types';
import { getNextDayOfTheWeekOccurrence } from '@components/laboratory-classes/dates';
import type { LaboratoryClassCreateApiData } from '@components/laboratory-classes/types';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { ScheduleChangeData, SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import {
    formatDateLocalHhMm,
    formatDateLocalYyyyMmDd,
    formatDateLocalYyyyMmDdHhMm,
    parseDateLocalYyyyMmDd,
} from '@components/utils';
import PlannedClassCard from '@components/laboratory-classes/PlannedClassCard.vue';
import LaboratoryGroupSelector from '@components/laboratory-groups/LaboratoryGroupSelector.vue';

const translations = {
    'en': {
        'Laboratory group': 'Laboratory group',
        'First class date': 'First class date',
        'Class start time': 'Class start time',
        'Class end time': 'Class end time',
        'How many weeks are between classes?': 'How many weeks are between classes?',
        'Summary': 'Summary',
        'Generate classes': 'Generate classes',
        'You can edit the classes later from the calendar': 'You can edit the classes later from the calendar',
        'The classes do not fit in the semester': 'The classes do not fit in the semester',
        'There are conflicts with holidays or other events': 'There are conflicts with holidays or other events',
    },
    'pl': {
        'Laboratory group': 'Grupa laboratoryjna',
        'First class date': 'Data pierwszych zajęć',
        'Class start time': 'Godzina rozpoczęcia zajęć',
        'Class end time': 'Godzina zakończenia zajęć',
        'How many weeks are between classes?': 'Co ile tygodni zajęcia się powtarzają?',
        'Summary': 'Podsumowanie',
        'Generate classes': 'Wygeneruj zajęcia',
        'You can edit the classes later from the calendar': 'Możesz później edytować te zajęcia w kalendarzu',
        'The classes do not fit in the semester': 'Zajęcia nie mieszczą się w semestrze',
        'There are conflicts with holidays or other events': 'Są konflikty z dniami wolnymi lub innymi zajęciami',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const group = defineModel<LaboratoryGroupData | null>('group', { default: null });

const { exercises, subject, semester, apiUrl, scheduleChanges } = defineProps<{
    exercises: ExerciseData[];
    subject: SubjectData;
    semester: SemesterData;
    apiUrl: string;
    laboratoryGroups: LaboratoryGroupData[];
    scheduleChanges: ScheduleChangeData[];
}>();

const emit = defineEmits<{
    done: [];
}>();

const firstClassDateStr = ref<string>();
const classStartTime = ref<string>();
const classEndTime = ref<string>();
const repeatWeeks = ref(1);

export interface PlannedClass {
    exercise: ExerciseData;
    start: Date;
    end: Date;
}

const plannedClasses = computed<PlannedClass[]>(() => {
    if (
        firstClassDateStr.value === undefined ||
        classStartTime.value === undefined ||
        classEndTime.value === undefined ||
        group.value === undefined
    ) {
        return [];
    }

    let last: Date | undefined;
    return exercises.map<PlannedClass>(exercise => {
        const date = last
            ? getNextDayOfTheWeekOccurrence(new Date(last), scheduleChanges, repeatWeeks.value - 1)
            : parseDateLocalYyyyMmDd(firstClassDateStr.value!);

        last = date;

        return {
            exercise,
            start: new Date(`${formatDateLocalYyyyMmDd(date)}T${classStartTime.value}`),
            end: new Date(`${formatDateLocalYyyyMmDd(date)}T${classEndTime.value}`),
        };
    });
});

const eventConflicts = ref<EventConflict[]>([]);

const plannedClassesNotContainedInSemester = computed<boolean>(() => {
    const lastClass = plannedClasses.value.at(-1);
    return lastClass !== undefined && lastClass.end.getTime() > parseDateLocalYyyyMmDd(semester.endDate).getTime();
});

const cantGenerate = computed(() => {
    return !group.value || plannedClasses.value.length === 0 || group.value === undefined;
});

async function generate() {
    if (!group.value || plannedClasses.value.length === 0 || group.value === undefined) {
        return;
    }

    eventConflicts.value = [];

    const conflicts = await apiPost<EventConflict[]>(apiUrl, {
        laboratoryGroupId: group.value.id,
        classes: plannedClasses.value.map(plannedClass => ({
            exerciseId: plannedClass.exercise.id,
            startDate: formatDateLocalYyyyMmDdHhMm(plannedClass.start),
            endDate: formatDateLocalYyyyMmDdHhMm(plannedClass.end),
        })),
    } satisfies LaboratoryClassCreateApiData);

    if (conflicts === undefined) {
        return;
    }

    if (conflicts.length === 0) {
        emit('done');
        return;
    }

    eventConflicts.value = conflicts;
}

watch(classStartTime, () => {
    if (classStartTime.value === undefined || firstClassDateStr.value === undefined) {
        return;
    }

    const endDate = new Date(`${firstClassDateStr.value}T${classStartTime.value}`);
    endDate.setMinutes(endDate.getMinutes() + subject.duration);
    classEndTime.value = formatDateLocalHhMm(endDate);
});

const groupId = crypto.randomUUID();
const dateId = crypto.randomUUID();
const startTimeId = crypto.randomUUID();
const endTimeId = crypto.randomUUID();
const repeatId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-2 mx-auto" style="max-width: 500px" @submit.prevent="generate">
        <div>
            <label :for="groupId">{{ translate('Laboratory group') }}</label>
            <LaboratoryGroupSelector :id="groupId" v-model="group" :options="laboratoryGroups" />
        </div>

        <div>
            <label :for="dateId" class="form-label">{{ translate('First class date') }}</label>
            <input
                :id="dateId"
                v-model="firstClassDateStr"
                :min="semester.startDate"
                :max="semester.endDate"
                type="date"
                class="form-control"
                required
            />
        </div>

        <div>
            <label :for="startTimeId" class="form-label">{{ translate('Class start time') }}</label>
            <input :id="startTimeId" v-model="classStartTime" type="time" step="300" class="form-control" required />
        </div>

        <div>
            <label :for="endTimeId" class="form-label">{{ translate('Class end time') }}</label>
            <input :id="endTimeId" v-model="classEndTime" type="time" step="300" class="form-control" required />
        </div>

        <div>
            <label :for="repeatId" class="form-label">{{ translate('How many weeks are between classes?') }}</label>
            <input :id="repeatId" v-model="repeatWeeks" type="number" min="1" class="form-control" required />
        </div>

        <div v-if="plannedClasses.length > 0">
            <h2 class="fs-6">{{ translate('Summary') }}</h2>
            <div class="vstack gap-2">
                <PlannedClassCard
                    v-for="(plannedClass, index) in plannedClasses"
                    :key="index"
                    :planned-class
                    :conflicts="eventConflicts"
                />
            </div>
            <p class="text-secondary mt-2 mb-0">
                {{ translate('You can edit the classes later from the calendar') }}
            </p>
            <p v-if="plannedClassesNotContainedInSemester" class="text-danger mt-2 mb-0">
                {{ translate('The classes do not fit in the semester') }}
            </p>
        </div>

        <div class="text-center mt-2">
            <button type="submit" class="btn btn-success" :disabled="cantGenerate">
                {{ translate('Generate classes') }}
            </button>
        </div>

        <div v-if="eventConflicts.length > 0" class="text-center text-danger">
            {{ translate('There are conflicts with holidays or other events') }}
        </div>
    </form>
</template>
