<script setup lang="ts">
const model = defineModel<string>({ default: '' });
const visible = defineModel<boolean>('visible', { default: false });

defineProps<{
    id: string;
    placeholder: string;
    autocomplete: string;
}>();
</script>

<template>
    <div class="input-group">
        <input
            :id
            v-model="model"
            :type="visible ? 'text' : 'password'"
            class="form-control"
            :placeholder
            :autocomplete
            required
        />
        <button type="button" class="btn border focus-ring" @click="visible = !visible">
            <i class="bi" :class="`bi-${visible ? 'eye-slash' : 'eye'}`"></i>
        </button>
    </div>
</template>
