// components/Providers.tsx
"use client";

import AuthSync from "@/Component/AuthSync";
import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthSync /> {/* ← Sync session on mount */}
        {children}
      </PersistGate>
    </Provider>
  );
};

export default Providers;