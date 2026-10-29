import { readAcceptedMethods } from '@/app/actions';
import { ShopPage } from '@/components/shop/ShopPage';

// The methods are read on every visit, so a method added in the Quasar dashboard shows after a reload
export default async function Home() {
  return <ShopPage methods={await readAcceptedMethods()} />;
}
