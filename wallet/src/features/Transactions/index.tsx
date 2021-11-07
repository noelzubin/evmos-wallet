import { useQuery, gql, useLazyQuery } from "@apollo/client";
import { Input, Button, Card } from "antd";
import { transcode } from "buffer";
import { Descriptions, Empty } from "antd";
import { useParams } from "react-router";
import s from "./index.module.sass";

import { useState, useEffect } from "react";

const Transactions: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [txid, setTxid] = useState("");
  const [loadTransaction, { loading, data }] = useLazyQuery(
    TRANSACTIONS_QUERY,
    {
      fetchPolicy: "network-only",
      variables: {
        txid,
      },
    }
  );

  useEffect(() => {
    if (params.id) {
      loadTransaction({ variables: { txid: params.id } });
      setTxid(params.id);
    }
  }, []);

  const searchTxn = () => {
    console.log("this was calle");
    loadTransaction({ variables: { txid } });
  };

  const txns = data?.allTransactions?.nodes;

  const renderTxn = () => {
    if (!txns) return <Empty> Search for a transaction </Empty>;
    if (Array.isArray(txns)) {
      if (txns.length) {
        return <Transaction txn={txns[0]} />;
      } else {
        return <Empty> Transaction not found </Empty>;
      }
    }
  };

  return (
    <div>
      <div className={s.search}>
        <Input value={txid.trim()} onChange={(e) => setTxid(e.target.value)} />
        <Button type="primary" loading={loading} onClick={searchTxn}>
          Search
        </Button>
      </div>
      <div>{renderTxn()}</div>
    </div>
  );
};

export default Transactions;

const TRANSACTIONS_QUERY = gql`
  query getTransaction($txid: String!) {
    allTransactions(orderBy: ID_DESC, filter: { txId: { equalTo: $txid } }) {
      nodes {
        data
        fromAddress
        nodeId
        toAddress
        txId
        id
      }
    }
  }
`;

interface TransactionProps {
  txn: any;
}
const Transaction: React.FC<TransactionProps> = ({ txn }) => {
  console.log(txn);
  return (
    <Card className={s.txInfo}>
      <Descriptions title="Transaction Info" bordered layout="vertical">
        <Descriptions.Item label="Id">{txn.txId}</Descriptions.Item>
        <Descriptions.Item label="to">{txn.toAddress}</Descriptions.Item>
        <Descriptions.Item label="from">{txn.fromAddress}</Descriptions.Item>
        <Descriptions.Item label="data">
          <code>{JSON.stringify(JSON.parse(txn.data), null, 2)}</code>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
