import { Layout, Space } from "antd";
import { useSelector } from "react-redux";
import { AppState } from "redux/reducers";
import { ApiStatus, Network } from "types";
import { Select } from "antd";
import { MainState } from "redux/reducers/mainReducer";
import s from "./index.module.sass";
import { Link } from "react-router-dom";

const { Header } = Layout;

const AppHeader = () => {
  const { networks, serviceStatus, currentNetworkIndex } = useSelector<
    AppState,
    MainState
  >((state) => state.main);
  const network = networks[currentNetworkIndex];

  const getOptions = () =>
    networks.map((network: Network) => ({
      label: network.name,
      value: network.name,
    }));

  return (
    <Header>
      <div className={s.cont}>
        <Link to="/">
          <div className={s.logo}>WLT</div>
        </Link>
        <div>
          <Space>
            Network:
            <Select
              loading={serviceStatus === ApiStatus.PENDING}
              options={getOptions()}
              value={network.name}
            />
          </Space>
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
