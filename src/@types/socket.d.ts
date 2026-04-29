export interface Client {
  ID_CAMPAIGN: string | undefined;
  ID_ANALYTICS: string | undefined;
  ID_USER: string | undefined;
  ID_MODEL_PLAY: string | undefined;
  ID_MODEL_TIME: string | undefined;
  BROWSER: string;
  DEVICE: string;
  OS: string;
  COUNTRY: string;
  CITY: string;
  REGION: string;
  PLAY: number;
  VIEW: number;
  TIMESCREEN: number;
}

export interface CampaignUpdateClient {
  ID: string;
  CAMPAIGN_VIDEOS: CampaignVideoClient[];
  FEATURE: {
    EXTERNAL_LINK: externalLinkClient | undefined;
  };
}

export interface externalLinkClient {
  ID: string;
  BUTTON_CLICK_CAMPAING: number;
  BUTTON_CLICK_TEST_AB: number;
}

export interface CampaignVideoClient {
  ID: string;
  CTA_CLICK_CAMPAING: number;
  CTA_CLICK_TEST_AB: number;
  BONDS: BondClient[];
}

export interface BondClient {
  ID: string;
  BUTTON_CLICK_CAMPAING: number;
  BUTTON_CLICK_TEST_AB: number;
}
