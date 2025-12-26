declare module 'remote-app1/App1' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'remote-app2/App2' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'remote-app2/LoginForm' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'remote-app2/RegisterForm' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'remote-lib/BaseInput' {
  import { DefineComponent } from 'vue'

  interface BaseInputProps {
    label?: string
    modelValue?: string | number
    errorMessage?: string
  }

  interface BaseInputEmits {
    (event: 'update:modelValue', value: string | number | null): void
  }

  const component: DefineComponent<BaseInputProps, {}, {}, {}, {}, {}, {}, BaseInputEmits>
  export default component
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
