<template>
    <button
        v-if="!link"
        class="primary"
        :class="{ disabled: loading }"
        @click="handleClick"
    >
        <span v-if="loading" class="loader"></span>
        <span v-else>
            <slot></slot>
        </span>
    </button>

    <router-link
        v-else
        :to="to"
        class="link"
        :class="['button', mode]"
        :style="{ width: customWidth }"
    >
        <slot></slot>
    </router-link>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    link: {
        type: Boolean,
        default: false,
    },
    to: {
        type: String,
        default: '/',
    },
    loading: {
        type: Boolean,
        default: false,
    },
    mode: {
        type: String,
        default: '',
    },
    customWidth: {
        type: String,
        default: '100%',
    },
})

const emit = defineEmits(['click'])

function handleClick() {
    if (!props.loading) {
        emit('click')
    }
}
</script>

<style scoped>
.primary {
    padding: 0.4rem 1rem;
    font-weight: 400;
    border-radius: 1rem;
    background: #0084ff;
    box-shadow: 0px 0px 10px 0px rgba(95, 95, 95, 0.25);
    color: #fff;
    line-height: normal;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 1.5rem;
    height: 100%;
    text-decoration: none;
    width: 100%;
    transition: 0.15s all;
    box-sizing: border-box;

    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

.primary:not(.disabled):hover {
    cursor: pointer;
    transform: scale(1.02);
}

.loader {
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    position: absolute;
}

.disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
