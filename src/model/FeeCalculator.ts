import { FeeConfig, TournamentPaymentOptions } from "@/model";

export type UserTournamentSelection = {
  selected: boolean;
  numberOfMembers?: number;
  payForPartner?: boolean;
  partnerMember?: boolean;
};

export type UserSelection = {
  tournaments: UserTournamentSelection[];
  membership: "member" | "nonmember" | "pay";
  membershipType: number; // index of membership type from config
  membershipIncludeCompetitive: false;
  amount?: number;
  description?: string;
  name: string;
};

export class EntryFeeCalculator {
  public calculateTotal(
    config: FeeConfig,
    userSelection: UserSelection
  ): number {
    const tournamentTotal = this.calculateTournamentTotal(
      config,
      userSelection
    );
    const membershipTotal = this.calculateMembershipTotal(
      config,
      userSelection
    );
    return tournamentTotal + membershipTotal;
  }

  private calculateTournamentTotal(
    config: FeeConfig,
    userSelection: UserSelection
  ): number {
    const playerIsMember =
      userSelection.membership === "member" ||
      userSelection.membership === "pay";
    const tournamentPrices = config.tournaments.map((tournamentConfig, i) => {
      const tournamentSelection = userSelection.tournaments[i];
      const price = this.getTournamentPrice(
        tournamentConfig,
        tournamentSelection,
        playerIsMember
      );
      const priceForPartner = this.getPartnerTournamentPrice(
        tournamentConfig,
        tournamentSelection
      );
      return price + priceForPartner;
    });
    return tournamentPrices.reduce((acc, price) => acc + price, 0);
  }

  private getPartnerTournamentPrice(
    tournament: TournamentPaymentOptions,
    userSelection: UserTournamentSelection
  ): number {
    if (
      !userSelection.selected ||
      !userSelection.payForPartner ||
      tournament.type !== "pairs"
    )
      return 0;
    return userSelection.partnerMember
      ? tournament.priceMember
      : tournament.priceNonmember;
  }

  private getTournamentPrice(
    tournament: TournamentPaymentOptions,
    userSelection: UserTournamentSelection,
    membership: boolean
  ) {
    if (tournament.type === "pairs")
      return membership ? tournament.priceMember : tournament.priceNonmember;

    const membersCount = userSelection.numberOfMembers ?? 0;
    const membersCountCapped = Math.min(membersCount, tournament.maxMembers);
    return (
      tournament.basePrice - tournament.discountPerMember * membersCountCapped
    );
  }

  private calculateMembershipTotal(
    config: FeeConfig,
    userSelection: UserSelection
  ): number {
    if (userSelection.membership !== "pay") return 0;
    const selectedMembership = config.memberships[userSelection.membershipType];
    const addCompetitive = userSelection.membershipIncludeCompetitive;
    const priceCompetitive = addCompetitive ? selectedMembership.priceCompetitive : 0;
    return selectedMembership.price + priceCompetitive;
  }

  public getPaymentDescription(
    config: FeeConfig,
    userSelection: UserSelection
  ): string {
    const tournamentAbbrvs = config.tournaments
    .map((t, i) => {
      if (userSelection.tournaments[i].selected) {
        const members = Math.min(
          userSelection.tournaments[i].numberOfMembers ?? 0,
          t.maxMembers
        );
        return (
          t.abbreviation +
          (t.type === "teams" && members ? `-${members}` : "") +
          (t.type === "pairs" && userSelection.tournaments[i].payForPartner
            ? "-partner"
            : "")
        );
      }
    })
    .filter((t) => t);

  // Membership
  if (userSelection.membership === "pay") {
    const selectedMembership = config.memberships[userSelection.membershipType];
    tournamentAbbrvs.push(
      (selectedMembership.description ?? "clenstvi") +
        "-" +
        config.activeYear.toString().slice(2)
    );
  }

  return `${userSelection.name} - ${tournamentAbbrvs.join(", ")}`;
  }
}
