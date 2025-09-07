<script setup lang="ts" generic="CalendarEvent extends EventInput">
import { computed, useTemplateRef, watch } from 'vue';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import type {
    CalendarOptions,
    DateInput,
    DateSelectArg,
    EventClickArg,
    EventContentArg,
    EventInput,
} from '@fullcalendar/core';
import enGbLocale from '@fullcalendar/core/locales/en-gb';
import plLocale from '@fullcalendar/core/locales/pl';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar from '@fullcalendar/vue3';
import { useWindowSize } from '@vueuse/core';
import { langId } from '@components/frontend/lang';

const { selectable, events, initialDate } = defineProps<{
    selectable?: boolean | undefined;
    events: CalendarEvent[];
    initialDate: DateInput | undefined;
}>();

const emit = defineEmits<{
    eventClick: [event: EventClickArg];
    select: [event: DateSelectArg];
}>();

type CalendarEventArg = EventContentArg & {
    event: CalendarEvent;
};

defineSlots<{
    eventContent(ev: CalendarEventArg): any;
}>();

// Customize buttons
bootstrap5Plugin.themeClasses.bootstrap5!.prototype.classes.button = 'btn btn-success btn-sm';

const calendar = useTemplateRef('calendar');

watch(
    () => initialDate,
    (newDate, oldDate) => {
        if (oldDate === undefined && newDate !== undefined) {
            const api = calendar.value?.getApi();
            api?.gotoDate(newDate);
        }
    },
);

const { width: windowWidth } = useWindowSize();

const options = computed((): CalendarOptions => {
    return {
        plugins: [dayGridPlugin, timeGridPlugin, bootstrap5Plugin, interactionPlugin],
        themeSystem: 'bootstrap5',
        initialView: windowWidth.value >= 992 ? 'timeGridWeek' : 'timeGridDay',
        height: '80vh',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth',
        },
        firstDay: 1,
        locale: langId === 'pl' ? plLocale : enGbLocale,
        nowIndicator: true,
        allDaySlot: false,
        displayEventEnd: true,
        slotDuration: '01:00:00',
        businessHours: {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '7:00',
            endTime: '21:00',
        },
        slotMinTime: '07:00:00',
        slotMaxTime: '21:00:00',
        eventClick: event => emit('eventClick', event),
        selectable,
        select: event => emit('select', event),
        eventMinHeight: 25,
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false,
        },
        expandRows: true,
        eventBackgroundColor: 'var(--bs-success)',
        events,
        initialDate: initialDate ?? new Date(),
    };
});
</script>

<template>
    <div class="overflow-y-auto">
        <div class="calendar-wrapper" style="min-width: 480px">
            <FullCalendar ref="calendar" :options>
                <!-- eslint-disable-next-line vue/no-unused-vars -->
                <template #eventContent="arg">
                    <slot name="eventContent" :="arg"></slot>
                </template>
            </FullCalendar>
        </div>
    </div>
</template>

<style scoped lang="scss">
.calendar-wrapper :deep(.fc-toolbar-title) {
    font-size: 1.25rem;
}
</style>
