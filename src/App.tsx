import { useContext } from 'react';
import Home from './Home';
import { AnimatedLogo } from './components/AnimateLogo';
import { CampaignContext } from './context/CampaignContext';

function App({ idCampaign, idTestAB }: { idCampaign: string | null | undefined; idTestAB: string | null | undefined }) {
  const { setCampaignId, setTestabId, data, loading } = useContext(CampaignContext);

  if (idCampaign) {
    setCampaignId(idCampaign);
  }

  if (idTestAB) {
    setTestabId(idTestAB);
  }

  return <>{loading ? <AnimatedLogo /> : <>{data ? <Home data={data} /> : null}</>}</>;
}

export default App;
