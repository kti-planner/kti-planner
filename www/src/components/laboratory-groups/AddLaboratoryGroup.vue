<script setup lang="ts">
import { useId } from 'vue';
import { langId } from '@components/frontend/lang';
import LaboratoryGroupForm from '@components/laboratory-groups/LaboratoryGroupForm.vue';
import Modal from '@components/Modal.vue';

const translations = {
    'en': {
        'Add new laboratory group': 'Add new laboratory group',
    },
    'pl': {
        'Add new laboratory group': 'Dodaj nową grupę laboratoryjną',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

defineProps<{
    apiUrl: string;
}>();

const modalId = useId();
</script>

<template>
    <div>
        <div class="d-flex justify-content-center mb-3">
            <button type="button" class="btn btn-success" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
                {{ translate('Add new laboratory group') }}
            </button>
        </div>

        <Modal :id="modalId">
            <template #header>
                {{ translate('Add new laboratory group') }}
            </template>
            <LaboratoryGroupForm :api-url />
        </Modal>
    </div>
</template>
