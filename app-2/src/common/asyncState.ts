import { ref } from "vue";

export default function useAyncState<T>(promise: Promise<T>) {
    const state = ref<T | null>(null);

    const execute = async () => {
        state.value = await promise;
    }

    execute();

    return state;
}