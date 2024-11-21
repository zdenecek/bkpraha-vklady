<template>
  <v-row justify="center" class="fee-widget">
    <v-col cols="12" md="8" class="flex-col">
      <v-card>
        <v-card-title>
          <h3>Členství</h3>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Jméno" v-model="selection.name" variant="underlined" density="comfortable"
            placeholder="zadejte jméno" persistent-placeholder class="w-50"></v-text-field>
          <v-radio-group v-model="selection.membership">
            <v-radio label="Jsem členem BKP" value="member"></v-radio>
            <v-radio label="Nejsem členem BKP" value="nonmember"></v-radio>
            <v-radio :label="'Chci zaplatit členský příspěvek za rok ' + settings.activeYear" value="pay"></v-radio>
          </v-radio-group>
          <template v-if="selection.membership === 'pay'">
            <v-radio-group v-model="selection.membershipType">
              <template v-slot:label>
                <span class="wrap">Členský příspěvek (včetně rekreačního členství v ČBS)</span>
              </template>
              <v-radio v-for=" _membership,i in memberships" :label="_membership.title" :value="i" :key="i"></v-radio>
            </v-radio-group>
            <v-checkbox v-model="selection.membershipIncludeCompetitive">
              <template v-slot:label>
                <div class="label-tournament">
                  <span>Soutěžní členství v ČBS (+{{ selectedMembership.priceCompetitive }} Kč)</span>
                  <span class="desc">Soutěžní členství je nutné pro účast na některých celostátních soutěžích a umožňuje
                    sběr soutěžních bodů (SB).
                    <a target="_blank" href="https://www.czechbridge.cz/union/437">Více informací zde</a>
                  </span>
                </div>
              </template>
            </v-checkbox>
          </template>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>
          <h3>Soutěže</h3>
        </v-card-title>
        <v-card-text>
          <span>Chci zaplatit za následující soutěže</span>
          <v-form>
            <div v-for=" tournament, i in settings.tournaments">
              <div class="tournament-outer">
                <v-checkbox hide-details="auto" v-model="selection.tournaments[i].selected">
                  <template v-slot:label>
                    <div class="label-tournament">
                      <span class="title">{{ tournament.title }}<span v-if="tournament.evenings > 1">, {{
            tournament.evenings }} kol</span></span>
                      <span>{{ getTournamentPrice(i) }} Kč</span>
                    </div>
                  </template>

                </v-checkbox>
                <v-text-field  class="mt-4 team-selector" v-if="tournament.type === 'teams'"
                  v-show="selection.tournaments[i].selected" v-model="selection.tournaments[i].numberOfMembers"
                  type="number" min="0" :max="tournament.maxMembers" label="Počet členů BKP v týmu" hide-details="auto" :rules="[v => v <= tournament.maxMembers || `Maximálně ${tournament.maxMembers} členové se počítají do slevy`]"
                  variant="underlined" density="compact"></v-text-field>
                <div v-if="tournament.type === 'pairs'" v-show="selection.tournaments[i].selected">
                  <v-checkbox v-model="selection.tournaments[i].payForPartner"  density="compact" :hide-details="true">
                    <template v-slot:label>
                      <div class="label-tournament">
                        <span>Platím i za partnera (+{{  getPartnerTournamentPrice(i) }} Kč)</span>
                        
                      </div>
                    </template>

                  </v-checkbox>
                  <v-checkbox v-model="selection.tournaments[i].partnerMember" label="Partner je členem BKP" density="compact" :hide-details="true"></v-checkbox>
                </div>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card>
        <v-card-title>
          <h3>Platební údaje</h3>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-title>
                Číslo účtu
              </v-list-item-title>
              {{ settings.accNumberLegible }}
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                Částka
              </v-list-item-title>
              <v-text-field v-model="selection.amount" variant="underlined" density="compact" hide-details
                hide-spin-buttons type="number" min="0" step="0.01"></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                Popis
              </v-list-item-title>
              <v-textarea :rows="3" v-model="selection.description" variant="underlined" density="compact"
                :hide-details="true"></v-textarea>
            </v-list-item>
            <v-list-item class="mt-4">
              <v-list-item-title>QR kód</v-list-item-title>
              <downloadable-qrcode :qrCodeValue="qrCodeValue" />
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>


<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { parseSettings, type PaymentOptions } from '@/model.ts';
import DownloadableQrcode from '@/components/DownloadableQrcode.vue';


