<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useCloned } from '@vueuse/core';
import { langId } from '@components/frontend/lang';
import type { ExerciseData } from '@components/exercises/types';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { ScheduleChangeData, SemesterData } from '@components/semesters/types';
import GenerateClassesForm from '@components/laboratory-classes/GenerateClassesForm.vue';
import Modal from '@components/Modal.vue';

const translations = {
    'en': {
        'Plan classes': 'Plan classes',
        'Plan classes for group': 'Plan classes for group',
    },
    'pl': {
        'Plan classes': 'Zaplanuj zajęcia',
        'Plan classes for group': 'Zaplanuj zajęcia dla grupy',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { initialGroup } = defineProps<{
    initialGroup: LaboratoryGroupData | null;
    exercises: ExerciseData[];
    semester: SemesterData;
    apiUrl: string;
    laboratoryGroups: LaboratoryGroupData[];
    scheduleChanges: ScheduleChangeData[];
}>();

const emit = defineEmits<{
    done: [];
}>();

const modal = useTemplateRef('modal');
const modalId = crypto.randomUUID();
const { cloned: group } = useCloned(computed(() => initialGroup));

function handleFormDone() {
    modal.value?.hide();
    emit('done');
}
</script>

<template>
    <button type="button" class="btn btn-success" data-bs-toggle="modal" :data-bs-target="`#${modalId}`" :="$attrs">
        {{ translate('Plan classes') }}
    </button>

    <Modal ref="modal" :id="modalId" scrollable>
        <template #header>
            {{ group ? `${translate('Plan classes for group')} ${group.name}` : translate('Plan classes') }}
        </template>
        <GenerateClassesForm
            v-model:group="group"
            :semester
            :exercises
            :api-url
            :laboratory-groups
            :schedule-changes
            @done="handleFormDone"
        />
    </Modal>
</template>
