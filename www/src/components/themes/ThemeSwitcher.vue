<script setup lang="ts">
import { watchEffect } from 'vue';
import { useStorage } from '@vueuse/core';
import { langId } from '@components/frontend/lang';
import IconButton from '@components/IconButton.vue';

const translations = {
    'en': {
        'Change theme': 'Change theme',
        'Themes': 'Themes',
        'Modern': 'Modern',
        'Classic (green)': 'Classic (green)',
    },
    'pl': {
        'Change theme': 'Zmień motyw',
        'Themes': 'Motywy',
        'Modern': 'Nowoczesny',
        'Classic (green)': 'Klasyczny (zielony)',
    },
};

function translate(text: keyof (typeof translations)[LangId]): string {
    return translations[langId][text];
}

type Theme = 'modern' | 'classic';

const theme = useStorage('theme', 'modern');

watchEffect(() => {
    document.documentElement.dataset.bsTheme = theme.value;
});

const themeLabels: Record<Theme, string> = {
    'modern': translate('Modern'),
    'classic': translate('Classic (green)'),
};
</script>

<template>
    <div class="btn-group">
        <IconButton
            icon="palette-fill"
            :title="translate('Change theme')"
            :aria-label="translate('Change theme')"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        />
        <ul class="dropdown-menu dropdown-menu-sm-end">
            <li>
                <h6 class="dropdown-header">{{ translate('Themes') }}</h6>
            </li>
            <li v-for="(label, themeName) in themeLabels" :key="themeName">
                <button class="dropdown-item" type="button" @click="theme = themeName">
                    <i class="bi bi-check text-success" :class="{ 'invisible': theme !== themeName }"></i>
                    {{ label }}
                </button>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
.dropdown-item {
    --bs-dropdown-link-active-bg: var(--bs-success);
}
</style>
