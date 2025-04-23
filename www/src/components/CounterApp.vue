<script setup lang="ts">
import { langId } from '@components/frontend/lang';
import { ref } from 'vue';

const count = ref<number>(0);
const incrementCount = ref<number>(1);

const translations = {
    'en': {
        'Vue counter': 'Vue counter',
        'Count': 'Count',
        'Increment vue counter': 'Increment vue counter',
    },
    'pl': {
        'Vue counter': 'Licznik vue',
        'Count': 'Liczba',
        'Increment vue counter': 'Zwiększ licznik vue',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}
</script>

<template>
    {{ translate('Vue counter') }}: {{ count }}
    <br />
    <div>
        <div class="form-floating">
            <input
                v-model="incrementCount"
                type="number"
                id="increment-count-input"
                class="form-control"
                :placeholder="translate('Count')"
            />
            <label for="increment-count-input">{{ translate('Count') }}</label>
        </div>
        <button type="button" class="btn btn-primary" @click="count += incrementCount">
            {{ translate('Increment vue counter') }}
        </button>
    </div>
</template>
