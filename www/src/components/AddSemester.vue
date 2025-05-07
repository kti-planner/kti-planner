<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import SemesterForm from './SemesterForm.vue';

const showForm = ref(false);

const translations = {
    'en': {
        'Add new semester': 'Add new semester',
    },
    'pl': {
        'Add new semester': 'Dodaj nowy semestr',
    },
};

function translate(text: keyof (typeof translations)['en']): string {
    return translations[langId][text];
}
</script>

<template>
    <div>
        <div class="d-flex justify-content-center mb-3">
            <button
                type="button"
                class="btn btn-success"
                @click="showForm = true"
                data-bs-toggle="modal"
                data-bs-target="#semesterModal"
            >
                {{ translate('Add new semester') }}
            </button>
        </div>

        <div
            v-show="showForm"
            class="modal fade"
            id="semesterModal"
            tabindex="-1"
            aria-labelledby="semesterModalLabel"
            aria-hidden="true"
            @click.self="showForm = false"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="semesterModalLabel">{{ translate('Add new semester') }}</h5>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            @click="showForm = false"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <SemesterForm />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
