<template>
    <div class="thirdStepValue">
        <h1 class="header">Enter Address</h1>
        <div class="addressInputContainer">
            <div class="addressLine firstLine">
                Country
                <input type="text" class="lineInput" placeholder="Enter country..." v-model="country"/>
            </div>
            <div class="addressLine firstLine">
                Address
                <input type="text" class="lineInput" placeholder="Enter address...." v-model="addressLine"/>
            </div>
            <div class="addressLine firstLine">
                City
                <input type="text" class="lineInput" placeholder="Enter city..." v-model="city"/>
            </div>
            <div class="addressLine">
                Index
                <input type="text" class="lineInput" placeholder="Enter index..." v-model="postIndex"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

let props = defineProps({
    address: Array,
})

let emits = defineEmits({
    'address-input': null,
    'country-input': null,
    'city-input': null,
    'post-index-input': null
})

let addressLine = ref(null);

let country = ref(null);

let city = ref(null);

let postIndex = ref(null);


watch(props, (newValue) => {
    console.log(newValue);
    let address = newValue.address;
    country.value = address.filter((component) => component.types[0] === 'country').map((component) => component.long_name);
    postIndex.value = address.filter((component) => component.types[0] === 'postal_code').map((component) => component.long_name);
    city.value = address.filter((component) => component.types[0] === 'locality').map((component) => component.long_name);
    let addressLineComponents = address.filter((component) => component.types[0] === 'street_number' || component.types[0] === 'route');
    addressLine.value =  addressLineComponents[1] && addressLineComponents[0] ? addressLineComponents[0] ?
        addressLineComponents[1].long_name + ', ' + addressLineComponents[0].long_name : 
        addressLineComponents[0].long_name :  "";
})

watch(addressLine, () => {
    emits('address-input', addressLine.value)
})

watch(country, () => {
    emits('country-input', country.value)
})

watch(city, () => {
    emits('city-input', city.value)
})

watch(postIndex, () => {
    emits('post-index-input', postIndex.value)
})

</script>

<style>
.addressInputContainer {
    border: .5px solid #767676;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
}

.header {
    text-align: center;
}

.addressLine {
    display: flex;
    flex-direction: column;
    padding: 10px 10px 10px 10px;
}

.lineInput {
    font-size: 20px;
    font-family: 'Proxima-Nova';
    padding: 15px 15px 15px 15px;
    width: 400px;
    border: none;
    outline: none;
}

.firstLine {
    border-bottom: .5px #767676 solid;
}
</style>