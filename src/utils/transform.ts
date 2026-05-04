import type { ICampaign } from '@/@types/campaigns';
import type { CampaignUpdateClient } from '@/@types/socket';

export const transformCampaignData = (data: ICampaign): CampaignUpdateClient => {
  return {
    ID: data.ID,
    CAMPAIGN_VIDEOS: data.CAMPAIGN_VIDEOS.map((video) => ({
      ID: video.ID,
      CTA_CLICK_CAMPAING: 0,
      CTA_CLICK_TEST_AB: 0,
      BONDS: video.BONDS.map((bond) => ({
        ID: bond.ID,
        BUTTON_CLICK_CAMPAING: 0,
        BUTTON_CLICK_TEST_AB: 0,
      })),
    })),
    ...(data.FEATURE_ID === null
      ? { FEATURE: { EXTERNAL_LINK: undefined } }
      : {
          FEATURE: {
            ...(data.FEATURE.EXTERNAL_LINK
              ? {
                  EXTERNAL_LINK: {
                    ID: data.FEATURE.EXTERNAL_LINK.ID,
                    BUTTON_CLICK_CAMPAING: 0,
                    BUTTON_CLICK_TEST_AB: 0,
                  },
                }
              : { EXTERNAL_LINK: undefined }),
          },
        }),
  };
};

export const transformNumber = (obj: { [key: string]: number }): number => {
  return Object.values(obj).reduce((acc, value) => acc + value, 0);
};
