import { useContext } from 'react';
import Home from './Home';
import { AnimatedLogo } from './components/AnimateLogo';
import { CampaignContext } from './context/CampaignContext';
import { StatusContext } from './context/StatusContext';
import { isUUID } from './utils/validate';

function App({ idCampaign, idTestAB }: { idCampaign: string | null | undefined; idTestAB: string | null | undefined }) {
  const { setCampaignId, setTestabId, data, loading } = useContext(CampaignContext);
  const { open } = useContext(StatusContext);

  if (idCampaign && isUUID(idCampaign || '')) {
    setCampaignId(idCampaign);
  }

  if (idTestAB && isUUID(idTestAB || '')) {
    setTestabId(idTestAB);
  }

  return (
    <>
      {loading ? (
        <AnimatedLogo />
      ) : (
        <>{open && !(data === undefined) ? <Home data={data} testAB={isUUID(idTestAB || '')} /> : null}</>
      )}
    </>
  );
}

export default App;
