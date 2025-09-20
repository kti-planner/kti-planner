<script setup lang="ts">
import { computed } from 'vue';
import type { EventInput } from '@fullcalendar/core';
import { useApiFetch } from '@components/api';
import { getInitialDate, getLaboratoryClassEvents, getScheduleChangeEvents } from '@components/calendar/events';
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

const events = computed<EventInput[]>(() => [
    ...getLaboratoryClassEvents(laboratoryClasses.value ?? []),
    ...getScheduleChangeEvents(scheduleChanges),
]);

const initialDate = computed(() => getInitialDate(laboratoryClasses.value ?? []));
</script>

<template>
    <Calendar :events :initial-date>
        <template #eventContent="arg">
            <LaboratoryClassEvent
                v-if="'laboratoryClass' in arg.event.extendedProps"
                :time-text="arg.timeText"
                :laboratory-class="arg.event.extendedProps.laboratoryClass"
            />
        </template>
    </Calendar>
</template>
