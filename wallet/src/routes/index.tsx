import { Switch, Route } from "react-router-dom";
import Home from "features/Home";
import { useDispatch, useSelector } from "react-redux";
import { connectNetwork } from "redux/actionCreators/mainActionCreators";
import { useEffect } from "react";
import { Layout, Spin } from "antd";
import AppHeader from "components/AppHeader";
import { ApiStatus } from "types";
import { AppState } from "redux/reducers";
import Transactions from "features/Transactions";

const { Header, Content } = Layout;

export const Routes = () => {
  const dispatch = useDispatch();

  const networkStatus: ApiStatus = useSelector<AppState, ApiStatus>(
    (state) => state.main.serviceStatus
  );

  // Connect to default network on app load.
  useEffect(() => {
    dispatch(connectNetwork(0));
  }, []);

  return (
    <Spin tip="Network Loading" spinning={networkStatus === ApiStatus.PENDING}>
      <Layout style={{ minHeight: "100vh" }}>
        <AppHeader />
        <Content style={{ height: "100%" }}>
          <Switch>
            <Route path="/transactions/:id?">
              <Transactions />
            </Route>
            <Route>
              <Home />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </Spin>
  );
};

export default Routes;
