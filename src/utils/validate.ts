import type { ICampaign } from '@/@types/campaigns';

export const validateStatus = (campaign: ICampaign) => {
  const { USER } = campaign;

  if (!USER) return false;

  const { STRIPE_SUBSCRIPTION_STATUS, HISTORY_PLAYS } = USER;

  if (STRIPE_SUBSCRIPTION_STATUS === 'trialing') {
    const testePlays = HISTORY_PLAYS.find((h) => h.STATUS === 'teste');

    if (testePlays && testePlays.QTD_PLAYS >= 1000) {
      return false;
    }

    return true;
  }

  if (STRIPE_SUBSCRIPTION_STATUS === 'active') return true;

  return false;
};
