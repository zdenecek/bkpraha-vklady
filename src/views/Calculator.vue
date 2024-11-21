<template>
    <v-container >
        <v-row>
          <v-col>
            <v-card>
              <v-card-title><h3>Úvod</h3></v-card-title>
              <v-card-text class="intro">
                <p>Tato aplikace slouží pro vygenerování platebních údajů pro platbu členský příspěvků a vkladů do soutěží Bridžového klubu Praha.</p>
                <p>Jednoduše vyplňte údaje - jméno, členství a které soutěže chcete uhradit, a platební údaje se objeví v pravém sloupci (dole, pokud jste na telefonu).</p>
                <p>Spolu s platebními údaji je vygenerován QR kód, ten je možný použít k platbě v telefonu. Platbu lze ale také samozřejmě zadat ručně, stačí zkopírovat číslo účtu, částku a popis (na ten nezapomeňte).</p>
              </v-card-text>
            </v-card>

          </v-col>
        </v-row>
        <v-row  v-if="options === null" >
         <v-col cols="12"> <v-skeleton-loader type="article" class="mt">
        </v-skeleton-loader></v-col>
          <v-col> <v-skeleton-loader type="article" class="mt">
          </v-skeleton-loader></v-col>
        </v-row>
        <entry-fee-calculator v-else :payment-options="options"></entry-fee-calculator>
      </v-container>
</template>

<script setup lang="ts">
import EntryFeeCalculator from '../components/EntryFeeCalculator.vue';
import { ref, Ref } from 'vue';
import type { PaymentOptions } from '../model.ts';

const options = ref(null) as Ref<PaymentOptions | null>;

fetch('./settings.json')
  .then(response => response.json())
  .then(data => options.value = data)
  .catch(error => console.error('Error loading settings', error));
</script>