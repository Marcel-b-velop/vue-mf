import { mount } from '@vue/test-utils'
import BaseInput from '../BaseInput.vue'

import { describe, expect, test } from 'vitest'
import { ref } from 'vue'

describe('BaseInput Component', () => {
  test('label und placeholder werden korrekt angezeigt', () => {
    const label = 'Test'
    const wrapper = mount(BaseInput, { props: { label } })
    expect(wrapper.find('label').text()).toBe(label)
    expect(wrapper.find('input').attributes('placeholder')).toBe(label)
  })

  test('value wird korrekt initialisiert und angezeigt', async () => {
    const label = 'Test'
    const value = ref('Abc')
    const wrapper = mount(BaseInput, { props: { label, modelValue: value.value } })
    expect(wrapper.find('input').element.value).toBe(value.value)

    await wrapper.find('input').setValue('Def')
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
  })

  test('value wird korrekt gesetzt und angezeigt', async () => {
    const label = 'Test'
    const value = ref()
    const wrapper = mount(BaseInput, { props: { label, modelValue: value.value } })
    await wrapper.find('input').setValue('Def')
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
  })
})
