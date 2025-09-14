<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue';
import type { EventClickArg, EventInput } from '@fullcalendar/core';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import { useApiFetch } from '@components/api';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { ScheduleChangeData } from '@components/semesters/types';
import type { UserData } from '@components/users/types';
import Calendar from '@components/Calendar.vue';
import EditLaboratoryClassForm from '@components/laboratory-classes/EditLaboratoryClassForm.vue';
import LaboratoryClassEvent from '@components/laboratory-classes/LaboratoryClassEvent.vue';
import Modal from '@components/Modal.vue';

const { apiUrl, selectedLaboratoryGroups, scheduleChanges } = defineProps<{
    apiUrl: string;
    selectedLaboratoryGroups: LaboratoryGroupData[];
    scheduleChanges: ScheduleChangeData[];
    teachers: UserData[];
}>();

const translations = {
    'en': {
        'Edit class': 'Edit class',
    },
    'pl': {
        'Edit class': 'Edytuj zajęcia',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

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

const editModal = useTemplateRef('editModal');
const editedLaboratoryClass = shallowRef<LaboratoryClassData | null>(null);

function handleEventClick(arg: EventClickArg) {
    if (!('laboratoryClass' in arg.event.extendedProps) || currentUser === null) {
        return;
    }

    editedLaboratoryClass.value = arg.event.extendedProps.laboratoryClass;
    editModal.value?.show();
}
</script>

<template>
    <Calendar
        :class="{ 'clickable-events': currentUser !== null }"
        :events
        :initial-date
        @event-click="handleEventClick"
    >
        <template #eventContent="arg">
            <LaboratoryClassEvent
                v-if="'laboratoryClass' in arg.event.extendedProps"
                :title="arg.event.title"
                :time-text="arg.timeText"
                :laboratory-class="arg.event.extendedProps.laboratoryClass"
            />
        </template>
    </Calendar>

    <Modal v-if="currentUser" ref="editModal">
        <template #header>{{ translate('Edit class') }}</template>
        <EditLaboratoryClassForm
            v-if="editedLaboratoryClass"
            :laboratory-class="editedLaboratoryClass"
            :teachers
            :api-url
        />
    </Modal>
</template>

<style scoped lang="scss">
.clickable-events :deep(.fc) {
    .fc-event {
        cursor: pointer;

        &:hover {
            background-color: #157347 !important;
        }
    }
}
</style>
