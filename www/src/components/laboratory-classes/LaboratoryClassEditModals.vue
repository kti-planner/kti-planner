<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { langId } from '@components/frontend/lang';
import { currentUser } from '@components/frontend/user';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectData } from '@components/subjects/types';
import EditLaboratoryClassForm from '@components/laboratory-classes/EditLaboratoryClassForm.vue';
import MoveLaboratoryClass from '@components/laboratory-classes/MoveLaboratoryClass.vue';
import Modal from '@components/Modal.vue';

const translations = {
    'en': {
        'Edit class': 'Edit class',
        'Class details': 'Class details',
        'Moving classes': 'Moving classes',
    },
    'pl': {
        'Edit class': 'Edytuj zajęcia',
        'Class details': 'Szczegóły zajęć',
        'Moving classes': 'Przesuwanie zajęć',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

defineProps<{
    laboratoryClass: LaboratoryClassData | null;
    semester: SemesterData;
    subject: SubjectData | null;
    showSubject?: boolean | undefined;
}>();

const emit = defineEmits<{
    submit: [];
}>();

const classDetailsModal = useTemplateRef('classDetailsModal');
const moveClassModal = useTemplateRef('moveClassModal');

defineExpose({
    classDetailsModal,
});

function handleClassDetailsSubmit() {
    classDetailsModal.value?.hide();
    emit('submit');
}

function handleMoveClassSubmit() {
    moveClassModal.value?.hide();
    emit('submit');
}

const moveClassModalId = crypto.randomUUID();
</script>

<template>
    <Modal ref="classDetailsModal">
        <template #header>{{ currentUser ? translate('Edit class') : translate('Class details') }}</template>
        <EditLaboratoryClassForm
            v-if="laboratoryClass && subject"
            :laboratory-class
            :subject
            :semester
            show-subject
            @submit="handleClassDetailsSubmit"
        />
        <template v-if="currentUser" #footer>
            <div class="mx-auto">
                <button
                    type="button"
                    class="btn btn-success"
                    data-bs-toggle="modal"
                    :data-bs-target="`#${moveClassModalId}`"
                >
                    {{ translate('Moving classes') }}
                </button>
            </div>
        </template>
    </Modal>

    <Modal v-if="currentUser" ref="moveClassModal" :id="moveClassModalId">
        <template #header>{{ translate('Moving classes') }}</template>
        <MoveLaboratoryClass
            v-if="laboratoryClass && subject"
            :laboratory-class
            :subject
            @submit="handleMoveClassSubmit"
        />
    </Modal>
</template>
