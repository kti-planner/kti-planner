<script setup lang="ts">
import { computed } from 'vue';
import { langId } from '@components/frontend/lang';
import { useApiFetch } from '@components/api';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import ToggleButtonPicker from '@components/ToggleButtonPicker.vue';

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

const { semester, subject } = defineProps<{
    semester: SemesterData;
    subject: SubjectData;
}>();

const selectedSubjectIds = defineModel<Set<string>>('subjects', { required: true });
const selectedGroupIds = defineModel<Set<string>>('groups', { required: true });

const { data: laboratoryGroups } = useApiFetch<LaboratoryGroupData[]>(
    `/semesters/${semester.slug}/subjects/${subject.slug}/api/laboratory-groups/`,
);

const groupOptions = computed(() =>
    laboratoryGroups.value ? Object.fromEntries(laboratoryGroups.value.map(group => [group.name, group])) : null,
);

const switchId = crypto.randomUUID();
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
    <ToggleButtonPicker v-if="groupOptions" v-model:id-set="selectedGroupIds" :options="groupOptions" />
</template>
