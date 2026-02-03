import { Header } from './components/Header';
import HomePage from './components/HomePage';
import { Providers } from './providers';

export function App() {
  return (
    <Providers>
      <Header />
      <HomePage />
    </Providers>
  );
}
