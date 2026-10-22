<script setup lang="ts">
import { ref } from 'vue'
import { AeroForm, useLocale } from 'aero-vue'
import { AeroFormItem } from 'aero-vue'
import { AeroInput } from 'aero-vue'
import { AeroTextarea } from 'aero-vue'
import { AeroButton } from 'aero-vue'
// 表单 label/提示/校验文案原硬编码中文 → 走词包 demo 组
const { demo } = useLocale()
const t = demo

const name = ref('')
const desc = ref('')
const err = ref('')

function onBlur() {
  err.value = name.value ? '' : t.value['form.required']
}
function submit() {
  if (!name.value) {
    err.value = t.value['form.required']
    return
  }
  alert(`${t.value['form.submit']}${name.value}`)
}
</script>

<template>
  <AeroForm style="max-width: 380px" @submit="submit">
    <AeroFormItem :label="t['form.projectLabel']" required :hint="t['form.charHint']" :error="err" style="width: 100%">
      <AeroInput v-model="name" :placeholder="t['form.namePlaceholder']" @blur="onBlur" />
    </AeroFormItem>
    <AeroFormItem :label="t['form.descLabel']" style="width: 100%">
      <AeroTextarea v-model="desc" :placeholder="t['form.descPlaceholder']" />
    </AeroFormItem>
    <AeroButton type="primary" native-type="submit">{{ t['form.submitBtn'] }}</AeroButton>
  </AeroForm>
</template>
