import { Component, createElement } from 'react';
import { Provider } from 'react-redux';
import { createHoc } from 'react-common-kit';
import createAppState from './appState';
import { CubeContext } from './context';

/**
 * @param {object} config see appState's param
 * @returns {function}
 */
export default function createApp({ plugins, loaders, ...originConfig }) {
  let config = originConfig;
  if (plugins) {
    plugins.forEach(plugin => {
      config = plugin(config);
    });
  }
  const isSsrEnv = typeof location !== 'object';
  const {
    ErrorBoundary,
    ErrorBoundaryProps = {},
    // autogenerated
    // withRouter
    _enableRouter = false,
    _createRouterHistory,
    _ConnectedRouter: ConnectedRouter,
    routerConfig,
    // withI18next
    _enableI18next = false,
    _I18nextProvider,
    _initClientI18n,
    // withPersist
    _enablePersist = false,
    _PersistGate: PersistGate,
    // withImmutable
  } = config;
  return createHoc(
    SubAppComponent =>
      class WithAppState extends Component {
        // https://redux.js.org/docs/recipes/IsolatingSubapps.html
        // https://gist.github.com/gaearon/eeee2f619620ab7b55673a4ee2bf8400
        constructor(props) {
          super(props);
          const {
            appConfig = {},
            baseUrl,
            reportPreloadInfo,
            preloadedAppState = {},
          } = props;
          let { store, persistor, routerHistory } = preloadedAppState;
          if (!store) {
            routerHistory =
              _enableRouter &&
              _createRouterHistory({
                basename: routerConfig.basename || baseUrl,
              });
            const dynamicConfig = Object.assign(
              { _routerHistory: routerHistory },
              config,
              appConfig,
            );
            ({ store, persistor } = createAppState(dynamicConfig));
          }
          Object.assign(this, {
            store,
            persistor,
            routerHistory,
          });
          if (isSsrEnv && !preloadedAppState.store && reportPreloadInfo) {
            reportPreloadInfo({
              store,
              routerHistory,
              loaders,
            });
          }
        }

        render() {
          const { store, persistor } = this;
          const {
            StaticRouter,
            currentUrl,
            hostname,
            routerContext,
            baseUrl,
            i18n,
            reportPreloadInfo,
            preloadedAppState = {},
            ...passThroughProps
          } = this.props;
          loaders.forEach(loader => {
            loader.propsMemory = {};
          });
          let root = createElement(
            CubeContext.Provider,
            {
              value: {
                enableSsrPreload: reportPreloadInfo && !preloadedAppState.store,
              },
            },
            createElement(SubAppComponent, {
              ...passThroughProps,
              hostname,
            }),
          );
          if (_enableI18next && (!isSsrEnv || i18n)) {
            root = createElement(
              _I18nextProvider,
              {
                i18n: isSsrEnv ? i18n : _initClientI18n(),
              },
              root,
            );
          }
          if (_enableRouter) {
            root = createElement(
              isSsrEnv ? StaticRouter : ConnectedRouter,

              isSsrEnv
                ? {
                    basename: routerConfig.basename || baseUrl,
                    location: currentUrl,
                    context: routerContext,
                  }
                : {
                    history: this.routerHistory,
                    ...routerConfig,
                  },
              root,
            );
          }
          // https://github.com/rt2zz/redux-persist#usage
          if (!isSsrEnv && _enablePersist) {
            root = createElement(
              PersistGate,
              { persistor, loading: null },
              root,
            );
          }
          root = createElement(
            // https://redux.js.org/docs/basics/UsageWithReact.html#passing-the-store
            Provider,
            { store },
            // https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux#usage
            root,
          );
          if (ErrorBoundary) {
            root = createElement(ErrorBoundary, ErrorBoundaryProps, root);
          }
          return root;
        }
      },
  );
}
