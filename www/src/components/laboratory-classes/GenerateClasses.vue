<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';
import { langId } from '@components/frontend/lang';
import type { ExerciseData } from '@components/exercises/types';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { SemesterData } from '@components/semesters/types';
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

const { group } = defineProps<{
    group: LaboratoryGroupData | null;
    exercises: ExerciseData[];
    semester: SemesterData;
}>();

const modal = useTemplateRef('modal');

watch(
    () => group,
    () => {
        if (!group) {
            modal.value?.hide();
        }
    },
);
</script>

<template>
    <div>
        <div class="d-flex justify-content-center mb-3">
            <button
                type="button"
                class="btn btn-success"
                :disabled="group === null"
                data-bs-toggle="modal"
                data-bs-target="#plan-classes-modal"
            >
                {{ translate('Plan classes') }}
            </button>
        </div>

        <Modal ref="modal" id="plan-classes-modal" scrollable>
            <template v-if="group" #header>
                {{ `${translate('Plan classes for group')} ${group.name}` }}
            </template>
            <GenerateClassesForm v-if="group" :group :semester :exercises />
        </Modal>
    </div>
</template>
