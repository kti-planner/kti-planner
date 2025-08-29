<script setup lang="ts">
import { useId } from 'vue';
import { langId } from '@components/frontend/lang';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import IconButton from '@components/IconButton.vue';
import LaboratoryGroupForm from '@components/laboratory-groups/LaboratoryGroupForm.vue';
import Modal from '@components/Modal.vue';

defineProps<{
    group: LaboratoryGroupData;
    apiUrl: string;
}>();

const translations = {
    'en': {
        'Edit group': 'Edit group',
    },
    'pl': {
        'Edit group': 'Edytuj grupę',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modalId = useId();
</script>

<template>
    <IconButton
        icon="pencil"
        :aria-label="translate('Edit group')"
        class="ms-1"
        data-bs-toggle="modal"
        :data-bs-target="`#${modalId}`"
        :title="translate('Edit group')"
    />

    <Modal :id="modalId" :="$attrs">
        <template #header>{{ translate('Edit group') }} {{ group.name }}</template>
        <LaboratoryGroupForm :group :api-url />
    </Modal>
</template>
