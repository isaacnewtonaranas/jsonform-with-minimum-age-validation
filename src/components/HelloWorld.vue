<template>
  <div id="app" class="jsonform">
    <json-forms
      :data="data"
      :renderers="renderers"
      :schema="schema"
      :uischema="setupUischema"
      @change="onChange"
    />
    <div class="error">
      {{
        jsonFormsErrors.length
          ? jsonFormsErrors.find(a => a.custom_message)?.custom_message
          : ''
      }}
    </div>
    <br />
    <button v-if="canNext">Next</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue'


import {
  vanillaRenderers,
} from '@jsonforms/vue-vanilla'
import schema from '../forms/schema.json'
import uischema from '../forms/uischema.json'
import jsonFormHelper from '../forms/jsonFormHelper'

const renderers = [...vanillaRenderers]

const jsonFormsErrors = ref<Record<string, any>[]>([])

const data = ref<Record<string, any>>({})

const setupUischema = ref(
  jsonFormHelper.setupBirthDateField(JSON.parse(JSON.stringify(uischema)))
)

const canNext = computed(() => {
  const birthdateError = jsonFormsErrors.value.find(
    (error) => error.custom_scope === '#/properties/birthDate'
  )
  return !birthdateError && data.value.birthDate
})

const onChange = async (event: JsonFormsChangeEvent) => {
  const oldData = { ...data.value }
  data.value = event.data
  const oldErrors = jsonFormHelper.errors

  const { minYearsUischema, minYearsErrors } = jsonFormHelper.minYears(
    setupUischema.value,
    oldData,
    event.data,
    'birthDate',
    oldErrors
  )
  setupUischema.value = minYearsUischema

  jsonFormHelper.errors = []
  jsonFormHelper.errors = minYearsErrors

  jsonFormsErrors.value = []
  jsonFormsErrors.value = event.errors?.concat(minYearsErrors) || []
}
</script>
<style>
.jsonform {
  width: 300px;
}
.k-widget {
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.42857143;
  color: #333333;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 3px;
}

.k-form {
  margin: 0;
  padding: 10px;
}

.label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.input {
  display: block;
  width: 100%;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555555;
  background-color: #ffffff;
  background-image: none;
  border: 1px solid #cccccc;
  border-radius: 3px;
}

.error {
  color: red;
  margin-top: 5px;
}

.vertical-layout {
  display: flex;
  flex-direction: column;
}

.vertical-layout-item {
  margin-bottom: 10px;
}

.input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>
