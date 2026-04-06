import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from "react-redux";
import store from "./redux/store";

import { GoogleOAuthProvider } from "@react-oauth/google"

import App from './App'

import PageLoading from './helpers/Components/PageLoading';

import "./index.css"

ReactDOM.createRoot(document.getElementById('root')).render(

  <Suspense fallback={<PageLoading />}>
    <GoogleOAuthProvider clientId={`${import.meta.env.VITE_APP_GOOGLE_ID}`}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </Suspense>

)
