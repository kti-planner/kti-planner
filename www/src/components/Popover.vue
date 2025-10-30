<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import { type MaybeElement, unrefElement, useEventListener } from '@vueuse/core';

export type PopoverPlacement = bootstrap.Tooltip.PopoverPlacement;
export type PopoverTrigger = bootstrap.Tooltip.Options['trigger'];

const {
    element,
    contentRendering = 'defer-until-open',
    title,
    placement = 'top',
    trigger = 'click',
} = defineProps<{
    element: MaybeElement;
    contentRendering?: 'always' | 'defer-until-open' | 'when-open' | undefined;
    title: string;
    placement?: PopoverPlacement | undefined;
    trigger?: PopoverTrigger | undefined;
}>();

const emit = defineEmits<{
    hide: [];
    hidden: [];
    show: [];
    shown: [];
}>();

const popoverContentElement = useTemplateRef('popoverContentElement');

function createPopover(domElement: Element | null | undefined) {
    if (domElement) {
        new window.bootstrap.Popover(domElement, {
            html: true,
            title,
            content: popoverContentElement.value!,
            placement,
            trigger,
        });
    }
}

function disposePopover(domElement: Element | null | undefined) {
    if (domElement) {
        window.bootstrap.Popover.getInstance(domElement)!.dispose();
    }
}

let isMounted = false;

watch([() => unrefElement(element), () => title, () => placement, () => trigger], (newValues, oldValues) => {
    const oldDomElement = oldValues[0];
    const newDomElement = newValues[0];

    if (!isMounted) {
        return;
    }

    disposePopover(oldDomElement);
    createPopover(newDomElement);
});

onMounted(() => {
    isMounted = true;
    createPopover(unrefElement(element));
});

onBeforeUnmount(() => {
    disposePopover(unrefElement(element));
});

function getInstance(): bootstrap.Popover | null {
    const domElement = unrefElement(element);

    if (!domElement) {
        return null;
    }

    const instance = window.bootstrap.Popover.getInstance(domElement);

    if (!instance) {
        throw new Error('Failed to get popover instance');
    }

    return instance;
}

function show() {
    getInstance()?.show();
}

function hide() {
    getInstance()?.hide();
}

const contentVisible = ref<boolean>(false);

const renderSlotContent = computed<boolean>(
    (isRendered = false) =>
        contentRendering === 'always' ||
        (contentRendering === 'defer-until-open' && isRendered) ||
        contentVisible.value,
);

useEventListener(
    () => unrefElement(element),
    'hide.bs.popover',
    () => emit('hide'),
);

useEventListener(
    () => unrefElement(element),
    'hidden.bs.popover',
    () => {
        emit('hidden');
        contentVisible.value = false;
    },
);

useEventListener(
    () => unrefElement(element),
    'show.bs.popover',
    () => {
        contentVisible.value = true;
        emit('show');
    },
);

useEventListener(
    () => unrefElement(element),
    'shown.bs.popover',
    () => emit('shown'),
);

defineExpose({
    show,
    hide,
});
</script>

<template>
    <!-- eslint-disable-next-line vue/no-lone-template -->
    <template>
        <div ref="popoverContentElement" class="d-contents">
            <slot v-if="renderSlotContent"></slot>
        </div>
    </template>
</template>
