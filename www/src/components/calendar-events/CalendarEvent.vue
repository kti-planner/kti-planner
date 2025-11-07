<script setup lang="ts">
import { computed } from 'vue';
import { langId } from '@components/frontend/lang';
import { type CalendarEventData, formatEventType } from '@components/calendar-events/types';
import { formatClassroomName } from '@components/classrooms/types';

const translations = {
    'en': {
        'Teacher': 'Teacher',
        'Classroom': 'Classroom',
        'Unknown [teacher]': 'Unknown',
        'Type:': 'Type',
    },
    'pl': {
        'Teacher': 'Nauczyciel',
        'Classroom': 'Sala',
        'Unknown [teacher]': 'Nieznany',
        'Type:': 'Typ:',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { calendarEvent } = defineProps<{
    timeText: string;
    calendarEvent: CalendarEventData;
}>();

const title = computed(() => {
    if (calendarEvent.type === 'rector hours') {
        return `${formatEventType(calendarEvent.type, langId)}`;
    } else {
        return (
            `${calendarEvent.name}\n` +
            `${translate('Classroom')}: ${formatClassroomName(calendarEvent.classroom, langId)}\n` +
            `${translate('Teacher')}: ${calendarEvent.user?.name ?? translate('Unknown [teacher]')}\n` +
            `${translate('Type:')} ${formatEventType(calendarEvent.type, langId)}`
        );
    }
});
</script>

<template>
    <div class="event-content" :title="title">
        <p class="text-truncate">{{ timeText }}</p>
        <template v-if="calendarEvent.type !== 'rector hours'">
            <p class="text-truncate fw-bold">
                {{ calendarEvent.name }}
            </p>
            <div class="text-truncate">
                <i class="bi bi-building-fill"></i>
                <span class="ms-1">{{ formatClassroomName(calendarEvent.classroom, langId) }}</span>
            </div>
            <div class="text-truncate">
                <i class="bi bi-person-fill"></i>
                <span class="ms-1">{{ calendarEvent.user?.name ?? translate('Unknown [teacher]') }}</span>
            </div>
        </template>
        <p class="text-truncate">
            {{ formatEventType(calendarEvent.type, langId) }}
        </p>
    </div>
</template>

<style scoped lang="scss">
.event-content {
    width: 100%;

    p {
        margin: 0;
    }
}
</style>
