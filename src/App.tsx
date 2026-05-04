import { useContext } from 'react';
import Home from './Home';
import { AnimatedLogo } from './components/AnimateLogo';
import { CampaignContext } from './context/CampaignContext';
import { StatusContext } from './context/StatusContext';

function App({ idCampaign, idTestAB }: { idCampaign: string | null | undefined; idTestAB: string | null | undefined }) {
  const { setCampaignId, setTestabId, data, loading } = useContext(CampaignContext);
  const { open } = useContext(StatusContext);

  if (idCampaign) {
    setCampaignId(idCampaign);
  }

  if (idTestAB) {
    setTestabId(idTestAB);
  }

  return (
    <>
      {loading ? (
        <AnimatedLogo />
      ) : (
        <>{open && !(data === undefined) ? <Home data={data} testAB={!(idTestAB === undefined)} /> : null}</>
      )}
    </>
  );
}

export default App;
