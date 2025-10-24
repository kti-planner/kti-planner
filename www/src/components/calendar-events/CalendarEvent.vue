<script setup lang="ts">
import { computed } from 'vue';
import { langId } from '@components/frontend/lang';
import type { CalendarEventData } from '@components/calendar-events/types';

const translations = {
    'en': {
        'Teacher': 'Teacher',
        'Classroom': 'Classroom',
    },
    'pl': {
        'Teacher': 'Nauczyciel',
        'Classroom': 'Sala',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { calendarEvent } = defineProps<{
    timeText: string;
    calendarEvent: CalendarEventData;
}>();

const title = computed(
    () =>
        `${calendarEvent.name}\n` +
        `${translate('Teacher')}: ${calendarEvent.user.name}\n` +
        `${translate('Classroom')}: ${calendarEvent.classroom.name}`,
);
</script>

<template>
    <div class="event-content" :title>
        <p class="text-truncate">{{ timeText }}</p>
        <p class="text-truncate fw-bold">
            {{ calendarEvent.name }}
        </p>
        <div class="text-truncate">
            <i class="bi bi-person-fill"></i>
            <span class="ms-1">{{ calendarEvent.user.name }}</span>
        </div>
        <div class="text-truncate">
            <i class="bi bi-building-fill"></i>
            <span class="ms-1">{{ calendarEvent.classroom.name }}</span>
        </div>
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
