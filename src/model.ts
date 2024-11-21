export type PaymentOptions = {
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

export function parseSettings(settings: PaymentOptions): PaymentOptions {
  const memberships = settings.memberships.map((membership) => ({
    ...membership,
    title: formatMembershipTitle(membership.title, settings.activeYear),
  }));

  return {
    ...settings,
    memberships,
  };
}
