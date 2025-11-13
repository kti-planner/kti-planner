<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPost, useApiFetch } from '@components/api';
import type { EventConflict } from '@components/calendar/types';
import type { CalendarEventData } from '@components/calendar-events/types';
import type { ExerciseData } from '@components/exercises/types';
import { getDayOfTheWeekOccurrence, truncateDate } from '@components/laboratory-classes/dates';
import type { LaboratoryClassCreateApiData, LaboratoryClassData } from '@components/laboratory-classes/types';
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
        'Plan single exercise': 'Plan single exercise',
        'Exercise': 'Exercise',
        'Class date': 'Class date',
        'First class date': 'First class date',
        'Class start time': 'Class start time',
        'Class end time': 'Class end time',
        'How many weeks are between classes?': 'How many weeks are between classes?',
        'Summary': 'Summary',
        'Add class': 'Add class',
        'Generate classes': 'Generate classes',
        'You can edit the classes later from the calendar': 'You can edit the classes later from the calendar',
        'The classes do not fit in the semester': 'The classes do not fit in the semester',
        'There are conflicts with holidays or other events': 'There are conflicts with holidays or other events',
        'Attention! This laboratory group already has scheduled classes, they will be deleted and replaced with newly generated ones.':
            'Attention! This laboratory group already has scheduled classes, they will be deleted and replaced with newly generated ones.',
        'Attention! This exercise is already planned for this laboratory group, it will be deleted and replaced with a newly generated one.':
            'Attention! This exercise is already planned for this laboratory group, it will be deleted and replaced with a newly generated one.',
        'Planned classes conflict with canceled classes schedule. Classes can still be generated.':
            'Planned classes conflict with canceled classes schedule. Classes can still be generated.',
    },
    'pl': {
        'Laboratory group': 'Grupa laboratoryjna',
        'Plan single exercise': 'Zaplanuj pojedyncze ćwiczenie',
        'Exercise': 'Ćwiczenie',
        'Class date': 'Data zajęć',
        'First class date': 'Data pierwszych zajęć',
        'Class start time': 'Godzina rozpoczęcia zajęć',
        'Class end time': 'Godzina zakończenia zajęć',
        'How many weeks are between classes?': 'Co ile tygodni zajęcia się powtarzają?',
        'Summary': 'Podsumowanie',
        'Add class': 'Dodaj zajęcie',
        'Generate classes': 'Wygeneruj zajęcia',
        'You can edit the classes later from the calendar': 'Możesz później edytować te zajęcia w kalendarzu',
        'The classes do not fit in the semester': 'Zajęcia nie mieszczą się w semestrze',
        'There are conflicts with holidays or other events': 'Są konflikty z dniami wolnymi lub innymi zajęciami',
        'Attention! This laboratory group already has scheduled classes, they will be deleted and replaced with newly generated ones.':
            'Uwaga! Ta grupa laboratoryjna posiada już zaplanowane zajęcia, zostaną one usunięte i zastąpione nowo wygenerowanymi.',
        'Attention! This exercise is already planned for this laboratory group, it will be deleted and replaced with a newly generated one.':
            'Uwaga! To ćwiczenie jest już zaplanowane dla tej grupy laboratoryjnej, zostanie ono usunięte i zastąpione nowo wygenerowanym.',
        'Planned classes conflict with canceled classes schedule. Classes can still be generated.':
            'Zaplanowane zajęcia kolidują z terminem odwołanych zajęć. Zajęcia nadal można wygenerować.',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const group = defineModel<LaboratoryGroupData | null>('group', { default: null });

const {
    exercises,
    subject,
    semester,
    scheduleChanges,
    initialDate,
    oneExerciseOnly = false,
} = defineProps<{
    exercises: ExerciseData[];
    subject: SubjectData;
    semester: SemesterData;
    laboratoryGroups: LaboratoryGroupData[];
    scheduleChanges: ScheduleChangeData[];
    initialDate?: Date | undefined;
    oneExerciseOnly?: boolean;
}>();

const emit = defineEmits<{
    done: [];
}>();

const isSingleExercise = ref(oneExerciseOnly);
const selectedExercise = ref<ExerciseData | null>(null);
const firstClassDateStr = ref<string | undefined>(initialDate ? formatDateLocalYyyyMmDd(initialDate) : undefined);
const classStartTime = ref<string | undefined>(initialDate ? formatDateLocalHhMm(initialDate) : undefined);
const classEndTime = ref<string>();
const repeatWeeks = ref<number | string>(subject.classRepeatWeeks ?? 1);

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
        group.value === undefined ||
        typeof repeatWeeks.value === 'string'
    ) {
        return [];
    }

    if (isSingleExercise.value) {
        if (selectedExercise.value === null) {
            return [];
        }

        const date = parseDateLocalYyyyMmDd(firstClassDateStr.value);
        return [
            {
                exercise: selectedExercise.value,
                start: new Date(`${formatDateLocalYyyyMmDd(date)}T${classStartTime.value}`),
                end: new Date(`${formatDateLocalYyyyMmDd(date)}T${classEndTime.value}`),
            },
        ];
    }

    const repeatWeeksNumber = repeatWeeks.value;

    let last: Date | undefined;
    return exercises.map<PlannedClass>(exercise => {
        const date = last
            ? getDayOfTheWeekOccurrence(new Date(last), scheduleChanges, 1, repeatWeeksNumber - 1)
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
    return (
        lastClass !== undefined &&
        truncateDate(lastClass.end).getTime() > parseDateLocalYyyyMmDd(semester.endDate).getTime()
    );
});

const cantGenerate = computed(() => {
    return !group.value || plannedClasses.value.length === 0 || group.value === undefined;
});

