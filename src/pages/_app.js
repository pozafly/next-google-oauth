import { Provider as ReduxProvider } from 'react-redux';
import store from '@/store/store.js';

export default function App({ Component, pageProps }) {
  return (
    <ReduxProvider store={store}>
      <Component {...pageProps} />
    </ReduxProvider>
  );
}
