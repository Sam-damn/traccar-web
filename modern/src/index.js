import 'typeface-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider, StyledEngineProvider } from '@mui/material';
import store from './store';
import { LocalizationProvider } from './common/components/LocalizationProvider';
import ErrorHandler from './common/components/ErrorHandler';
import theme from './common/theme';
import Navigation from './Navigation';
import preloadImages from './map/core/preloadImages';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import NativeInterface from './common/components/NativeInterface';
import ServerProvider from './ServerProvider';

preloadImages();

ReactDOM.render(
  (
    <Provider store={store}>
      <LocalizationProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ServerProvider>
              <BrowserRouter>
                <Navigation />
              </BrowserRouter>
            </ServerProvider>
            <ErrorHandler />
            <NativeInterface />
          </ThemeProvider>
        </StyledEngineProvider>
      </LocalizationProvider>
    </Provider>
  ), document.getElementById('root'),
);

serviceWorkerRegistration.register();