async function generate() {
    if (!group.value || plannedClasses.value.length === 0 || group.value === undefined) {
        return;
    }

    eventConflicts.value = [];

    const conflicts = await apiPost<EventConflict[]>(`/api/subjects/${subject.id}/laboratory-classes/`, {
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

// Clear conflicts when dependencies change
watch([firstClassDateStr, classStartTime, classEndTime, group, repeatWeeks, isSingleExercise, selectedExercise], () => {
    eventConflicts.value = [];
});

watch(
    [classStartTime, firstClassDateStr],
    () => {
        if (
            subject.durationMinutes === null ||
            classStartTime.value === undefined ||
            firstClassDateStr.value === undefined
        ) {
            return;
        }

        const endDate = new Date(`${firstClassDateStr.value}T${classStartTime.value}`);
        endDate.setMinutes(endDate.getMinutes() + subject.durationMinutes);
        classEndTime.value = formatDateLocalHhMm(endDate);
    },
    { immediate: true },
);

const { data: laboratoryClasses } = useApiFetch<LaboratoryClassData[]>(
    `/api/subjects/${subject.id}/laboratory-classes/`,
    () => new URLSearchParams(group.value ? { laboratoryGroup: group.value.name } : {}),
    { refetch: () => group.value !== null, immediate: group.value !== null },
);

const showAllExercisesAlert = computed<boolean>(
    () => !isSingleExercise.value && laboratoryClasses.value !== null && laboratoryClasses.value.length > 0,
);

const showOneExerciseAlert = computed<boolean>(() => {
    if (!isSingleExercise.value || laboratoryClasses.value === null || selectedExercise.value === null) {
        return false;
    }

    return laboratoryClasses.value.find(labClass => labClass.exercise.id === selectedExercise.value?.id) !== undefined;
});

const { data: calendarEvents } = useApiFetch<CalendarEventData[]>(
    `/api/semesters/${semester.id}/calendar-events/`,
    () => new URLSearchParams([['type', 'classes-canceled']]),
);

const canceledClassesEventConflicts = computed<EventConflict[]>(() => {
    if (calendarEvents.value === null) {
        return [];
    }

    return plannedClasses.value
        .filter(plannedClass =>
            calendarEvents.value?.some(
                calendarEvent =>
                    plannedClass.start.getTime() < new Date(calendarEvent.endDate).getTime() &&
                    plannedClass.end.getTime() > new Date(calendarEvent.startDate).getTime(),
            ),
        )
        .map<EventConflict>(plannedClass => ({
            type: 'classes-canceled',
            startDate: formatDateLocalYyyyMmDdHhMm(plannedClass.start),
            endDate: formatDateLocalYyyyMmDdHhMm(plannedClass.end),
        }));
});

const groupId = crypto.randomUUID();
const dateId = crypto.randomUUID();
const startTimeId = crypto.randomUUID();
const endTimeId = crypto.randomUUID();
const repeatId = crypto.randomUUID();
const singleExerciseId = crypto.randomUUID();
const selectedExerciseId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-2 mx-auto" style="max-width: 500px" @submit.prevent="generate">
        <div>
            <label :for="groupId">{{ translate('Laboratory group') }}</label>
            <LaboratoryGroupSelector :id="groupId" v-model="group" :options="laboratoryGroups" />
        </div>

        <div class="form-check">
            <input :id="singleExerciseId" v-model="isSingleExercise" class="form-check-input" type="checkbox" />
            <label class="form-check-label" :for="singleExerciseId">
                {{ translate('Plan single exercise') }}
            </label>
        </div>
        <div v-if="isSingleExercise">
            <label :for="selectedExerciseId" class="form-label">{{ translate('Exercise') }}</label>
            <select :id="selectedExerciseId" v-model="selectedExercise" class="form-select" required>
                <option v-for="exercise in exercises" :key="exercise.id" :value="exercise">
                    {{ exercise.exerciseNumber }}. {{ exercise.name }}
                </option>
            </select>
        </div>

        <div>
            <label :for="dateId" class="form-label">
                {{ isSingleExercise ? translate('Class date') : translate('First class date') }}
            </label>
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

        <div v-if="!isSingleExercise">
            <label :for="repeatId" class="form-label">{{ translate('How many weeks are between classes?') }}</label>
            <input :id="repeatId" v-model="repeatWeeks" type="number" min="1" class="form-control" required />
        </div>

        <p v-if="showAllExercisesAlert" class="text-warning">
            {{
                translate(
                    'Attention! This laboratory group already has scheduled classes, they will be deleted and replaced with newly generated ones.',
                )
            }}
        </p>
        <p v-if="showOneExerciseAlert" class="text-warning">
            {{
                translate(
                    'Attention! This exercise is already planned for this laboratory group, it will be deleted and replaced with a newly generated one.',
                )
            }}
        </p>

        <div v-if="plannedClasses.length > 0">
            <h2 class="fs-6">{{ translate('Summary') }}</h2>
            <div class="vstack gap-2">
                <PlannedClassCard
                    v-for="(plannedClass, index) in plannedClasses"
                    :key="index"
                    :planned-class
                    :conflicts="[...eventConflicts, ...canceledClassesEventConflicts]"
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
                {{ isSingleExercise ? translate('Add class') : translate('Generate classes') }}
            </button>
        </div>

        <div v-if="eventConflicts.length > 0" class="text-center text-danger">
            {{ translate('There are conflicts with holidays or other events') }}
        </div>

        <div v-if="canceledClassesEventConflicts.length > 0" class="text-center text-warning">
            {{ translate('Planned classes conflict with canceled classes schedule. Classes can still be generated.') }}
        </div>
    </form>
</template>
