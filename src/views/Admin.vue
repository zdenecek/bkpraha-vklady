<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h2 class="mr-8">Úprava nastavení kalkulačky</h2>
        <div>
          <v-btn class="mr-2" @click="saveJson" color="primary" variant="flat"
            >Uložit</v-btn
          >
          <v-btn to="/" color="info"> Přejít na kalkulačku </v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form v-if="settings" ref="form" v-model="isValid">
          <v-container>
            <v-row>
              <v-col cols="12" md="2">
                <!-- Active Year -->
                <v-text-field
                  v-model="settings.activeYear"
                  label="Aktivní rok"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <!-- Account Number -->
                <v-text-field
                  v-model="settings.accNumberLegible"
                  label="Číslo účtu"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- QR Template -->
                <v-text-field
                  v-model="settings.qrTemplate"
                  label="QR šablona ({msg} - zpráva, {am} - částka)"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- Tournaments -->
            <v-row>
              <v-col>
                <h3>Turnaje</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                v-for="(tournament, index) in settings.tournaments"
                :key="index"
              >
                <v-card>
                  <v-card-title>
                    {{ tournament.title || "Nový turnaj" }}
                    <v-btn
                      @click="removeTournament(index)"
                      color="red"
                      variant="tonal"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-text-field
                      v-model="tournament.title"
                      label="Název"
                    ></v-text-field>
                    <div class="flex">
                      <v-select
                        hide-details="auto"
                        v-model="tournament.type"
                        :items="['pairs', 'teams']"
                        label="Typ"
                      ></v-select>
                      <v-text-field
                        v-model="tournament.abbreviation"
                        label="Zkratka"
                      ></v-text-field>
                      <v-text-field
                        v-model="tournament.priceMember"
                        label="Cena člen"
                        type="number"
                        v-if="tournament.type === 'pairs'"
                      ></v-text-field>
                      <v-text-field
                        v-model="tournament.priceNonmember"
                        label="Cena nečlen"
                        type="number"
                        v-if="tournament.type === 'pairs'"
                      ></v-text-field>
                      <v-text-field
                        v-model="tournament.basePrice"
                        label="Zakladní cena"
                        type="number"
                        v-if="tournament.type === 'teams'"
                      ></v-text-field>
                      <v-text-field
                        v-model="tournament.discountPerMember"
                        label="Sleva na člena"
                        type="number"
                        v-if="tournament.type === 'teams'"
                      ></v-text-field>
                      <v-text-field
                        v-model="tournament.maxMembers"
                        label="Max členů"
                        type="number"
                        v-if="tournament.type === 'teams'"
                      ></v-text-field>
                      <v-text-field
                        v-model="tournament.evenings"
                        label="Večerů"
                        type="number"
                      ></v-text-field>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col>
                <v-btn
                  @click="addTournament"
                  color="primary"
                  prepend-icon="mdi-plus"
                  >Přidat turnaj</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <!-- Memberships -->
                <h3>Členství</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                v-for="(membership, index) in settings.memberships"
                :key="index"
                cols="12"
              >
                <v-card>
                  <v-card-title>
                    {{
                      formatMembershipTitle(
                        membership.title,
                        settings.activeYear
                      ) || "Nové"
                    }}
                    <v-btn
                      @click="removeMembership(index)"
                      color="red"
                      variant="tonal"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-card-text>
                    <v-text-field
                      class="flex-grow"
                      v-model="membership.title"
                      label="Název"
                    ></v-text-field>
                    <div class="flex">
                      <v-text-field
                        v-model="membership.description"
                        label="Popis v textu platby"
                      ></v-text-field>
                      <v-text-field
                        v-model="membership.price"
                        label="Cena"
                        type="number"
                      ></v-text-field>
                      <v-text-field
                        v-model="membership.priceCompetitive"
                        label="Příplatek za soutěžní"
                        type="number"
                      ></v-text-field>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col>
                <v-btn
                  @click="addMembership"
                  color="primary"
                  prepend-icon="mdi-plus"
                  >Přidat členství</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn class="ml-auto" @click="saveJson" color="primary" variant="flat"
          >Uložit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts" >
import { formatMembershipTitle, FeeConfig } from "@/model";
import { Ref, ref } from "vue";

const isValid = ref(true);

const settings = ref() as Ref<FeeConfig | null>;

fetch("./settings.json")
  .then((response) => response.json())
  .then((data) => (settings.value = data))
  .catch((error) => console.error("Error loading settings", error));

const addTournament = () => {
  settings.value?.tournaments.push({
    title: "",
    type: "pairs",
    abbreviation: "",
    priceMember: 0,
    priceNonmember: 0,
    evenings: 1,
    // @ts-ignore
    discountPerMember: 0,
    basePrice: 0,
    maxMembers: 4,
  });
};

const removeTournament = (index: number) => {
  settings.value?.tournaments.splice(index, 1);
};

const addMembership = () => {
  settings.value?.memberships.push({
    title: "",
    description: "",
    price: 0,
    priceCompetitive: 0,
  });
};

const removeMembership = (index: number) => {
  settings.value?.memberships.splice(index, 1);
};
const saveJson = async () => {
  try {
    const response = await fetch("/api.php", {
      method: "POST",
      body: JSON.stringify({
        settings: settings.value,
        password: prompt("Heslo"),
      }),
      headers: { "Content-Type": "application/json" },
    });

    try {
      const res = await response.json();
      if (res.success) {
        alert("Data saved successfully!");
      } else if (response.status === 403) {
        alert("Invalid password.");
      } else {
        alert("Failed to save data: " + (res.error || "Unknown error"));
      }
    } catch {
      alert("Error parsing the server response.");
    }
  } catch (error) {
    console.error("Error saving JSON:", error);
    alert("Failed to save configuration.");
  }
};
</script>

<style>
.v-card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.flex {
  display: flex;
  gap: 1em;
  margin-top: 1em;
  flex-wrap: wrap;
}

.flex-grow {
  flex-grow: 1;
}
</style>
