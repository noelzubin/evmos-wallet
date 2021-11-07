import React from "react";
import { useEffect } from "react";
import s from "./App.module.sass";
import { Button, Layout } from "antd";
import AppProvider from "./providers";
import AppRoutes from "routes";

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
