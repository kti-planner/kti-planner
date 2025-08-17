<script setup lang="ts">
import { computed } from 'vue';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import type { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import enGbLocale from '@fullcalendar/core/locales/en-gb';
import plLocale from '@fullcalendar/core/locales/pl';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar from '@fullcalendar/vue3';
import { langId } from '@components/frontend/lang';

const { selectable } = defineProps<{
    selectable?: boolean | undefined;
}>();

const emit = defineEmits<{
    eventClick: [event: EventClickArg];
    select: [event: DateSelectArg];
}>();

// Customize buttons
bootstrap5Plugin.themeClasses.bootstrap5!.prototype.classes.button = 'btn btn-success btn-sm';

const options = computed((): CalendarOptions => {
    return {
        plugins: [dayGridPlugin, timeGridPlugin, bootstrap5Plugin, interactionPlugin],
        themeSystem: 'bootstrap5',
        initialView: 'dayGridMonth',
        height: '80vh',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridYear,dayGridMonth,timeGridWeek',
        },
        firstDay: 1,
        locale: langId === 'pl' ? plLocale : enGbLocale,
        nowIndicator: true,
        allDaySlot: false,
        displayEventEnd: true,
        slotDuration: '01:00:00',
        businessHours: {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '8:00',
            endTime: '16:00',
        },
        eventClick: event => emit('eventClick', event),
        selectable,
        select: event => emit('select', event),
        eventMinHeight: 25,
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false,
        },
    };
});
</script>

<template>
    <div class="overflow-y-auto">
        <div class="calendar-wrapper" style="min-width: 480px">
            <FullCalendar :options />
        </div>
    </div>
</template>

<style scoped lang="scss">
.calendar-wrapper :deep(.fc-toolbar-title) {
    font-size: 1.25rem;
}
</style>
