import type { CampaignUpdateClient, Client } from '@/@types/socket';
import { positionCity } from '@/service/position';
import { createContext, useEffect, useMemo, useState } from 'react';
import { UAParser } from 'ua-parser-js';

interface StatusContextPros {
  liberary: boolean;
  setLiberary: React.Dispatch<React.SetStateAction<boolean>>;
  client: Client;
  setClient: React.Dispatch<React.SetStateAction<Client>>;
  buttonClicked: CampaignUpdateClient | undefined;
  setButtonClicked: React.Dispatch<React.SetStateAction<CampaignUpdateClient | undefined>>;
  conntectSocket: boolean;
  setConnectSocket: React.Dispatch<React.SetStateAction<boolean>>;
  started: boolean;
  setStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

const DEFAULT_VALUE: StatusContextPros = {
  liberary: true,
  setLiberary: () => {},
  client: {
    ID_ANALYTICS: undefined,
    ID_USER: undefined,
    ID_MODEL_PLAY: undefined,
    ID_MODEL_TIME: undefined,
    BROWSER: '',
    DEVICE: '',
    OS: '',
    COUNTRY: '',
    CITY: '',
    REGION: '',
    PLAY: 0,
    VIEW: 0,
    TIMESCREEN: 0,
  },
  setClient: () => {},
  buttonClicked: undefined,
  setButtonClicked: () => {},
  conntectSocket: false,
  setConnectSocket: () => {},
  started: false,
  setStarted: () => {},
};

export const StatusContext = createContext<StatusContextPros>(DEFAULT_VALUE);

export const StatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [liberary, setLiberary] = useState<boolean>(DEFAULT_VALUE.liberary);
  const [client, setClient] = useState<Client>(DEFAULT_VALUE.client);
  const [buttonClicked, setButtonClicked] = useState<CampaignUpdateClient | undefined>(DEFAULT_VALUE.buttonClicked);
  const [conntectSocket, setConnectSocket] = useState<boolean>(DEFAULT_VALUE.conntectSocket);
  const [started, setStarted] = useState<boolean>(DEFAULT_VALUE.started);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const client = localStorage.getItem('view') || undefined;

        const parser = new UAParser();
        const uaResult = parser.getResult();
        const position = await positionCity();

        const clientData: Client = {
          ID_MODEL_PLAY: client,
          DEVICE: uaResult.device.type || 'desktop',
          BROWSER: uaResult.browser.name || 'desconhecido',
          OS: uaResult.os.name || 'desconecido',
          COUNTRY: position?.COUNTRY || 'desconecido',
          CITY: position?.CITY || 'desconecido',
          REGION: position?.REGION || 'desconecido',
          PLAY: 0,
          VIEW: 0,
          TIMESCREEN: 0,
          ID_ANALYTICS: undefined,
          ID_USER: undefined,
          ID_MODEL_TIME: undefined,
        };

        setClient((prev) => ({ ...prev, ...clientData }));
        setStarted(true);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  const value = useMemo(
    () => ({
      liberary,
      setLiberary,
      client,
      setClient,
      buttonClicked,
      setButtonClicked,
      conntectSocket,
      setConnectSocket,
      started,
      setStarted,
    }),
    [liberary, client, buttonClicked, conntectSocket],
  );

  return <StatusContext.Provider value={value}>{children}</StatusContext.Provider>;
};
