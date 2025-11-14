<script setup lang="ts">
import { watchEffect } from 'vue';
import { type RemovableRef, useStorage } from '@vueuse/core';
import { langId } from '@components/frontend/lang';
import { defaultTheme, type Theme, themeKey } from '@components/themes/types';
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

const themeLabels: Record<Theme, string> = {
    'modern': translate('Modern'),
    'classic': translate('Classic (green)'),
};

const theme = useStorage(themeKey, defaultTheme) as RemovableRef<Theme>;

watchEffect(() => {
    document.documentElement.dataset.bsTheme = theme.value;
});
</script>

<template>
    <div class="dropdown">
        <ul class="dropdown-menu dropdown-menu-end">
            <li><button class="btn dropdown-item" type="button">foo</button></li>
            <li><button class="btn dropdown-item" type="button">bar</button></li>
        </ul>
    </div>

    <div class="btn-group">
        <IconButton
            icon="palette-fill"
            :title="translate('Change theme')"
            :aria-label="translate('Change theme')"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        />
        <ul class="dropdown-menu dropdown-menu-end">
            <li>
                <h6 class="dropdown-header">{{ translate('Themes') }}</h6>
            </li>
            <li v-for="(label, themeName) in themeLabels" :key="themeName">
                <button
                    class="dropdown-item"
                    type="button"
                    :style="{ paddingLeft: theme !== themeName ? '37px' : undefined }"
                    @click="theme = themeName"
                >
                    <i v-if="theme === themeName" class="bi bi-check text-success"></i>
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