type TournamentSelection = {
  selected: boolean,
  numberOfMembers?: number,
  payForPartner: boolean,
  partnerMember: boolean
}
const selection = ref({
  tournaments: [] as TournamentSelection[],
  membership: 'member' as 'member' | 'nonmember' | 'pay',
  membershipType: 0,
  membershipIncludeCompetitive: false,
  amount: 0,
  description: '',
  name: ''
})
const props = defineProps({
  paymentOptions: {
    type: Object as () => PaymentOptions,
    required: true
  }
});


const settings = computed(() => parseSettings(props.paymentOptions));
const membership = computed(() => selection.value.membership !== 'nonmember');
const memberships = computed(() => settings.value.memberships);
const selectedMembership = computed(() => memberships.value[selection.value.membershipType]);
const membershipPrice = computed(() => {

  if(selection.value.membership !== 'pay') return 0;
  return  selectedMembership.value.price + (selection.value.membershipIncludeCompetitive ? selectedMembership.value.priceCompetitive : 0);
})

function getTournamentPrice(index: number) {
  return _getTournamentPrice(index, membership.value);
}

function getPartnerTournamentPrice(index: number) {
  return _getTournamentPrice(index, selection.value.tournaments[index].partnerMember);
}

function _getTournamentPrice(index: number, membership: boolean) {
  const tournament = settings.value.tournaments[index];
  if (tournament.type === 'pairs') {
    return membership ? tournament.priceMember : tournament.priceNonmember;
  } else {
    const membersCount = selection.value.tournaments[index].numberOfMembers ?? 0;
    return tournament.basePrice - (tournament.discountPerMember * Math.min(membersCount, tournament.maxMembers));
  }
}

function updateTournaments() {
  selection.value.tournaments = settings.value.tournaments.map(_ => {
    return {
      selected: false,
      numberOfMembers: membership.value ? 1 : 0,
      payForPartner: false,
      partnerMember: false
    }
  });
}
watch(settings, () => updateTournaments());
updateTournaments();
watch(membership, () => {
  selection.value.tournaments.forEach(t => {
    if (t.numberOfMembers === 0 && membership.value) t.numberOfMembers = 1;
    if (t.numberOfMembers === 1 && !membership.value) t.numberOfMembers = 0;
  })
})
const calculatedAmount = computed(() => {
  const tournamentsPrices = settings.value.tournaments.map((_, i) => {
    if (selection.value.tournaments[i].selected) {
      return getTournamentPrice(i) + (selection.value.tournaments[i].payForPartner ? getPartnerTournamentPrice(i) : 0);
    }
    return 0;
  });
  return tournamentsPrices.reduce((acc, val) => acc + val, membershipPrice.value);
})
watch(calculatedAmount, (newVal) => {
  selection.value.amount = newVal;
})
const generatedDescription = computed(() => {
  const names = settings.value.tournaments.map((t, i) => {
    if (selection.value.tournaments[i].selected) {
      const members = Math.min(selection.value.tournaments[i].numberOfMembers ?? 0, t.maxMembers);
      return t.abbreviation + (t.type === 'teams' && members ? `-${members}` : '')
       + (t.type === 'pairs'  && selection.value.tournaments[i].payForPartner ? '-partner' : '');
    }
  }).filter(t => t);
  if (selection.value.membership === 'pay') {
    names.push((selectedMembership.value.description ?? "clenstvi") +'-' + settings.value.activeYear.toString().slice(2));
  }
  return `${selection.value.name} - ${names.join(', ')}`;
})
watch(generatedDescription, (newVal) => {
  selection.value.description = newVal;
})
const qrCodeValue = computed(() => settings.value.qrTemplate
  .replace('{msg}', encodeURIComponent(selection.value.description))
  .replace('{am}', selection.value.amount.toFixed(2))
);
</script>

<style>
.label-tournament {
  display: flex;
  flex-direction: column;
}

.v-label,
.v-icon {
  opacity: 1 !important;
}

.flex-col {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.desc {
  font-size: 0.8em;
}

.flex {
  display: flex;
  flex-direction: row;
  gap: 2em;
  align-items: center
}

.tournament-outer> :not(:first-child) {
  margin-left: 2.5em;
}


.team-selector {
  max-width: 150px;
  width: 150px;
  margin-left: 2.5em;
}

.wrap {
  white-space: normal;
}
</style>