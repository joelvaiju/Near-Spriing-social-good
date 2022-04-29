import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'
import Header from './components/other/header'

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


export default function App() {

  const [ticketsCount, setTicketsCount] = React.useState()

  React.useEffect(
    () => {

      
      // in this case, we only care to query the contract when signed in
      if (window.walletConnection.isSignedIn()) {

        // window.contract is set by initContract in index.js
        window.contract.get_ticket_per_user({ account_id: window.accountId })
          .then(response => {
            console.log("res"+JSON.stringify(response));
            setTicketsCount(response)

          })
      }
    },

   
    []
  )
 


  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Welcome to NEAR!</h1>
        <p>
          To make use of the NEAR blockchain, you need to sign in. The button
          below will sign you in using NEAR Wallet.
        </p>
        <p>
          By default, when your app runs in "development" mode, it connects
          to a test network ("testnet") wallet. This works just like the main
          network ("mainnet") wallet, but the NEAR Tokens on testnet aren't
          convertible to other currencies – they're just for testing!
        </p>
        <p>
          Go ahead and click the button below to try it out:
        </p>
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
    <li><Link to="/about">About</Link></li>
    <li><Link to="/buytickets">Buy Tickets</Link></li>
      <li><Link to="/tetris">Tetris</Link></li>
      <li><Link to="/snake">Snake</Link></li>
      
    </ul>
  </nav>
  <div id="routes">
     <Routes >
     <Route  path="/about" element={<About />} />
     <Route  path="/buytickets" element={<Buytickets />} />
        <Route  path="/tetris" element={<Tetris id="game"/>} />
        <Route path="/snake" element={<Snake size={550} />} />
    </Routes>
   </div>   
</section>

</Router>
     
     


   

     
    </>
  )
}
