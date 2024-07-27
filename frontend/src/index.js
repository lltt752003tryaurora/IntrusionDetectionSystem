import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";

// react-router-dom
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store  from "./redux/configStore";

// redux-toolkit


const root = ReactDOM.createRoot(document.getElementById("root"));

if (localStorage.theme === 'dark' || (!('theme' in localStorage) /*&& window.matchMedia('(prefers-color-scheme: dark)').matches*/)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
