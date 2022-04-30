import React from 'react';

export default function About() {

    return(
      <>
  <h4>Welcome to Charity Gamming</h4>
  <img src={require("../../assets/about.png")} className="logo" />
  <p className="center">This project is about providing video games to children in hospitals to help make them feel like kids again.</p>
   <p className="center">Buy in-app tickets and play in-site games – Help provide video games, systems, and other entertainment to kids fighting long term illness!</p>
  <h5>Why There is a need</h5>
  


  <p className="center" >
  Sick children who occupied their minds playing video or computer games 
  required lower doses of pain medication and tended to suffer less from 
  hypertension and nausea than children who were asked to just rest.
  </p>
</>
)
}
