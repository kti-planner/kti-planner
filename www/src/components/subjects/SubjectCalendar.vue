<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue';
import type { EventClickArg, EventInput } from '@fullcalendar/core';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import { useApiFetch } from '@components/api';
import { getInitialDate, getLaboratoryClassEvents, getScheduleChangeEvents } from '@components/calendar/events';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { ScheduleChangeData, SemesterData } from '@components/semesters/types';
import type { UserData } from '@components/users/types';
import Calendar from '@components/Calendar.vue';
import EditLaboratoryClassForm from '@components/laboratory-classes/EditLaboratoryClassForm.vue';
import LaboratoryClassEvent from '@components/laboratory-classes/LaboratoryClassEvent.vue';
import Modal from '@components/Modal.vue';

const { apiUrl, selectedLaboratoryGroups, scheduleChanges } = defineProps<{
    apiUrl: string;
    selectedLaboratoryGroups: LaboratoryGroupData[];
    scheduleChanges: ScheduleChangeData[];
    semester: SemesterData;
    teachers: UserData[];
}>();

const translations = {
    'en': {
        'Edit class': 'Edit class',
        'Class details': 'Class details',
    },
    'pl': {
        'Edit class': 'Edytuj zajęcia',
        'Class details': 'Szczegóły zajęć',
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

const events = computed<EventInput[]>(() => [
    ...getLaboratoryClassEvents(laboratoryClasses.value ?? []),
    ...getScheduleChangeEvents(scheduleChanges),
]);

const initialDate = computed(() => getInitialDate(laboratoryClasses.value ?? []));

const editModal = useTemplateRef('editModal');
const editedLaboratoryClass = shallowRef<LaboratoryClassData | null>(null);

function handleEventClick(arg: EventClickArg) {
    if (!('laboratoryClass' in arg.event.extendedProps)) {
        return;
    }

    editedLaboratoryClass.value = arg.event.extendedProps.laboratoryClass;
    editModal.value?.show();
}
</script>

<template>
    <Calendar :events :initial-date @event-click="handleEventClick">
        <template #eventContent="arg">
            <LaboratoryClassEvent
                v-if="'laboratoryClass' in arg.event.extendedProps"
                :time-text="arg.timeText"
                :laboratory-class="arg.event.extendedProps.laboratoryClass"
            />
        </template>
    </Calendar>

    <Modal ref="editModal">
        <template #header>{{ currentUser ? translate('Edit class') : translate('Class details') }}</template>
        <EditLaboratoryClassForm
            v-if="editedLaboratoryClass"
            :laboratory-class="editedLaboratoryClass"
            :teachers
            :api-url
            :semester
        />
    </Modal>
</template>
