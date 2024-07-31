




export type  PaymentOptions = {
    tournaments: TournamentPaymentOptions[];
    membership: MembershipPaymentOptions;
    accNumberLegible: string;
    qrTemplate: string;
    activeYear: number;
}

export type MembershipPaymentOptions = {
    price: number;
    priceDiscounted: number;
    priceCompetitive: number;
    priceCompetitiveDiscounted: number;
}

export type TournamentPaymentOptions = ((GroupTournamentPaymentOptions & { type: 'pairs' }) | (TeamTournamentPaymentOptions & { type: 'teams' })) & {
    title: string;
    abbreviation: string;
    evenings: number;
    maxMembers: number;
};

export type GroupTournamentPaymentOptions = {
    priceNonmember: number;
    priceMember: number;
}

export type TeamTournamentPaymentOptions = {
    basePrice: number;
    discountPerMember: number;
}