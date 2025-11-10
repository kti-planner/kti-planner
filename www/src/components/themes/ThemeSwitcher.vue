<script setup lang="ts">
import { computed } from 'vue';
import { type RemovableRef, useStorage, useStyleTag } from '@vueuse/core';
import { langId } from '@components/frontend/lang';
import classicCSS from '@components/themes/classic.css?raw';
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

const themes: Record<Theme, string> = {
    'modern': '',
    'classic': classicCSS,
};

const theme = useStorage('theme', 'modern') as RemovableRef<Theme>;
const themeCSS = computed<string>(() => themes[theme.value]);
useStyleTag(themeCSS);
</script>

<template>
    <div class="dropdown-">
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
            <li>
                <button
                    class="dropdown-item"
                    type="button"
                    :style="{ paddingLeft: theme !== 'modern' ? '38px' : undefined }"
                    @click="theme = 'modern'"
                >
                    <i v-if="theme === 'modern'" class="bi bi-check text-success"></i>
                    {{ translate('Modern') }}
                </button>
            </li>
            <li>
                <button
                    class="dropdown-item"
                    type="button"
                    :style="{ paddingLeft: theme !== 'classic' ? '38px' : undefined }"
                    @click="theme = 'classic'"
                >
                    <i v-if="theme === 'classic'" class="bi bi-check text-success"></i>
                    {{ translate('Classic (green)') }}
                </button>
            </li>
        </ul>
    </div>
</template>
