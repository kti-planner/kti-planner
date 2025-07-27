<script setup lang="ts">
import { onBeforeUnmount, ref, useId } from 'vue';

const { id = useId() } = defineProps<{
    id?: string;
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
                'hide.bs.modal': () => emit('hide'),
                'hidden.bs.modal': () => emit('hidden'),
                'show.bs.modal': () => emit('show'),
                'shown.bs.modal': () => emit('shown'),
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
                            <slot name="header"></slot>
                        </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                    <div v-if="$slots.footer" class="modal-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
