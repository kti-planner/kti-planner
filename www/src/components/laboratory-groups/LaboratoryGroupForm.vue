<script setup lang="ts">
import { computed, ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiDelete, apiPatch, apiPost } from '@components/api';
import type {
    LaboratoryGroupCreateApiData,
    LaboratoryGroupData,
    LaboratoryGroupEditApiData,
} from '@components/laboratory-groups/types';
import ButtonWithConfirmationPopover from '@components/ButtonWithConfirmationPopover.vue';

const props = defineProps<{
    group?: LaboratoryGroupData;
    apiUrl: string;
}>();

const isEditing = computed(() => props.group !== undefined);

const submitFailed = ref(false);

const name = ref<string>(props.group?.name ?? '');

async function submit() {
    const success =
        props.group === undefined
            ? await apiPost<boolean>(props.apiUrl, {
                  name: name.value,
              } satisfies LaboratoryGroupCreateApiData)
            : await apiPatch<boolean>(props.apiUrl, {
                  id: props.group.id,
                  name: name.value,
              } satisfies LaboratoryGroupEditApiData);

    if (success === undefined) {
        return;
    }

    submitFailed.value = !success;

    if (success) {
        window.location.reload();
    }
}

async function doDelete() {
    if (!props.group) {
        return;
    }

    const result = await apiDelete<boolean>(props.apiUrl, new URLSearchParams({ id: props.group.id }));

    if (result) {
        window.location.reload();
    }
}

const translations = {
    'en': {
        'Group name': 'Group name',
        'Save': 'Save',
        'Add': 'Add',
        'A group with this name already exists': 'A group with this name already exists',
        'Delete group': 'Delete group',
    },
    'pl': {
        'Group name': 'Nazwa grupy',
        'Save': 'Zapisz',
        'Add': 'Dodaj',
        'A group with this name already exists': 'Grupa z tą nazwą już istnieje',
        'Delete group': 'Usuń grupę',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const nameId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label :for="nameId" class="form-label">{{ translate('Group name') }}</label>
            <input :id="nameId" v-model="name" type="text" class="form-control" autofocus required />
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">
                {{ translate(group ? 'Save' : 'Add') }}
            </button>
        </div>

        <div v-if="isEditing" class="text-center">
            <ButtonWithConfirmationPopover class="btn btn-danger" @click="doDelete()">
                {{ translate('Delete group') }}
            </ButtonWithConfirmationPopover>
        </div>

        <div v-if="submitFailed" class="text-center text-danger">
            {{ translate('A group with this name already exists') }}
        </div>
    </form>
</template>
