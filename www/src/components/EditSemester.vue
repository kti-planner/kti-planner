<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import Modal from './Modal.vue';
import SemesterForm from './SemesterForm.vue';

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

const modalId = `editSemesterModal-${props.semester.type}-${props.semester.year}`;
const showModal = ref(false);
</script>

<template>
    <div>
        <button
            @click.stop.prevent="showModal = true"
            type="button"
            class="btn border border-secondary-subtle btn-sm"
            data-bs-toggle="modal"
            :data-bs-target="`#${modalId}`"
        >
            <i class="bi bi-pencil"></i>
        </button>

        <Modal :modal-id="modalId" :is-shown="showModal">
            <template #header>
                {{ translate('Edit semester') }} {{ props.semester.year }}/{{ props.semester.year + 1 }}
            </template>
            <template #body>
                <SemesterForm :semester="props.semester" />
            </template>
        </Modal>
    </div>
</template>
