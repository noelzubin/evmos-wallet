import { gql, useQuery } from "@apollo/client";
import { Bech32, toHex } from "@cosmjs/encoding";
import { AccountData } from "@cosmjs/proto-signing";
import {
  Button,
  Card,
  Collapse,
  Form,
  Input,
  Layout,
  List,
  Modal,
  Space,
  Switch,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as actions from "redux/actionCreators/mainActionCreators";
import { createWallet } from "redux/actionCreators/mainActionCreators";
import { AppState } from "redux/reducers";
import s from "./index.module.sass";

const { Paragraph } = Typography;

const { Panel } = Collapse;
const { Header, Content } = Layout;
const mainStoreSelector = (state: AppState) => state.main;

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { accounts, hasStoredWallet, walletLoading } =
    useSelector(mainStoreSelector);

  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(actions.loadLocalAccounts());
  }, []);

  const onNewWallet = () => {
    dispatch(createWallet());
  };

  const renderNewOrUnlock = () => {
    if (hasStoredWallet)
      return (
        <>
          <Input.Password
            className={s.password}
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            loading={walletLoading}
            size="large"
            type="primary"
            onClick={() => {
              dispatch(actions.unlockWallet(password));
            }}
          >
            Unlock Wallet
          </Button>
        </>
      );

    return (
      <Button
        loading={walletLoading}
        size="large"
        type="primary"
        onClick={onNewWallet}
      >
        New Wallet
      </Button>
    );
  };

  const renderContent = () => {
    if (accounts.length) return <Accounts accounts={accounts} />;

    return (
      <div className={s.content}>
        {renderNewOrUnlock()}
        <Input.TextArea
          rows={3}
          className={s.mnemonic}
          placeholder="Mnemonic"
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
        />
        <Button
          size="large"
          loading={walletLoading}
          onClick={() => dispatch(actions.restoreMnemonic(mnemonic))}
        >
          Restore Wallet
        </Button>
      </div>
    );
  };

  return <Layout>{renderContent()}</Layout>;
};

export default Home;

interface AccountsProps {
  accounts: AccountData[];
}

function useToggle(intialState: boolean = false) {
  const [val, setValue] = useState(intialState);
  const toggleValue = () => setValue(!val);
  return [val, toggleValue] as const;
}

const Accounts: React.FC<AccountsProps> = ({ accounts }) => {
  const [useBech32, toggleBech32] = useToggle(true);
  const balances: any = useSelector<AppState>((state) => state.main.balances);
  const dispatch = useDispatch();

  const asHex = (address: string) => {
    return "0x" + toHex(Bech32.decode(address).data);
  };

  const renderAddress = (address: string) => {
    if (useBech32) return address;

    return asHex(address);
  };

  const getBalancesForAccount = (acc: string) => {
    const accBal = balances[acc];
    if (!accBal) return [];

    return Object.keys(accBal).map((denom) => ({ denom, bal: accBal[denom] }));
  };

  return (
    <div className={s.main}>
      <ImportTokenModal />
      <Space direction="vertical">
        <Switch
          checkedChildren="bech32"
          unCheckedChildren="hex"
          defaultChecked
          onClick={() => toggleBech32()}
        />
        {accounts.map((acc) => (
          <Collapse className={s.collapse}>
            <Panel
              header={
                <Paragraph onClick={(e) => e?.stopPropagation()} copyable>
                  {renderAddress(acc.address)}
                </Paragraph>
              }
              key={acc.address}
            >
              <List
                className={s.balanceList}
                dataSource={getBalancesForAccount(acc.address)}
                renderItem={(item) => (
                  <List.Item>
                    <Card className={s.balanceCard} title={item.denom}>
                      <span className={s.bal}>{item.bal}</span>
                    </Card>
                  </List.Item>
                )}
              />
              <AccountTransactions addr={asHex(acc.address)} />
            </Panel>
          </Collapse>
        ))}
        <Button
          onClick={() => {
            dispatch(actions.setState({ importTokenModalVisible: true }));
          }}
          type="link"
        >
          Import Token
        </Button>
      </Space>
    </div>
  );
};

const columns = [{}];

const ImportTokenModal = () => {
  const [addr, setAddr] = useState("");
  const { importTokenModalVisible } = useSelector(mainStoreSelector);
  const dispatch = useDispatch();
  return (
    <Modal
      onCancel={() => {
        dispatch(actions.setState({ importTokenModalVisible: false }));
      }}
      onOk={() => {
        dispatch(actions.addToken(addr));
      }}
      visible={importTokenModalVisible}
      title="Import an ERC20 Token"
    >
      Contract Address
      <Input value={addr} onChange={(e) => setAddr(e.target.value)} />
    </Modal>
  );
};

interface AccountTransactionsProps {
  addr: string;
}

const AccountTransactions: React.FC<AccountTransactionsProps> = ({ addr }) => {
  const { data, loading } = useQuery(SEARCH_BY_ADRR_QRY, {
    variables: { addr },
  });
  console.log(data);
  return (
    <List
      loading={loading}
      header={<div>Transactions</div>}
      bordered
      dataSource={data?.allTransactions?.nodes || []}
      renderItem={(tx: { txId: string }) => (
        <List.Item>
          <Link to={`transactions/${tx.txId}`}>{tx.txId}</Link>
        </List.Item>
      )}
    />
  );
};

const SEARCH_BY_ADRR_QRY = gql`
  query search {
    allTransactions(orderBy: ID_DESC, first: 10) {
      nodes {
        id
        txId
        fromAddress
        toAddress
      }
    }
  }
`;

// const SEARCH_BY_ADRR_QRY = gql`
//   query search($addr: String!) {
//     allTransactions(
//       orderBy: ID_DESC
//       filter: {
//         or: [
//           { toAddress: { equalTo: $addr } }
//           { fromAddress: { equalTo: $addr } }
//         ]
//       }
//     ) {
//       nodes {
//         id
//         txId
//         fromAddress
//         toAddress
//       }
//     }
//   }
// `;
