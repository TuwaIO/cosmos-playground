import {
  ToastTransactionCustomization,
  TrackingTxModalCustomization,
  TransactionsInfoModalCustomization,
} from '@tuwaio/nova-transactions';

import { TransactionUnion } from '../../transactions';
import { transactions_history_customization } from './tx_history';

type NovaTxProviderCustomization =
  | {
      toast?: ToastTransactionCustomization<TransactionUnion> | undefined;
      transactionsInfoModal?: TransactionsInfoModalCustomization<TransactionUnion> | undefined;
      trackingTxModal?: TrackingTxModalCustomization<TransactionUnion> | undefined;
    }
  | undefined;

export const nova_tx_provider_customization: NovaTxProviderCustomization = {
  transactionsInfoModal: {
    historyCustomization: transactions_history_customization,
  },
};
