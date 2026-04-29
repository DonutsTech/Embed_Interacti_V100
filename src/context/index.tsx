import { CampaignProvider } from './CampaignContext';
import { StatusProvider } from './StatusContext';

type ProviderProps = { children: React.ReactNode };
type ProviderComponent = React.ComponentType<ProviderProps>;

function composeProviders(providers: ProviderComponent[]) {
  return function ComposedProvider({ children }: ProviderProps) {
    return providers.reduceRight((acc, Provider) => {
      return <Provider>{acc}</Provider>;
    }, children);
  };
}

const providers: ProviderComponent[] = [StatusProvider, CampaignProvider];

export const AppProviders = composeProviders(providers);
