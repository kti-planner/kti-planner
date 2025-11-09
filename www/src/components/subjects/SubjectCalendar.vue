<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue';
import type { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { useCloned } from '@vueuse/core';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import { useApiFetch } from '@components/api';
import { getInitialDate, getLaboratoryClassEvents, getScheduleChangeEvents } from '@components/calendar/events';
import type { ExerciseData } from '@components/exercises/types';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { ScheduleChangeData, SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import type { UserPublicData } from '@components/users/types';
import Calendar from '@components/Calendar.vue';
import GenerateClassesForm from '@components/laboratory-classes/GenerateClassesForm.vue';
import LaboratoryClassEditModals from '@components/laboratory-classes/LaboratoryClassEditModals.vue';
import LaboratoryClassEvent from '@components/laboratory-classes/LaboratoryClassEvent.vue';
import Modal from '@components/Modal.vue';

const translations = {
    'en': {
        'Plan classes': 'Plan classes',
        'Plan classes for group': 'Plan classes for group',
    },
    'pl': {
        'Plan classes': 'Zaplanuj zajęcia',
        'Plan classes for group': 'Zaplanuj zajęcia dla grupy',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { selectedLaboratoryGroups, scheduleChanges, subject } = defineProps<{
    selectedLaboratoryGroups: LaboratoryGroupData[];
    scheduleChanges: ScheduleChangeData[];
    semester: SemesterData;
    subject: SubjectData;
    teachers: UserPublicData[];
    laboratoryGroups: LaboratoryGroupData[];
    exercises: ExerciseData[];
}>();

const emit = defineEmits<{
    classEdited: [];
}>();

const { data: laboratoryClasses, execute: refreshClasses } = useApiFetch<LaboratoryClassData[]>(
    `/api/subjects/${subject.id}/laboratory-classes/`,
    () => new URLSearchParams(selectedLaboratoryGroups.map(group => ['laboratoryGroup', group.name])),
);

defineExpose({
    refreshClasses,
});

const events = computed<EventInput[]>(() => [
    ...getLaboratoryClassEvents(laboratoryClasses.value ?? [], [subject]),
    ...getScheduleChangeEvents(scheduleChanges),
]);

const initialDate = computed(() => getInitialDate(laboratoryClasses.value ?? []));

const modal = useTemplateRef('modal');
const editedLaboratoryClass = shallowRef<LaboratoryClassData | null>(null);

function handleEventClick(arg: EventClickArg) {
    if (!('laboratoryClass' in arg.event.extendedProps)) {
        return;
    }

    editedLaboratoryClass.value = arg.event.extendedProps.laboratoryClass;
    modal.value?.classDetailsModal?.show();
}

function handleLaboratoryClassEdit() {
    refreshClasses();
    emit('classEdited');
}

const calendarAddClassModal = useTemplateRef('calendarAddClassModal');
const calendarSelectionStart = shallowRef<Date>(new Date());

function handleCalendarSelection(info: DateSelectArg) {
    calendarSelectionStart.value = new Date(info.start.getTime() + 15 * 60000);

    calendarAddClassModal.value?.show();
}

const { cloned: group } = useCloned(
    computed(() => (selectedLaboratoryGroups.length === 1 ? (selectedLaboratoryGroups[0] ?? null) : null)),
);

function handleGenerateClassesDone() {
    calendarAddClassModal.value?.hide();
    refreshClasses();
    emit('classEdited');
}
</script>

<template>
    <Calendar
        :events
        :initial-date
        :selectable="currentUser !== null"
        @event-click="handleEventClick"
        @select="handleCalendarSelection"
    >
        <template #eventContent="arg">
            <LaboratoryClassEvent
                v-if="'laboratoryClass' in arg.event.extendedProps"
                :time-text="arg.timeText"
                :laboratory-class="arg.event.extendedProps.laboratoryClass"
            />
        </template>
    </Calendar>

    <Modal ref="calendarAddClassModal">
        <template #header>
            {{ group ? `${translate('Plan classes for group')} ${group.name}` : translate('Plan classes') }}
        </template>
        <GenerateClassesForm
            v-model:group="group"
            :semester
            :subject
            :exercises
            :laboratory-groups
            :schedule-changes
            :initial-date="calendarSelectionStart"
            one-exercise-only
            @done="handleGenerateClassesDone"
        />
    </Modal>

    <LaboratoryClassEditModals
        ref="modal"
        :laboratory-class="editedLaboratoryClass"
        :subject
        :teachers
        :semester
        show-subject
        @submit="handleLaboratoryClassEdit"
    />
</template>
