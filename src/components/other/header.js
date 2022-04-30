import React from 'react';
import './header.css';



export default function Header({tickets}) {


  function logout() {
    window.wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  }

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
