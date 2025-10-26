import { createCodamaConfig } from 'gill';

export default createCodamaConfig({
  clientJs: 'src/programs/solanatest/generated',
  idl: 'src/targets/solanatest/idl/solanatest.json',
});
