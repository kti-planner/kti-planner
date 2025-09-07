<script setup lang="ts">
import { computed } from 'vue';
import type { EventInput } from '@fullcalendar/core';
import { useApiFetch } from '@components/api';
import { getInitialDate, getLaboratoryClassEvents, getScheduleChangeEvents } from '@components/calendar/events';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { ScheduleChangeData, SemesterData } from '@components/semesters/types';
import Calendar from '@components/Calendar.vue';
import LaboratoryClassEvent from '@components/laboratory-classes/LaboratoryClassEvent.vue';

const { semester, scheduleChanges } = defineProps<{
    semester: SemesterData;
    scheduleChanges: ScheduleChangeData[];
}>();

const { data: laboratoryClasses } = useApiFetch<LaboratoryClassData[]>(
    `/semesters/${semester.slug}/api/laboratory-classes/`,
);

const events = computed<EventInput[]>(() => [
    ...getLaboratoryClassEvents(laboratoryClasses.value ?? []),
    ...getScheduleChangeEvents(scheduleChanges),
]);

const initialDate = computed(() => getInitialDate(laboratoryClasses.value ?? []));
</script>

<template>
    <div class="row g-4">
        <div class="col-12 col-lg-9 mb-2 order-2 order-lg-1">
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
        </div>
        <div class="col-12 col-lg-3 order-1 order-lg-2"></div>
    </div>
</template>
