<script setup lang="ts">
import { ref } from 'vue';
import { langId } from '@components/frontend/lang';

const addingFailed = ref(false);

const type = ref<'summer' | 'winter'>();
const year = ref<number>();
const startDate = ref<string>();
const endDate = ref<string>();

async function submit() {
    try {
        const result = await fetch('/semesters/api/semesters/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: type.value,
                year: year.value,
                startDate: startDate.value,
                endDate: endDate.value,
            }),
        });

        if (!result.ok) {
            console.error('API request failed!');
            return;
        }

        const addingSuccess = (await result.json()) as boolean;
        addingFailed.value = !addingSuccess;

        if (addingSuccess) {
            window.location.href = '/semesters/';
        }
    } catch (error) {
        console.log(error);
    }
}

const translations = {
    'en': {
        'Add new semester': 'Add new semester',
        'Close form': 'Close form',
        'Semester Type': 'Semester Type',
        'Winter Semester': 'Winter Semester',
        'Summer Semester': 'Summer Semester',
        'Academic Year Start': 'Academic Year Start Year',
        'Semester Start Date': 'Semester Start Date',
        'Semester End Date': 'Semester End Date',
        'Add': 'Add',
        'Semester with this year and type already exists.': 'Semester with this year and type already exists.',
    },
    'pl': {
        'Add new semester': 'Dodaj nowy semestr',
        'Close form': 'Zamknij formularz',
        'Semester Type': 'Rodzaj Semestru',
        'Winter Semester': 'Semestr Zimowy',
        'Summer Semester': 'Semestr Letni',
        'Academic Year Start': 'Rok Rozpoczęcia Roku Akademickiego',
        'Semester Start Date': 'Data Rozpoczęcia Semestru',
        'Semester End Date': 'Data zakończenia semestru',
        'Add': 'Dodaj',
        'Semester with this year and type already exists.': 'Semestr o podanym roku i rodzaju już istnieje.',
    },
};

function translate(text: keyof (typeof translations)['en']): string {
    return translations[langId][text];
}
</script>

<template>
    <div>
        <form @submit.prevent="submit" class="vstack gap-3 mx-auto" style="max-width: 500px">
            <div>
                <label for="type" class="form-label">{{ translate('Semester Type') }}</label>
                <select v-model="type" id="type" class="form-select" required>
                    <option value="winter">{{ translate('Winter Semester') }}</option>
                    <option value="summer">{{ translate('Summer Semester') }}</option>
                </select>
            </div>

            <div>
                <label for="year" class="form-label">{{ translate('Academic Year Start') }}</label>
                <input v-model="year" type="number" id="year" class="form-control" required />
            </div>

            <div>
                <label for="startDate" class="form-label">{{ translate('Semester Start Date') }}</label>
                <input v-model="startDate" type="date" id="startDate" class="form-control" required />
            </div>

            <div>
                <label for="endDate" class="form-label">{{ translate('Semester End Date') }}</label>
                <input v-model="endDate" type="date" id="endDate" class="form-control" required />
            </div>

            <div class="text-center">
                <button type="submit" class="btn btn-success">{{ translate('Add') }}</button>
            </div>

            <div class="text-center" style="min-height: 1.5em">
                <span v-if="addingFailed" class="text-danger">
                    {{ translate('Semester with this year and type already exists.') }}
                </span>
            </div>
        </form>
    </div>
</template>
