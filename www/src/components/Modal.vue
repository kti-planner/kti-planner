<script setup lang="ts">
const props = defineProps<{ modalId: string }>();
</script>

<template>
    <Teleport to="body">
        <div
            class="modal fade"
            :id="props.modalId"
            tabindex="-1"
            :aria-labelledby="`${modalId}Label`"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" :id="`${modalId}Label`">
                            <slot name="header"></slot>
                        </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div v-if="$slots.body" class="modal-body">
                        <slot name="body"></slot>
                    </div>
                    <div v-if="$slots.footer" class="modal-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
