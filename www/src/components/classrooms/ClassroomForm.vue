<script setup lang="ts">
import { computed, ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiDelete, apiPatch, apiPost } from '@components/api';
import type { ClassroomCreateApiData, ClassroomData, ClassroomEditApiData } from '@components/classrooms/types';
import ButtonWithConfirmationPopover from '@components/ButtonWithConfirmationPopover.vue';

const props = defineProps<{
    classroom?: ClassroomData;
}>();

const isEditing = computed(() => props.classroom !== undefined);

const submitFailed = ref(false);

const name = ref<string>(props.classroom?.name ?? '');

async function submit() {
    const success =
        props.classroom === undefined
            ? await apiPost<boolean>('/classrooms/api/', { name: name.value } satisfies ClassroomCreateApiData)
            : await apiPatch<boolean>('/classrooms/api/', {
                  id: props.classroom.id,
                  name: name.value,
              } satisfies ClassroomEditApiData);

    if (success === undefined) {
        return;
    }

    submitFailed.value = !success;

    if (success) {
        window.location.reload();
    }
}

async function doDelete() {
    if (!props.classroom) {
        return;
    }

    const result = await apiDelete<boolean>('/classrooms/api/', new URLSearchParams({ id: props.classroom.id }));

    if (result) {
        window.location.assign(`/classrooms/`);
    }
}

const translations = {
    'en': {
        'Classroom name': 'Classroom name',
        'Save': 'Save',
        'Add': 'Add',
        'Classroom with this name already exists': 'Classroom with this name already exists',
        'Delete classroom': 'Delete classroom',
    },
    'pl': {
        'Classroom name': 'Nazwa sali',
        'Save': 'Zapisz',
        'Add': 'Dodaj',
        'Classroom with this name already exists': 'Sala z tą nazwą już istnieje',
        'Delete classroom': 'Usuń salę',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const nameId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-2 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label :for="nameId" class="form-label">{{ translate('Classroom name') }}</label>
            <input :id="nameId" v-model="name" type="text" class="form-control" autofocus required />
        </div>

        <div class="text-center mt-2">
            <button type="submit" class="btn btn-success">
                {{ translate(classroom ? 'Save' : 'Add') }}
            </button>
            <ButtonWithConfirmationPopover v-if="isEditing" class="btn btn-danger ms-4" @click="doDelete()">
                {{ translate('Delete classroom') }}
            </ButtonWithConfirmationPopover>
        </div>

        <div v-if="submitFailed" class="text-center text-danger">
            {{ translate('Classroom with this name already exists') }}
        </div>
    </form>
</template>
