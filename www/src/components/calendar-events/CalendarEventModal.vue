<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import type { CalendarEventData } from '@components/calendar-events/types';
import type { ClassroomData } from '@components/classrooms/types';
import type { SemesterData } from '@components/semesters/types';
import type { UserPublicData } from '@components/users/types';
import { formatDateLocalYyyyMmDdHhMm } from '@components/utils';
import CalendarEventForm from '@components/calendar-events/CalendarEventForm.vue';
import Modal from '@components/Modal.vue';

const translations = {
    'en': {
        'Add event': 'Add event',
        'Edit event': 'Edit event',
        'Event details': 'Event details',
    },
    'pl': {
        'Add event': 'Dodaj wydarzenie',
        'Edit event': 'Edytuj wydarzenie',
        'Event details': 'Szczegóły wydarzenia',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

defineProps<{
    event: CalendarEventData | null;
    startDate?: Date | undefined | null;
    endDate?: Date | undefined | null;
    allUsers: UserPublicData[];
    semester: SemesterData;
    classrooms: ClassroomData[];
}>();

const calendarEventModal = useTemplateRef('calendarEventModal');

const emit = defineEmits<{
    submit: [];
}>();

function handleCalendarEventSubmit() {
    calendarEventModal.value?.hide();
    emit('submit');
}

defineExpose({
    calendarEventModal,
});
</script>

<template>
    <Modal ref="calendarEventModal">
        <template #header>
            {{
                event === null
                    ? translate('Add event')
                    : currentUser
                      ? translate('Edit event')
                      : translate('Event details')
            }}
        </template>
        <CalendarEventForm
            :semester
            :classrooms
            :calendar-event="
                event ?? {
                    startDate: startDate ? formatDateLocalYyyyMmDdHhMm(startDate) : '',
                    endDate: endDate ? formatDateLocalYyyyMmDdHhMm(endDate) : '',
                }
            "
            :users="allUsers"
            @submit="handleCalendarEventSubmit"
        />
    </Modal>
</template>
