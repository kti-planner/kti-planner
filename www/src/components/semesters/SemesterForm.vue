<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiPatch, apiPost } from '@components/api';
import type { SemesterData } from '@components/semesters/types';

const props = defineProps<{
    semester?: SemesterData;
}>();

const submitFailed = ref(false);

const type = ref<'summer' | 'winter' | undefined>(props.semester?.type);
const year = ref<number | undefined>(props.semester?.year);
const startDate = ref<string | undefined>(props.semester?.startDate);
const endDate = ref<string | undefined>(props.semester?.endDate);

async function submit() {
    const success =
        props.semester === undefined
            ? await apiPost<boolean>('/semesters/api/semesters/', {
                  type: type.value,
                  year: year.value,
                  startDate: startDate.value,
                  endDate: endDate.value,
              })
            : await apiPatch<boolean>('/semesters/api/semesters/', {
                  id: props.semester.id,
                  type: type.value,
                  year: year.value,
                  startDate: startDate.value,
                  endDate: endDate.value,
              });

    submitFailed.value = !success;

    if (success) {
        window.location.assign(`/semesters/${year.value}-${type.value}/`);
    }
}

const translations = {
    'en': {
        'Semester type': 'Semester type',
        'Winter semester': 'Winter semester',
        'Summer semester': 'Summer semester',
        'Academic year': 'Academic year',
        'Semester start date': 'Semester start date',
        'Semester end date': 'Semester end date',
        'Save': 'Save',
        'Add': 'Add',
        'Semester with this year and type already exists.': 'Semester with this year and type already exists.',
    },
    'pl': {
        'Semester type': 'Rodzaj semestru',
        'Winter semester': 'Semestr zimowy',
        'Summer semester': 'Semestr letni',
        'Academic year': 'Rok rozpoczęcia roku akademickiego',
        'Semester start date': 'Data rozpoczęcia semestru',
        'Semester end date': 'Data zakończenia semestru',
        'Save': 'Zapisz',
        'Add': 'Dodaj',
        'Semester with this year and type already exists.': 'Semestr o podanym roku i rodzaju już istnieje.',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}
</script>

<template>
    <form class="vstack gap-3 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label for="type" class="form-label">{{ translate('Semester type') }}</label>
            <select id="type" v-model="type" class="form-select" required>
                <option value="winter">{{ translate('Winter semester') }}</option>
                <option value="summer">{{ translate('Summer semester') }}</option>
            </select>
        </div>

        <div>
            <label for="year" class="form-label">{{ translate('Academic year') }}</label>
            <input id="year" v-model="year" type="number" class="form-control" required />
        </div>

        <div>
            <label for="startDate" class="form-label">{{ translate('Semester start date') }}</label>
            <input id="startDate" v-model="startDate" type="date" class="form-control" required />
        </div>

        <div>
            <label for="endDate" class="form-label">{{ translate('Semester end date') }}</label>
            <input id="endDate" v-model="endDate" type="date" class="form-control" required />
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">{{ translate(semester ? 'Save' : 'Add') }}</button>
        </div>

        <div v-if="submitFailed" class="text-center text-danger">
            {{ translate('Semester with this year and type already exists.') }}
        </div>
    </form>
</template>
