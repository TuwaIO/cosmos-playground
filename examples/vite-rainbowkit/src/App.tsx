import { TransactionsBlock } from './components/TransactionsBlock';
import { Providers } from './providers';

export function App() {
  return (
    <Providers>
      <div className="h-screen w-screen flex justify-center items-center">
        <TransactionsBlock />
      </div>
    </Providers>
  );
}
