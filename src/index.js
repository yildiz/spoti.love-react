import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter as Router,Route } from "react-router-dom";
import reducer from "./store/reducers/reducer";
import thunk from "redux-thunk";
import Girisekrani from "./Components/GirisEkrani/GirisEkrani";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

const app = (
    <Provider store={store}>
        <Router>    
        <Route exact path="/" component={Girisekrani} />
        <Route  path="/app" component={App} />        
        </Router>
    </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
