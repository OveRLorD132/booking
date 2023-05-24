<template>
  <div class="property">
    <div class="propertyLabel">{{ name }}</div>
    <div class="propertyValue" v-if="!isEditing">{{ value }}</div>
    <input type="text" class="propertyValueInput" v-model="editedValue" v-if="isEditing"/>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

let props = defineProps({
  name: String,
  value: null,
  isEditing: Boolean
})

let emits = defineEmits({
  'value-changed': null
})

let editedValue = ref(props.value);

watch(editedValue, (newValue) => {
  emits('value-changed', newValue);
})
</script>

<style lang="scss">
@import '../../../public/stylesheets/colors.scss';
.property {
  font-size: 18px;
  padding: 10px 10px 10px 10px;
  width: 250px;
}

.propertyValue {
  padding: 10px 10px 10px 0;
  color: $button-red;
  font-size: 20px;
  border-bottom: 3px solid $button-red;
}

.propertyValueInput {
  padding: 10px 10px 10px 0;
  color: $button-red;
  font-size: 20px;
  outline: none;
  border: none;
  border-bottom: 3px solid $button-red;
}
</style>