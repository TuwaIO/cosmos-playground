import { readAcceptedMethods } from '@/app/actions';
import { OrdersPage } from '@/components/orders/OrdersPage';

export const metadata = { title: 'Orders · Cosmos Store' };

export default async function Orders() {
  const methods = await readAcceptedMethods();
  return <OrdersPage methods={methods.ok ? methods.methods : []} />;
}
