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

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUUID(str: string = ''): boolean {
  return uuidRegex.test(str);
}
