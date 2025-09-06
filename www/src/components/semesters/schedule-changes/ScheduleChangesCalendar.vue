<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue';
import { useTextSelection } from '@vueuse/core';
import type { ScheduleChangeType } from '@backend/semester';
import { langId } from '@components/frontend/lang';
import { scheduleChangeTypeLabels, type SemesterData } from '@components/semesters/types';
import { formatDateLocalYyyyMmDd, parseDateLocalYyyyMmDd } from '@components/utils';

const { semester, scheduleChanges } = defineProps<{
    semester: SemesterData;
    scheduleChanges: Map<string, ScheduleChangeType>;
}>();

const emit = defineEmits<{
    select: [start: Date, end: Date];
}>();

const dateButtons = useTemplateRef('dateButtons');

const weeksInSemester = computed(() => {
    const start = parseDateLocalYyyyMmDd(semester.startDate);
    const end = parseDateLocalYyyyMmDd(semester.endDate);

    let startDay = start.getDay();
    if (startDay === 0) {
        startDay = 7;
    }

    start.setDate(start.getDate() - (startDay - 1));

    const weeks: Date[] = [];
    while (start.getTime() <= end.getTime()) {
        weeks.push(new Date(start));
        start.setDate(start.getDate() + 7);
    }

    return weeks;
});

function weekDaysFor(week: Date): Date[] {
    return [0, 1, 2, 3, 4, 5, 6].map(day => {
        const date = new Date(week);
        date.setDate(week.getDate() + day);
        return date;
    });
}

function scheduleChangeTitle(date: Date): string {
    const change = scheduleChanges.get(formatDateLocalYyyyMmDd(date));

    const dateString = date.toLocaleDateString('pl-PL');

    if (change) {
        return `${dateString}\n${scheduleChangeTypeLabels[langId][change]}`;
    } else {
        return dateString;
    }
}

const { selection } = useTextSelection();

const selectedRange = computed(() => {
    if (!selection.value || !dateButtons.value) {
        return;
    }

    const { anchorNode, focusNode } = selection.value;

    if (!anchorNode || !focusNode) {
        return;
    }

    const startDateButton = dateButtons.value.find(
        element => element === anchorNode || element === anchorNode.parentElement,
    );

    const endDateButton = dateButtons.value.find(
        element => element === focusNode || element === focusNode.parentElement,
    );

    if (!startDateButton || !endDateButton) {
        return;
    }

    const startDateString = startDateButton.dataset.date;
    const endDateString = endDateButton.dataset.date;

    if (startDateString === undefined || endDateString === undefined) {
        return;
    }

    const startDate = parseDateLocalYyyyMmDd(startDateString);
    const endDate = parseDateLocalYyyyMmDd(endDateString);

    if (startDate.getTime() > endDate.getTime()) {
        return { start: endDate, end: startDate };
    } else {
        return { start: startDate, end: endDate };
    }
});

function isDateSelected(date: Date): boolean {
    return (
        selectedRange.value !== undefined &&
        date.getTime() >= selectedRange.value.start.getTime() &&
        date.getTime() <= selectedRange.value.end.getTime()
    );
}

watch(selectedRange, newSelection => {
    if (newSelection) {
        emit('select', newSelection.start, newSelection.end);
    }
});
</script>

<template>
    <div class="row g-0 text-center">
        <div v-for="week in weeksInSemester" :key="week.getTime()" class="col">
            <div
                v-for="day in weekDaysFor(week)"
                :key="day.getTime()"
                ref="dateButtons"
                role="button"
                :title="scheduleChangeTitle(day)"
                class="date-button border"
                :class="{
                    'bg-info': isDateSelected(day),
                    'bg-danger':
                        !isDateSelected(day) && scheduleChanges.get(formatDateLocalYyyyMmDd(day)) === 'holiday',
                    'bg-warning':
                        !isDateSelected(day) &&
                        (scheduleChanges.get(formatDateLocalYyyyMmDd(day)) ?? 'holiday') !== 'holiday',
                }"
                :data-date="formatDateLocalYyyyMmDd(day)"
                @click="emit('select', day, day)"
            >
                {{ day.getDate() }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
::selection {
    color: inherit;
    background-color: inherit;
}
</style>
