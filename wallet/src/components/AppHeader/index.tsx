import { Layout, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "redux/reducers";
import { ApiStatus, Network } from "types";
import { Select } from "antd";
import { MainState } from "redux/reducers/mainReducer";
import * as actions from "redux/actionCreators/mainActionCreators";
import s from "./index.module.sass";
import { Link } from "react-router-dom";

const { Header } = Layout;

const AppHeader = () => {
  const dispatch = useDispatch();
  const { networks, serviceStatus, currentNetworkIndex } = useSelector<
    AppState,
    MainState
  >((state) => state.main);

  const network = networks[currentNetworkIndex];

  const getOptions = () =>
    networks.map((network: Network, ind: number) => ({
      label: network.name,
      value: ind,
    }));

  const handleNetworkChange = (ind: number) => {
    dispatch(actions.connectNetwork(ind));
  };

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
              value={currentNetworkIndex}
              onChange={handleNetworkChange}
            />
          </Space>
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
