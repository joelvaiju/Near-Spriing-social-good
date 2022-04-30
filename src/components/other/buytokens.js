import React from 'react';
import Big from 'big.js';

export default function Buytickets() {

  const [showNotification, setShowNotification] = React.useState(false)
  const [ticketsCount, setTicketsCount] = React.useState()
  const [showBal, setShowBal] = React.useState(false)
  


  React.useEffect(
    () => {

      
      // in this case, we only care to query the contract when signed in
      if (window.wallet.isSignedIn()) {

        // window.contract is set by initContract in index.js
        window.contract.get_ticket_per_user({ account_id: window.accountId })
          .then(response => {
           
            setTicketsCount(response)
            setShowBal(true)
           if(parseInt(response) > 0){
             localStorage.setItem('disable-game', false);
           }else {
             localStorage.setItem('disable-game', true)
           }

          })
      }
    },

   
    []
  )

    return(
      <>
      <form  onSubmit={async event => {
        event.preventDefault()
        // disable the form while the value gets updated on-chain
        fieldset.disabled = true

        try {
          
          
          // make an update call to the smart contract
          await window.contract.buy_tickets({},

            300000000000000, // attached GAS (optional)
            Big(donation.value || '0').times(10 ** 24).toFixed()

          ).then(response => {
            console.log("test "+response);
            setShowNotification(true)
          })

        } catch (e) {
          console.log("error :"+e.toString())
          alert(
            'Something went wrong! ' + 
            'Maybe you need to sign out and back in? ' +
            'Check your browser console for more info.'
          )
          throw e
        } finally {
          // re-enable the form, whether the call succeeded or failed
          fieldset.disabled = false
        }

       
       

        // remove Notification again after css animation completes
        // this allows it to be shown again next time the form is submitted
        setTimeout(() => {
          setShowNotification(false)
        }, 11000)
      }}>
      <fieldset id="fieldset">
        
        <p >
          <label  htmlFor="donation">Buy tickets</label>
          <input
            
            defaultValue={'0'}
            id="donation"
            min="0"
            type="number"
          />
          <span title="NEAR Tokens">Ⓝ</span>
        </p>
        <button type="submit">
          Buy
        </button>
      </fieldset>
    </form>
    
    {showNotification && <Notification />}
    <div>
    {showBal && <TokenBalance ticketsCount={ticketsCount} />}
    </div>
    </>

)
}

function Notification() {
  
  return (
    <div>
      <p style={{ textAlign: "center" }}>
                
                Thank you for your consideration your contribution will be used for good cause
      </p>
      
    </div>
  )
}

function TokenBalance(ticketsCount){

  console.log("test "+ JSON.stringify(ticketsCount))

  return (
    <div>
      <p style={{ textAlign: "center" }}>
                
                Your Ticket Balance : {ticketsCount.ticketsCount}
      </p>
      
    </div>
  )
  
}

