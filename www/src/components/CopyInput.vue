<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { langId } from '@components/frontend/lang';

const translations = {
    'en': {
        'Copy to clipboard': 'Copy to clipboard',
        'Copied!': 'Copied!',
    },
    'pl': {
        'Copy to clipboard': 'Skopiuj do schowka',
        'Copied!': 'Skopiowano!',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

const { id = crypto.randomUUID() } = defineProps<{
    id?: string;
    value: string;
}>();

const { copy, copied } = useClipboard();
</script>

<template>
    <div class="input-group">
        <input :id type="text" :value readonly class="form-control" />
        <button
            class="btn btn-light"
            :class="{ 'text-success': copied }"
            type="button"
            :title="copied ? translate('Copied!') : translate('Copy to clipboard')"
            :aria-label="copied ? translate('Copied!') : translate('Copy to clipboard')"
            @click="copy(value)"
        >
            <i
                class="bi"
                :class="{
                    'bi-clipboard2': !copied,
                    'bi-clipboard2-check': copied,
                }"
            ></i>
        </button>
    </div>
</template>
