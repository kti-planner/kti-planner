<script setup lang="ts">
import { computed } from 'vue';
import type { EventInput } from '@fullcalendar/core';
import { useApiFetch } from '@components/api';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { ScheduleChangeData } from '@components/semesters/types';
import Calendar from '@components/Calendar.vue';
import LaboratoryClassEvent from '@components/laboratory-classes/LaboratoryClassEvent.vue';

const { apiUrl, selectedLaboratoryGroups, scheduleChanges } = defineProps<{
    apiUrl: string;
    selectedLaboratoryGroups: LaboratoryGroupData[];
    scheduleChanges: ScheduleChangeData[];
}>();

const { data: laboratoryClasses, execute: refreshClasses } = useApiFetch<LaboratoryClassData[]>(
    apiUrl,
    () => new URLSearchParams(selectedLaboratoryGroups.map(group => ['laboratoryGroup', group.name])),
);

defineExpose({
    refreshClasses,
});

type LaboraoryClassEventInput = EventInput & {
    extendedProps: {
        laboratoryClass: LaboratoryClassData;
    };
};

const events = computed<EventInput[]>(() => [
    ...(laboratoryClasses.value ?? []).map<LaboraoryClassEventInput>(laboratoryClass => ({
        title: `${laboratoryClass.laboratoryGroup.name} - ${laboratoryClass.exercise.name}`,
        start: laboratoryClass.startDate,
        end: laboratoryClass.endDate,
        extendedProps: { laboratoryClass },
    })),
    ...scheduleChanges.map<EventInput>(scheduleChange => ({
        display: 'background',
        allDay: true,
        start: scheduleChange.date,
        backgroundColor: scheduleChange.type === 'holiday' ? 'var(--bs-danger)' : 'var(--bs-warning)',
    })),
]);

const initialDate = computed(() => {
    const lastClass = laboratoryClasses.value?.at(-1);

    if (!lastClass) {
        return undefined;
    }

    const today = new Date();
    const lastEventDate = new Date(lastClass.startDate);

    if (today.getTime() < lastEventDate.getTime()) {
        return today;
    } else {
        return lastEventDate;
    }
});
</script>

<template>
    <Calendar :events :initial-date>
        <template #eventContent="arg">
            <LaboratoryClassEvent
                v-if="'laboratoryClass' in arg.event.extendedProps"
                :title="arg.event.title"
                :time-text="arg.timeText"
                :laboratory-class="arg.event.extendedProps.laboratoryClass"
            />
        </template>
    </Calendar>
</template>
