<script setup lang="ts">
import { computed, ref } from 'vue';
import { langId } from '@components/frontend/lang';
import { apiDelete, apiPatch, apiPost } from '@components/api';
import type { SemesterData } from '@components/semesters/types';
import type { SubjectCreateApiData, SubjectData, SubjectEditApiData } from '@components/subjects/types';
import type { UserPublicData } from '@components/users/types';
import { toHyphenatedLowercase } from '@components/utils';
import ButtonWithConfirmationPopover from '@components/ButtonWithConfirmationPopover.vue';
import UserMultiSelector from '@components/users/UserMultiSelector.vue';

const props = defineProps<{
    semester: SemesterData;
    subject?: SubjectData;
    allUsers: UserPublicData[];
}>();

const isEditing = computed(() => props.subject !== undefined);

const submitFailed = ref(false);

const subjectName = ref<string>(props.subject?.name ?? '');
const moodleCourseId = ref<string>(props.subject?.moodleCourseId ?? '');
const description = ref<string>(props.subject?.description ?? '');
const teachers = ref<UserPublicData[]>(props.subject?.teachers ?? []);

const initDuration = computed(() => {
    if (props.subject?.durationMinutes === 105 || props.subject?.durationMinutes === 165) {
        return props.subject?.durationMinutes;
    }

    if (props.subject?.durationMinutes !== null && props.subject?.durationMinutes !== undefined) {
        return 'custom';
    }

    return null;
});

const durationMinutes = ref<number | 'custom' | null>(initDuration.value);
const customDurationMinutes = ref<number | null>(props.subject?.durationMinutes ?? null);
const classRepeatWeeks = ref<number | null>(props.subject?.classRepeatWeeks ?? null);

async function submit() {
    if (durationMinutes.value === 'custom' && customDurationMinutes.value?.toString() === '') {
        customDurationMinutes.value = null;
    }

    if (classRepeatWeeks.value?.toString() === '') {
        classRepeatWeeks.value = null;
    }

    const success =
        props.subject === undefined
            ? await apiPost<boolean>('/semesters/api/subjects/', {
                  name: subjectName.value,
                  semesterId: props.semester.id,
                  teacherIds: teachers.value.map(user => user.id),
                  description: description.value,
                  moodleCourseId: moodleCourseId.value,
                  durationMinutes:
                      durationMinutes.value === 'custom' ? customDurationMinutes.value : durationMinutes.value,
                  classRepeatWeeks: classRepeatWeeks.value,
              } satisfies SubjectCreateApiData)
            : await apiPatch<boolean>('/semesters/api/subjects/', {
                  id: props.subject.id,
                  name: subjectName.value,
                  teacherIds: teachers.value.map(user => user.id),
                  description: description.value,
                  moodleCourseId: moodleCourseId.value,
                  durationMinutes:
                      durationMinutes.value === 'custom' ? customDurationMinutes.value : durationMinutes.value,
                  classRepeatWeeks: classRepeatWeeks.value,
              } satisfies SubjectEditApiData);

    if (success === undefined) {
        return;
    }

    submitFailed.value = !success;

    if (success) {
        const newUrl = `/semesters/${props.semester.slug}/subjects/${toHyphenatedLowercase(subjectName.value ?? '')}/`;

        if (isEditing.value) {
            window.history.replaceState({}, '', newUrl);
            window.location.reload();
        } else {
            window.location.assign(newUrl);
        }
    }
}

async function doDelete() {
    if (!props.subject) {
        return;
    }

    const result = await apiDelete<boolean>('/semesters/api/subjects/', new URLSearchParams({ id: props.subject.id }));

    if (result) {
        window.location.assign(`/semesters/${props.semester.slug}/`);
    }
}

