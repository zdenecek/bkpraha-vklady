export type FeeConfig = {
  tournaments: TournamentPaymentOptions[];
  memberships: MembershipPaymentOption[];
  accNumberLegible: string;
  qrTemplate: string;
  activeYear: number;
};

export type MembershipPaymentOption = {
  title: string;
  price: number;
  description?: string;
  priceCompetitive: number;
};

export type TournamentPaymentOptions = (
  | (GroupTournamentPaymentOptions & { type: "pairs" })
  | (TeamTournamentPaymentOptions & { type: "teams" })
) & {
  title: string;
  abbreviation: string;
  evenings: number;
  maxMembers: number;
};

export type GroupTournamentPaymentOptions = {
  priceNonmember: number;
  priceMember: number;
};

export type TeamTournamentPaymentOptions = {
  basePrice: number;
discountPerMember: number;
};

function getCutoffs(seasonYear: number) {
  return {
    juniorCutoff: seasonYear - 25,
    youngsterCutoff: seasonYear - 20,
    kidCutoff: seasonYear - 15,
  };
}

export function formatMembershipTitle(
  title: string,
  year: number,
): string {
const cutoffs = getCutoffs(year);
  return title.replace(/\{(\s*\w+\s*)\}/g, (_, key) => {
    const cutoffKey = key.trim();
    // @ts-ignore
    return cutoffs[cutoffKey] !== undefined ? cutoffs[cutoffKey] : `{${key}}`;
  });
}

const tournamentNumericFields = [
  "priceMember",
  "priceNonmember",
  "basePrice",
  "discountPerMember",
  "evenings",
  "maxMembers",
];

const membershipNumericFields = ["price", "priceCompetitive"];

// The admin form stores every field it edits as a string, so a price can come
// back from settings.json as "800". Adding those with + concatenates them.
function withNumericFields<T>(item: T, fields: string[]): T {
  const result = { ...item } as Record<string, unknown>;
  for (const field of fields) {
    const value = result[field];
    if (value !== undefined && value !== null && value !== "") {
      result[field] = Number(value);
    }
  }
  return result as T;
}

export function parseSettings(settings: FeeConfig): FeeConfig {
  const activeYear = Number(settings.activeYear);

  const tournaments = settings.tournaments.map((tournament) =>
    withNumericFields(tournament, tournamentNumericFields)
  );

  const memberships = settings.memberships.map((membership) => ({
    ...withNumericFields(membership, membershipNumericFields),
    title: formatMembershipTitle(membership.title, activeYear),
  }));

  return {
    ...settings,
    activeYear,
    tournaments,
    memberships,
  };
}
