// pages/_app.js
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store from "../redux/store"; // Default import for store
import { persistor } from "../redux/store"; // Named import for persistor


// Loading component for PersistGate
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

function MyApp({ Component, pageProps }) {
  // Safeguard against undefined store
  if (!store) {
    console.error("Redux store is undefined in _app.js");
    return <div>Error: Redux store failed to initialize</div>;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;