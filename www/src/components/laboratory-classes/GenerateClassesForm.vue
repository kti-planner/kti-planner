<script setup lang="ts">
import { computed, ref, useId, watchEffect } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPost } from '@components/api';
import type { ExerciseData } from '@components/exercises/types';
import type { LaboratoryClassCreateApiData } from '@components/laboratory-classes/types';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { SemesterData } from '@components/semesters/types';
import { formatDateLocalYyyyMmDdHhMm } from '@components/utils';
import PlannedClassCard from '@components/laboratory-classes/PlannedClassCard.vue';

const translations = {
    'en': {
        'First class date': 'First class date',
        'First class start time': 'First class start time',
        'First class end time': 'First class end time',
        'How many weeks are between classes?': 'How many weeks are between classes?',
        'Summary': 'Summary',
        'Generate classes': 'Generate classes',
        'You can edit the classes later from the calendar': 'You can edit the classes later from the calendar',
    },
    'pl': {
        'First class date': 'Data pierwszych zajęć',
        'First class start time': 'Godzina rozpoczęcia pierwszych zajęć',
        'First class end time': 'Godzina zakończenia pierwszych zajęć',
        'How many weeks are between classes?': 'Co ile tygodni zajęcia się powtarzają?',
        'Summary': 'Podsumowanie',
        'Generate classes': 'Wygeneruj zajęcia',
        'You can edit the classes later from the calendar': 'Możesz później edytować te zajęcia w kalendarzu',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { group, exercises, apiUrl } = defineProps<{
    group: LaboratoryGroupData;
    exercises: ExerciseData[];
    semester: SemesterData;
    apiUrl: string;
}>();

const emit = defineEmits<{
    done: [];
}>();

const firstClassDateStr = ref<string>();
const firstClassStartTime = ref<string>();
const firstClassEndTime = ref<string>();
const repeatWeeks = ref(1);

export interface PlannedClass {
    id: string;
    exercise: ExerciseData;
    start: Date;
    end: Date;
}

const plannedClasses = computed<PlannedClass[]>(() => {
    if (
        firstClassDateStr.value === undefined ||
        firstClassStartTime.value === undefined ||
        firstClassEndTime.value === undefined
    ) {
        return [];
    }

    let lastStart: Date | undefined;
    let lastEnd: Date | undefined;
    return exercises.map<PlannedClass>(exercise => {
        const start = lastStart
            ? new Date(lastStart)
            : new Date(`${firstClassDateStr.value}T${firstClassStartTime.value}`);

        start.setDate(start.getDate() + 7 * repeatWeeks.value);

        const end = lastEnd ? new Date(lastEnd) : new Date(`${firstClassDateStr.value}T${firstClassEndTime.value}`);
        end.setDate(end.getDate() + 7 * repeatWeeks.value);

        lastStart = start;
        lastEnd = end;

        return {
            id: crypto.randomUUID(),
            exercise,
            start,
            end,
        };
    });
});

watchEffect(() => console.log(plannedClasses.value));

async function generate() {
    if (plannedClasses.value.length === 0) {
        return;
    }

    const results = await Promise.all(
        plannedClasses.value.map(plannedClass =>
            apiPost<boolean>(apiUrl, {
                exerciseId: plannedClass.exercise.id,
                laboratoryGroupId: group.id,
                startDate: formatDateLocalYyyyMmDdHhMm(plannedClass.start),
                endDate: formatDateLocalYyyyMmDdHhMm(plannedClass.end),
            } satisfies LaboratoryClassCreateApiData),
        ),
    );

    if (results.some(r => r === undefined)) {
        return;
    }

    firstClassDateStr.value = undefined;
    firstClassStartTime.value = undefined;
    firstClassEndTime.value = undefined;
    repeatWeeks.value = 1;
    emit('done');
}

const dateId = useId();
const startTimeId = useId();
const endTimeId = useId();
const repeatId = useId();
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="generate">
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
            <label :for="startTimeId" class="form-label">{{ translate('First class start time') }}</label>
            <input :id="startTimeId" v-model="firstClassStartTime" type="time" class="form-control" required />
        </div>

        <div>
            <label :for="endTimeId" class="form-label">{{ translate('First class end time') }}</label>
            <input :id="endTimeId" v-model="firstClassEndTime" type="time" class="form-control" required />
        </div>

        <div>
            <label :for="repeatId" class="form-label">{{ translate('How many weeks are between classes?') }}</label>
            <input :id="repeatId" v-model="repeatWeeks" type="number" class="form-control" required />
        </div>

        <div v-if="plannedClasses.length > 0">
            <h2 class="fs-6">{{ translate('Summary') }}</h2>
            <div class="d-flex flex-column gap-2">
                <PlannedClassCard v-for="plannedClass in plannedClasses" :key="plannedClass.id" :planned-class />
            </div>
            <p class="text-secondary mt-2">
                {{ translate('You can edit the classes later from the calendar') }}
            </p>
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate('Generate classes') }}</button>
        </div>
    </form>
</template>
