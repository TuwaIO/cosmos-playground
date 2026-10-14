import { HomePage } from '@/components/HomePage';

// `?order=` is where the checkout returns the buyer after paying (the invoice's success URL)
export default async function Home({ searchParams }: { searchParams: Promise<{ order?: string | string[] }> }) {
  const { order } = await searchParams;
  return <HomePage highlight={typeof order === 'string' ? order : null} />;
}
