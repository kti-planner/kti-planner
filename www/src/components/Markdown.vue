<script setup lang="ts">
import { computed } from 'vue';
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

const { src } = defineProps<{
    src: string;
}>();

const md = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: true,
});

const sanitizedHtml = computed(() => {
    const rawHTML = md.render(src);
    return DOMPurify.sanitize(rawHTML);
});
</script>

<template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="markdown" v-html="sanitizedHtml"></div>
</template>

<style scoped lang="scss">
.markdown {
    display: contents;

    & > *:first-child {
        margin-top: 0;
    }

    & > *:last-child {
        margin-bottom: 0;
    }
}
</style>
