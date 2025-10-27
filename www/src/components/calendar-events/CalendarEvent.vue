<script setup lang="ts">
import { computed } from 'vue';
import { langId } from '@components/frontend/lang';
import type { CalendarEventData } from '@components/calendar-events/types';

const translations = {
    'en': {
        'Teacher': 'Teacher',
        'Classroom': 'Classroom',
        'Unknown [teacher]': 'Unknown',
        'Unknown [classroom]': 'Unknown',
    },
    'pl': {
        'Teacher': 'Nauczyciel',
        'Classroom': 'Sala',
        'Unknown [teacher]': 'Nieznany',
        'Unknown [classroom]': 'Nieznana',
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
        `${translate('Teacher')}: ${calendarEvent.user?.name ?? translate('Unknown [teacher]')}\n` +
        `${translate('Classroom')}: ${calendarEvent.classroom?.name ?? translate('Unknown [classroom]')}`,
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
            <span class="ms-1">{{ calendarEvent.user?.name ?? translate('Unknown [teacher]') }}</span>
        </div>
        <div class="text-truncate">
            <i class="bi bi-building-fill"></i>
            <span class="ms-1">{{ calendarEvent.classroom?.name ?? translate('Unknown [classroom]') }}</span>
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
