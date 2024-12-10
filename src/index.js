import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './Main';
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';
import socket from './config/socket.config';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ChakraProvider>
      <Main />
    </ChakraProvider>
  </BrowserRouter>

);

