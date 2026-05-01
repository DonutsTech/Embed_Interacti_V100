import type { ICampaign } from '@/@types/campaigns';
import type { ErrorMessage } from '@/@types/error';
import socket from '@/server';
import { getCampaigns } from '@/service/campaigns';
import { transformCampaignData } from '@/utils/transform';
import { validateStatus } from '@/utils/validate';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StatusContext } from './StatusContext';

interface CampaignContextPros {
  campaignId: string | undefined;
  setCampaignId: React.Dispatch<React.SetStateAction<string | undefined>>;
  testabId: string | undefined;
  setTestabId: React.Dispatch<React.SetStateAction<string | undefined>>;
  error: ErrorMessage | undefined;
  data: ICampaign | undefined;
  loading: boolean;
}

const DEFAULT_VALUE: CampaignContextPros = {
  campaignId: undefined,
  setCampaignId: () => undefined,
  testabId: undefined,
  setTestabId: () => undefined,
  error: undefined,
  data: undefined,
  loading: false,
};

export const CampaignContext = createContext<CampaignContextPros>(DEFAULT_VALUE);

socket.on('connect', () => console.log('[IO] => new connnwct'));

export const CampaignProvider = ({ children }: { children: React.ReactNode }) => {
  const { setLiberary, setClient, setButtonClicked, client, conntectSocket, setConnectSocket, started, setStarted } =
    useContext(StatusContext);
  const [campaignId, setCampaignId] = useState<string | undefined>(undefined);
  const [testabId, setTestabId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<ErrorMessage | undefined>(undefined);
  const [data, setData] = useState<ICampaign | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const fecthCampaigns = async (id: string) => {
    setLoading(true);
    const result = await getCampaigns(id);

    if ('STATUS' in result) {
      setError(result);
    }

    if ('CAMPAIGN' in result) {
      const campaignData = result.CAMPAIGN;
      setButtonClicked(transformCampaignData(campaignData));
      setClient((prev) => ({
        ...prev,
        ID_ANALYTICS: campaignData.ANALYTICS_ID,
        ID_USER: campaignData.USER_ID,
        ID_CAMPAIGN: campaignData.ID,
      }));
      setData(campaignData);
      setLiberary(validateStatus(campaignData));
      setStarted(false);
      setConnectSocket(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (campaignId && conntectSocket && client.ID_ANALYTICS && client.ID_USER) {
      socket.connect();

      socket.emit('init', client);

      socket.on('initSuccess', (data) => {
        setConnectSocket(false);
        setClient(() => ({ ...client, ID_MODEL_PLAY: data.ID_MODEL_PLAY, ID_MODEL_TIME: data.ID_MODEL_TIME, ID_CAMPAIGN: data.ID_CAMPAIGN }));
        localStorage.setItem('view', data.ID_MODEL_PLAY);
      });

      return () => {
        socket.off('initSuccess');
      };
    }
  }, [campaignId, conntectSocket]);

  useEffect(() => {
    if (campaignId && started) {
      fecthCampaigns(campaignId);
    }
  }, [campaignId, testabId, started]);

  const valeu = useMemo(
    () => ({ campaignId, testabId, setCampaignId, setTestabId, data, loading, error }),
    [campaignId, testabId, data, loading, error],
  );

  return <CampaignContext.Provider value={valeu}>{children}</CampaignContext.Provider>;
};
