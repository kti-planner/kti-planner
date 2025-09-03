<script setup lang="ts">
import { useCloned } from '@vueuse/core';
import type { ScheduleChangeData } from '@components/semesters/types';
import { parseDateLocalYyyyMmDd } from '@components/utils';

const { initialScheduleChanges } = defineProps<{
    initialScheduleChanges: ScheduleChangeData[];
}>();

const { cloned: scheduleChanges } = useCloned(initialScheduleChanges);
</script>

<template>
    <ul class="schedule-changes-list list-group mx-auto my-4">
        <li v-for="scheduleChange in scheduleChanges" :key="scheduleChange.date" class="list-group-item">
            {{ parseDateLocalYyyyMmDd(scheduleChange.date).toLocaleDateString('pl-PL') }} {{ scheduleChange.type }}
        </li>
    </ul>
</template>

<style scoped lang="scss">
.schedule-changes-list {
    max-width: 600px;
}
</style>
