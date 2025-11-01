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
    if (props.subject?.duration === 105 || props.subject?.duration === 165) {
        return props.subject?.duration;
    }

    if (props.subject?.duration !== null && props.subject?.duration !== undefined) {
        return 'custom';
    }

    return null;
});

const duration = ref<number | 'custom' | null>(initDuration.value);
const customDuration = ref<number | null>(props.subject?.duration ?? null);
const classRepeat = ref<number | null>(props.subject?.classRepeat ?? null);

async function submit() {
    if (duration.value === 'custom' && customDuration.value?.toString() === '') {
        customDuration.value = null;
    }

    if (classRepeat.value?.toString() === '') {
        classRepeat.value = null;
    }

    const success =
        props.subject === undefined
            ? await apiPost<boolean>('/semesters/api/subjects/', {
                  name: subjectName.value,
                  semesterId: props.semester.id,
                  teacherIds: teachers.value.map(user => user.id),
                  description: description.value,
                  moodleCourseId: moodleCourseId.value,
                  duration: duration.value === 'custom' ? customDuration.value : duration.value,
                  classRepeat: classRepeat.value,
              } satisfies SubjectCreateApiData)
            : await apiPatch<boolean>('/semesters/api/subjects/', {
                  id: props.subject.id,
                  name: subjectName.value,
                  teacherIds: teachers.value.map(user => user.id),
                  description: description.value,
                  moodleCourseId: moodleCourseId.value,
                  duration: duration.value === 'custom' ? customDuration.value : duration.value,
                  classRepeat: classRepeat.value,
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
        'Duration (minutes)': 'Duration (minutes)',
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
        'Duration (minutes)': 'Czas trwania (minuty)',
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
            <label :for="nameId" class="form-label"
                >{{ translate('Subject name') }} <span class="text-danger">*</span></label
            >
            <input :id="nameId" v-model="subjectName" type="text" class="form-control" required autofocus />
        </div>

        <div>
            <label :for="moodleCourseInputId" class="form-label">{{ translate('Moodle course ID') }}</label>
            <input :id="moodleCourseInputId" v-model="moodleCourseId" type="text" class="form-control" />
        </div>

        <div>
            <label :for="descriptionId" class="form-label">{{ translate('Description') }}</label>
            <textarea
                :id="descriptionId"
                v-model="description"
                class="form-control"
                :placeholder="translate('Markdown is supported')"
            ></textarea>
        </div>

        <div>
            <label :for="teachersId" class="form-label"
                >{{ translate('Teachers') }} <span class="text-danger">*</span></label
            >
            <UserMultiSelector :id="teachersId" v-model="teachers" :options="allUsers" required />
        </div>

        <div>
            <label :for="durationId" class="form-label">{{ translate('Duration (minutes)') }}</label>
            <select :id="durationId" v-model="duration" class="form-select">
                <option :value="105">105</option>
                <option :value="165">165</option>
                <option value="custom">{{ translate('Custom') }}</option>
            </select>
            <input v-if="duration === 'custom'" v-model="customDuration" type="number" class="form-control" min="0" />
        </div>

        <div>
            <label :for="classRepeatId" class="form-label">{{
                translate('How many weeks are between classes?')
            }}</label>
            <input :id="classRepeatId" v-model="classRepeat" type="number" min="1" class="form-control" />
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
