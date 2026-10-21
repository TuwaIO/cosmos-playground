import { readAcceptedMethods } from '@/app/actions';
import { HomePage } from '@/components/HomePage';

// `?order=` is where the checkout returns the buyer after paying (the invoice's success URL). The methods are read on
// every visit, so a method added in the Quasar dashboard shows after a reload
export default async function Home({ searchParams }: { searchParams: Promise<{ order?: string | string[] }> }) {
  const [{ order }, methods] = await Promise.all([searchParams, readAcceptedMethods()]);
  return <HomePage highlight={typeof order === 'string' ? order : null} methods={methods} />;
}