const translations = {
    'en': {
        'Subject name': 'Subject name',
        'Moodle course ID': 'Moodle course ID',
        'Description': 'Description',
        'Teachers': 'Teachers',
        'Save': 'Save',
        'Add': 'Add',
        'Subject with this name already exists.': 'Subject with this name already exists.',
        'Markdown is supported': 'Markdown is supported',
        'Delete subject': 'Delete subject',
        'Class duration': 'Class duration',
        'Custom': 'Custom',
        'How many weeks are between classes?': 'How many weeks are between classes?',
    },
    'pl': {
        'Subject name': 'Nazwa przedmiotu',
        'Moodle course ID': 'ID kursu Moodle',
        'Description': 'Opis',
        'Teachers': 'Nauczyciele',
        'Save': 'Zapisz',
        'Add': 'Dodaj',
        'Subject with this name already exists.': 'Przedmiot o podanej nazwie już istnieje.',
        'Markdown is supported': 'Markdown jest wspierany',
        'Delete subject': 'Usuń przedmiot',
        'Class duration': 'Czas trwania zajęć',
        'Custom': 'Niestandardowy',
        'How many weeks are between classes?': 'Co ile tygodni zajęcia się powtarzają?',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const nameId = crypto.randomUUID();
const moodleCourseInputId = crypto.randomUUID();
const descriptionId = crypto.randomUUID();
const teachersId = crypto.randomUUID();
const durationId = crypto.randomUUID();
const classRepeatId = crypto.randomUUID();
</script>

<template>
    <form class="vstack gap-2 mx-auto" style="max-width: 500px" @submit.prevent="submit">
        <div>
            <label :for="nameId" class="form-label">
                {{ translate('Subject name') }} <span class="text-danger">*</span>
            </label>
            <input :id="nameId" v-model="subjectName" type="text" class="form-control" required autofocus />
        </div>

        <div>
            <label :for="moodleCourseInputId" class="form-label">
                {{ translate('Moodle course ID') }}
            </label>
            <input :id="moodleCourseInputId" v-model="moodleCourseId" type="text" class="form-control" />
        </div>

        <div>
            <label :for="descriptionId" class="form-label">
                {{ translate('Description') }}
            </label>
            <textarea
                :id="descriptionId"
                v-model="description"
                class="form-control"
                :placeholder="translate('Markdown is supported')"
            ></textarea>
        </div>

        <div>
            <label :for="teachersId" class="form-label">
                {{ translate('Teachers') }} <span class="text-danger">*</span>
            </label>
            <UserMultiSelector :id="teachersId" v-model="teachers" :options="allUsers" required />
        </div>

        <div>
            <label :for="durationId" class="form-label">
                {{ translate('Class duration') }}
            </label>
            <select
                :id="durationId"
                v-model="durationMinutes"
                class="form-select"
                :aria-label="translate('Class duration')"
            >
                <option :value="105">105 min</option>
                <option :value="165">165 min</option>
                <option value="custom">{{ translate('Custom') }}</option>
            </select>

            <div v-if="durationMinutes === 'custom'" class="input-group mt-2">
                <input
                    v-model="customDurationMinutes"
                    type="number"
                    class="form-control"
                    :aria-label="translate('Class duration')"
                    min="0"
                />
                <span class="input-group-text">min</span>
            </div>
        </div>

        <div>
            <label :for="classRepeatId" class="form-label">
                {{ translate('How many weeks are between classes?') }}
            </label>
            <input :id="classRepeatId" v-model="classRepeatWeeks" type="number" min="1" class="form-control" />
        </div>

        <div class="text-center mt-2">
            <button type="submit" class="btn btn-success">
                {{ translate(isEditing ? 'Save' : 'Add') }}
            </button>
            <ButtonWithConfirmationPopover v-if="isEditing" class="btn btn-danger ms-4" @click="doDelete()">
                {{ translate('Delete subject') }}
            </ButtonWithConfirmationPopover>
        </div>

        <div v-if="submitFailed" class="text-center text-danger">
            {{ translate('Subject with this name already exists.') }}
        </div>
    </form>
</template>

<style scoped lang="scss">
textarea {
    min-height: 160px;
}
</style>
