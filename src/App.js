

import './global.css'
import Header from './components/other/header'
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
  useRouteMatch,
  useParams
} from "react-router-dom";

import getConfig from './config'
import Snake from './components/games/snake/snake'
import Tetris from './components/games/tetris/tetris'
import Buytickets from './components/other/buytokens'
import About from './components/other/about'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import Big from 'big.js';


const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
 

  const [ticketsCount, setTicketsCount] = React.useState(0)
  const [enablebtn, setEnablebtn] = React.useState(false)

 window.wallet = wallet;
 window.contract = contract;
 
 window.accountId = currentUser ? currentUser.accountId : " ";

  React.useEffect(
    () => {

      
      // in this case, we only care to query the contract when signed in
      if (currentUser) {

        // window.contract is set by initContract in index.js
       contract.get_ticket_per_user({ account_id: currentUser.accountId })
          .then(response => {
           
           console.log("testhb")
            if(parseInt(response)>0){

              setTicketsCount(parseInt(response))
              setEnablebtn(false);
            }else{
              setEnablebtn(true)
            }

          })
      }
    },

   
    []
  )
 

  
  const login = () => {
    wallet.requestSignIn(
      {contractId: nearConfig.contractName}, //contract requesting access
      'NEAR Guest Book', //optional name
      null, //optional URL to redirect to if the sign in was successful
      null //optional URL to redirect to if the sign in was NOT successful
    );
  };

  const logout = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };


  // if not signed in, return early with sign-in prompt
  if (!currentUser) {
    return (
      <main>
        
        <img src={require("./assets/gaming.png")} className="logo" />
        
       
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    )
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    
    <>
    <Header tickets={ticketsCount} />  

    
<Router>   
<section>
  <nav>
    
    <ul>
    <li><Link to="/">About</Link></li>
    <li><Link to="/buytickets">Buy Tickets</Link></li>
      <li><strong>Games</strong></li>
      <li><Link to="/snake">Snake</Link></li>
      
    </ul>
  </nav>
  <div id="routes">
     <Routes >
     <Route  path="/" element={<About />} />
     <Route  path="/buytickets" element={<Buytickets />} />
        
        <Route path="/snake" element={<Snake size={550} enablebtn={enablebtn} />} />
    </Routes>
   </div>   
</section>

</Router>
     
     


   

     
    </>
  )
}

App.propTypes = {
  contract: PropTypes.shape({
    get_ticket_per_user: PropTypes.func.isRequired,
    buy_tickets: PropTypes.func.isRequired
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};




export default App;