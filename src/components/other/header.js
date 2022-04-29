import React from 'react';
import './header.css';
import { logout } from '../../utils';


export default function Header({tickets}) {

    return(
  <div className="header">
      <>
    
    <button id="signout" onClick={logout}>
        Sign out
    </button>
    <main>
      <h1>Grain of raise</h1>
    </main>
   
    </>
    
  </div>

)
}
