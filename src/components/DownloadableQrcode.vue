<template>
    <div class="qr">
        <qrcode-vue :value="qrCodeValue" :key="qrCodeValue" :size="200" ref="qrcode"></qrcode-vue>
        <v-btn  flat @click="downloadQRCode">Stáhnout QR kód</v-btn>
        <v-btn  v-if="canShare" @click="shareQRCode" v-show="false">Sdílet QR kód</v-btn>
    </div>
</template>


<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';
import { ref, computed, Ref } from 'vue';


const qrcode = ref(null) as Ref<typeof QrcodeVue | null>;
const canvas = computed(() => {
    if (!qrcode.value) return null;
    return qrcode.value.$el;
})

defineProps({
    qrCodeValue: {
        type: String,
        required: true
    }
});

function downloadQRCode() {
    if (!canvas.value) return;
    const dataUrl = canvas.value.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'bkp-platba.png';
    link.click();

}

const canShare = computed(() => window.navigator.share !== undefined);

async function shareQRCode() {
    if (!canvas.value) return;
    const dataUrl = canvas.value.toDataURL('image/png');
    const blob = await fetch(dataUrl).then(res => res.blob());
    const file = new File([blob], 'platba-bkp.png', { type: 'image/png' });

    if (navigator.share) {
        navigator.share({
            files: [file],
            title: 'QR Platba',
            text: 'Platba vkladů BK Praha',
        }).catch(error => console.log('Error sharing', error));
    } else {
        alert('Prohlížeč nepodporuje sdílení souborů');
    }
}
</script>

<style scoped>
.qr {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding-bottom: 10px;

   
}

.qr button {
    background-color: #fff6ee;
}

@media screen and (min-width:  37.5em) {
    .qr {
        flex-direction: row;

    }
}

@media screen and (min-width: 56.25em) {
    .qr {
        flex-direction: column;
    }
}

.v-btn {
    width: 200px;
}
</style>