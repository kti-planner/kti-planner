<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

const { id = crypto.randomUUID(), contentRendering = 'when-open' } = defineProps<{
    id?: string;
    contentRendering?: 'always' | 'when-open' | undefined;
    size?: 'sm' | null | 'lg' | 'xl' | undefined;
    centered?: boolean | undefined;
    scrollable?: boolean | undefined;
    staticBackdrop?: boolean | undefined;
}>();

const emit = defineEmits<{
    hide: [];
    hidden: [];
    show: [];
    shown: [];
}>();

const el = ref<HTMLDivElement | null>(null);

function show() {
    if (el.value) {
        window.bootstrap.Modal.getOrCreateInstance(el.value).show();
    }
}

function hide() {
    if (el.value) {
        window.bootstrap.Modal.getOrCreateInstance(el.value).hide();
    }
}

defineExpose({
    show,
    hide,
});

onBeforeUnmount(() => {
    if (el.value) {
        window.bootstrap.Modal.getOrCreateInstance(el.value).dispose();
    }
});

const contentVisible = ref<boolean>(false);
const renderContent = computed(() => contentVisible.value || contentRendering === 'always');

function onHide() {
    emit('hide');
}

function onHidden() {
    emit('hidden');
    contentVisible.value = false;
}

function onShow() {
    contentVisible.value = true;
    emit('show');
}

function onShown() {
    emit('shown');

    if (!el.value) {
        return;
    }

    const autoFocusInput = el.value.querySelector('input[autofocus]');
    if (autoFocusInput instanceof HTMLInputElement) {
        autoFocusInput.focus();
    }
}
</script>

<template>
    <Teleport to="body">
        <div
            ref="el"
            :id="id"
            class="modal fade"
            :data-bs-backdrop="staticBackdrop ? 'static' : true"
            tabindex="-1"
            :aria-labelledby="`${id}-label`"
            aria-hidden="true"
            v-on="{
                'hide.bs.modal': onHide,
                'hidden.bs.modal': onHidden,
                'show.bs.modal': onShow,
                'shown.bs.modal': onShown,
            }"
        >
            <div
                :class="{
                    'modal-dialog': true,
                    'modal-dialog-centered': centered,
                    'modal-dialog-scrollable': scrollable,
                    'modal-sm': size === 'sm',
                    'modal-lg': size === 'lg',
                    'modal-xl': size === 'xl',
                }"
            >
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 :id="`${id}-label`" class="modal-title fs-5">
                            <slot v-if="renderContent" name="header"></slot>
                        </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <slot v-if="renderContent"></slot>
                    </div>
                    <div v-if="$slots.footer" class="modal-footer">
                        <slot v-if="renderContent" name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
