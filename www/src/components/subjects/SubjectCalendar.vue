<script setup lang="ts">
import { computed } from 'vue';
import type { DateInput, EventInput } from '@fullcalendar/core';
import { useApiFetch } from '@components/api';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import Calendar from '@components/Calendar.vue';
import LaboratoryClassEvent from '@components/laboratory-classes/LaboratoryClassEvent.vue';

const { apiUrl, selectedLaboratoryGroups } = defineProps<{
    apiUrl: string;
    selectedLaboratoryGroups: LaboratoryGroupData[];
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

const events = computed<LaboraoryClassEventInput[]>(() =>
    (laboratoryClasses.value ?? []).map<LaboraoryClassEventInput>(laboratoryClass => ({
        title: `${laboratoryClass.laboratoryGroup.name} - ${laboratoryClass.exercise.name}`,
        start: laboratoryClass.startDate,
        end: laboratoryClass.endDate,
        extendedProps: { laboratoryClass },
    })),
);

const initialDate = computed<DateInput | undefined>(() => {
    if (events.value.length === 0) {
        return undefined;
    }

    const lastEventDate = new Date(events.value.at(-1)!.start! as string);
    const today = new Date();

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
                :title="arg.event.title"
                :time-text="arg.timeText"
                :laboratory-class="arg.event.extendedProps.laboratoryClass"
            />
        </template>
    </Calendar>
</template>
