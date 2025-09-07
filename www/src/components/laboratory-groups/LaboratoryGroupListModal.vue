<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { langId } from '@components/frontend/lang';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import IconButton from '@components/IconButton.vue';
import AddLaboratoryGroup from '@components/laboratory-groups/AddLaboratoryGroup.vue';
import EditLaboratoryGroup from '@components/laboratory-groups/EditLaboratoryGroup.vue';
import Modal from '@components/Modal.vue';

defineProps<{
    groups: LaboratoryGroupData[];
    apiUrl: string;
}>();

const translations = {
    'en': {
        'Laboratory groups': 'Laboratory groups',
        'Edit groups': 'Edit groups',
    },
    'pl': {
        'Laboratory groups': 'Grupy laboratoryjne',
        'Edit groups': 'Edytuj grupy',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const modal = useTemplateRef('modal');
const modalId = crypto.randomUUID();
</script>

<template>
    <IconButton
        icon="pencil"
        :aria-label="translate('Edit groups')"
        class="ms-1"
        style="margin-top: -0.25rem"
        data-bs-toggle="modal"
        :data-bs-target="`#${modalId}`"
        :title="translate('Edit groups')"
    />

    <Modal ref="modal" :id="modalId" content-rendering="always">
        <template #header>{{ translate('Laboratory groups') }}</template>
        <div class="list-group mx-auto mb-3">
            <div
                v-for="group in groups"
                :key="group.id"
                class="list-group-item d-flex justify-content-between align-items-center"
            >
                <span>{{ group.name }}</span>
                <EditLaboratoryGroup :group :api-url @hide="modal?.show()" />
            </div>
        </div>
        <AddLaboratoryGroup :api-url @hide="modal?.show()" />
    </Modal>
</template>

<style scoped lang="scss">
.list-group-item > :deep(button) {
    visibility: hidden;
}

.list-group-item:hover > :deep(button) {
    visibility: visible;
}
</style>
