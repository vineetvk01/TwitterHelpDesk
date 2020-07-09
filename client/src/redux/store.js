import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import rootReducers from './reducers';
import rootSaga from './saga';

const configureStore = ( intialStore = {}) => {
  let composeEnhancers = compose;
  const sagaMiddleware = createSagaMiddleware();

  if (process.env.REACT_APP_NODE_ENV !== 'production' && typeof window === 'object') {
    if(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__){
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    }
  }
  
  const enhancers = [applyMiddleware(sagaMiddleware)];

  const store = createStore(
    rootReducers,
    intialStore,
    composeEnhancers(...enhancers)
  );
  
  sagaMiddleware.run(rootSaga)

  const persistor = persistStore(store);
  
  return {store, persistor};
}

export default configureStore;