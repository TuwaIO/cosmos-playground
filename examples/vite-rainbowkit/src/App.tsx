import { TransactionsBlock } from './components/TransactionsBlock';
import { Providers } from './providers';

export function App() {
  return (
    <Providers>
      <div className="w-full flex justify-center items-center min-h-[100dvh]">
        <TransactionsBlock />
      </div>
    </Providers>
  );
}
