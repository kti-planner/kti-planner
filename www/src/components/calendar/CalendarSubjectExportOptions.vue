<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import { useApiFetch } from '@components/api';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { SubjectData } from '@components/subjects/types';

const translations = {
    'en': {
        'Export this subject': 'Export this subject',
        'Laboratory groups': 'Laboratory groups',
    },
    'pl': {
        'Export this subject': 'Eksportuj ten przedmiot',
        'Laboratory groups': 'Grupy laboratoryjne',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { subject } = defineProps<{
    subject: SubjectData;
}>();

const selectedSubjectIds = defineModel<Set<string>>('subjects', { required: true });
const selectedGroupIds = defineModel<Set<string>>('groups', { required: true });

const { data: laboratoryGroups } = useApiFetch<LaboratoryGroupData[]>(`/api/subjects/${subject.id}/laboratory-groups/`);

const switchId = crypto.randomUUID();
const toggleBtnId = crypto.randomUUID();
</script>

<template>
    <div class="form-check form-switch mb-3">
        <input
            :id="`${switchId}-${subject.id}`"
            v-model="selectedSubjectIds"
            :value="subject.id"
            class="form-check-input"
            type="checkbox"
            role="switch"
        />
        <label class="form-check-label" :for="`${switchId}-${subject.id}`">{{
            translate('Export this subject')
        }}</label>
    </div>

    <h2 class="fs-6">
        {{ translate('Laboratory groups') }}
    </h2>
    <div v-if="laboratoryGroups" class="hstack flex-wrap gap-2">
        <div v-for="group in laboratoryGroups" :key="group.id">
            <input
                :id="`${toggleBtnId}-${group.id}`"
                v-model="selectedGroupIds"
                :value="group.id"
                type="checkbox"
                class="btn-check"
                autocomplete="off"
            />
            <label
                :for="`${toggleBtnId}-${group.id}`"
                class="btn toggle-btn"
                :class="selectedGroupIds.has(group.id) ? 'btn-success' : 'btn-light'"
                >{{ group.name }}</label
            >
        </div>
    </div>
</template>

<style scoped lang="scss">
.toggle-btn:hover {
    color: var(--bs-btn-hover-color);
    background-color: var(--bs-btn-hover-bg);
    border-color: var(--bs-btn-hover-border-color);
}
</style>
