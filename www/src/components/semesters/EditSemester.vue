<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import Modal from '@components/Modal.vue';
import SemesterForm from '@components/semesters/SemesterForm.vue';

const props = defineProps<{
    semester: {
        id: string;
        type: 'summer' | 'winter';
        year: number;
        startDate: Date;
        endDate: Date;
    };
}>();

const translations = {
    'en': {
        'Edit semester': 'Edit semester',
    },
    'pl': {
        'Edit semester': 'Edytuj semestr',
    },
};

function translate(text: keyof (typeof translations)['en']): string {
    return translations[langId][text];
}

const modalId = `edit-semester-modal-${props.semester.type}-${props.semester.year}`;
</script>

<template>
    <div>
        <button
            type="button"
            class="btn border border-secondary-subtle btn-sm"
            data-bs-toggle="modal"
            :data-bs-target="`#${modalId}`"
        >
            <i class="bi bi-pencil"></i>
        </button>

        <Modal :id="modalId">
            <template #header>
                {{ translate('Edit semester') }} {{ props.semester.year }}/{{ props.semester.year + 1 }}
            </template>
            <SemesterForm :semester="props.semester" />
        </Modal>
    </div>
</template>
