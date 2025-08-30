<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPost } from '@components/api';
import type { ExerciseData } from '@components/exercises/types';
import { getNextDayOfTheWeekOccurance, isSameDay } from '@components/laboratory-classes/dates';
import type { LaboratoryClassCreateApiData } from '@components/laboratory-classes/types';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { ScheduleChangeData, SemesterData } from '@components/semesters/types';
import { formatDateLocalYyyyMmDd, formatDateLocalYyyyMmDdHhMm } from '@components/utils';
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
        'The date you selected is a holiday': 'The date you selected is a holiday',
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
        'The date you selected is a holiday': 'Wybrana data jest dniem wolnym od zajęć',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const group = defineModel<LaboratoryGroupData | null>('group', { default: null });

const { exercises, apiUrl, scheduleChanges } = defineProps<{
    exercises: ExerciseData[];
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

const firstClassDateHoliday = computed(() => {
    if (firstClassDateStr.value === undefined) {
        return false;
    }

    const firstClassDate = new Date(firstClassDateStr.value);
    return scheduleChanges.some(
        change => change.type === 'holiday' && isSameDay(firstClassDate, new Date(change.date)),
    );
});

export interface PlannedClass {
    id: string;
    exercise: ExerciseData;
    start: Date;
    end: Date;
}

const plannedClasses = computed<PlannedClass[]>(() => {
    if (
        firstClassDateStr.value === undefined ||
        firstClassDateHoliday.value ||
        classStartTime.value === undefined ||
        classEndTime.value === undefined ||
        group.value === undefined
    ) {
        return [];
    }

    let last: Date | undefined;
    return exercises.map<PlannedClass>(exercise => {
        let date = last ? new Date(last) : new Date(firstClassDateStr.value!);

        if (last) {
            for (let i = 0; i < repeatWeeks.value; i++) {
                date = getNextDayOfTheWeekOccurance(date, scheduleChanges);
            }
        }

        last = date;

        return {
            id: crypto.randomUUID(),
            exercise,
            start: new Date(`${formatDateLocalYyyyMmDd(date)}T${classStartTime.value}`),
            end: new Date(`${formatDateLocalYyyyMmDd(date)}T${classEndTime.value}`),
        };
    });
});

async function generate() {
    if (plannedClasses.value.length === 0 || group.value === undefined) {
        return;
    }

    const results = await Promise.all(
        plannedClasses.value.map(plannedClass =>
            apiPost<boolean>(apiUrl, {
                exerciseId: plannedClass.exercise.id,
                laboratoryGroupId: group.value!.id,
                startDate: formatDateLocalYyyyMmDdHhMm(plannedClass.start),
                endDate: formatDateLocalYyyyMmDdHhMm(plannedClass.end),
            } satisfies LaboratoryClassCreateApiData),
        ),
    );

    if (results.some(r => r === undefined)) {
        return;
    }

    firstClassDateStr.value = undefined;
    classStartTime.value = undefined;
    classEndTime.value = undefined;
    repeatWeeks.value = 1;
    emit('done');
}

const groupId = useId();
const dateId = useId();
const startTimeId = useId();
const endTimeId = useId();
const repeatId = useId();
const dateFeedback = useId();
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="generate">
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
                :class="{
                    'is-invalid': firstClassDateHoliday,
                }"
                :="{ ...(firstClassDateHoliday ? { 'aria-describedby': dateFeedback } : {}) }"
                required
            />
            <div v-if="firstClassDateHoliday" :id="dateFeedback" class="invalid-feedback">
                {{ translate('The date you selected is a holiday') }}
            </div>
        </div>

        <div>
            <label :for="startTimeId" class="form-label">{{ translate('Class start time') }}</label>
            <input :id="startTimeId" v-model="classStartTime" type="time" class="form-control" required />
        </div>

        <div>
            <label :for="endTimeId" class="form-label">{{ translate('Class end time') }}</label>
            <input :id="endTimeId" v-model="classEndTime" type="time" class="form-control" required />
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
