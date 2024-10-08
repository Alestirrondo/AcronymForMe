import './App.css';
import React, { useState, useCallback, Component, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import FindaGame from "./pages/FindaGame";
import GameWaitingPageJoin from "./pages/GameWaitingPageJoin";
import useAuth from './hooks/useAuth';
import GameWaitingPageCreator from './pages/GameWaitingPageCreator';
import GamePage from './pages/GamePage';
let clientId = null;
const ws = new WebSocket("wss://AcronymForMe-api.onrender.com")
const locationHistory = []; 
function App(){
  
  const {setAuth} = useAuth();
  ws.onmessage = message =>{
    const response = JSON.parse(message.data);
    console.log(response)
    if(response.method === "connect"){
      console.log("connected")
      clientId = response.clientID;
      setAuth([clientId]);
    }

    if(response.method === "create"){
      const game = response.game;
      setAuth([clientId, response.game.id, game.clients, game.acronym, game.stage, game.roundWinner, response.method, game.availability, location.pathname])
    }
    
    if(response.method === "RandomServer"){
      const game = response.game;
      const duty = response.duty

      if(duty === "Parent"){
        navigate('/GameWaitingPageCreator')
      }else{
        if(location.pathname === '/GameWaitingPageCreator'){
          navigate('/GameWaitingPageCreator')
        }else{
          if(game.state === "waiting"){
            navigate('/GameWaitingPageJoin')
          }else {
            navigate('/GamePage')
          }
          
        }
      }
      setAuth([clientId, response.game.id, game.clients, game.acronym, game.stage, game.roundWinner, response.method, game.availability, location.pathname])
    }

    if(response.method === "join"){
      const game = response.game;
      const colour = [];
      if(game != null){
        const serverlist = [];
        game.clients.forEach(c =>{
          serverlist.push(c.clientName);
          colour.push(c.colour);
        })
      
        if(location.pathname === '/GameWaitingPageCreator'){
          navigate('/GameWaitingPageCreator')
        }else{
          if(game.state === "waiting"){
            navigate('/GameWaitingPageJoin')
          }else {
            navigate('/GamePage')
          }
        }
        setAuth([clientId, response.game.id, game.clients, game.acronym, game.stage, game.roundWinner, response.method, game.availability, location.pathname])
      }else{
        alert("That game server code does not work");
      }
      
      
    }

    if(response.method === "count"){
      const game = response.game;
      const serverlist = [];
      game.clients.forEach(c =>{
        serverlist.push(c.clientName);
      })

      setAuth([clientId, game.id, game.clients, game.acronym, game.stage, game.roundWinner, response.method, game.availability, location.pathname]);
      
    }

    if(response.method === "start"){
      const game = response.game;
      navigate('/GamePage')
      setAuth([clientId,game.id, game.clients, game.acronym, game.stage, game.roundWinner, response.method, game.availability, location.pathname])
      
    }


    if(response.method === "delete"){
      const game = response.game;
      let x = 0, clientNum;
      if(response.roundchange){
        game.clients.forEach(c =>{
          if(c.clientId === clientId){
            clientNum = x;
          }
          x++;
        })
        const duty = game.clients[clientNum].duty;
        if(duty === "Parent"){
          if( location.pathname === '/GameWaitingPageJoin'){
            navigate('/GameWaitingPageCreator')
          }
          
        }
        setAuth([clientId,game.id,game.clients,game.acronym, game.stage, game.roundWinner, response.roundchange, game.availability, location.pathname])
      }else{
        
        if(response.stage3){
          let turn = false
          game.clients.forEach(c =>{
            if(c.clientId === clientId && c.turn === true){
              turn = true
            }
          })
          if(turn === true){
            setAuth([clientId,game.id,game.clients,game.acronym, game.stage, game.roundWinner, "ping", game.availability, location.pathname])
          }
        }else{
          game.clients.forEach(c =>{
            if(c.clientId === clientId){
              clientNum = x;
            }
            x++;
          })
          const duty = game.clients[clientNum].duty;
          if(duty === "Parent"){
            if( location.pathname === '/GameWaitingPageJoin'){
              navigate('/GameWaitingPageCreator')
            }
            
          }
          setAuth([clientId,game.id,game.clients,game.acronym, game.stage, game.roundWinner, response.method, game.availability, location.pathname])
        }
        
      }
      

    }

    if(response.method === "serverFull"){
      alert("That Server Is currently Full")
      
    }

    if(response.method === "select"){
      const game = response.game
      setAuth([clientId,game.id,game.clients, game.acronym, game.stage, game.roundWinner, response.method, game.availability, location.pathname])
    }

    if(response.method === "submit"){
      const game = response.game
      setAuth([clientId,game.id,game.clients, game.acronym, game.stage, game.roundWinner, response.method, game.availability, location.pathname])
    }
    if(response.method === "point"){
      const game = response.game
      setAuth([clientId,game.id, game.clients, game.acronym, game.stage, game.roundWinner, response.method, game.availability, location.pathname])
    }
    if(response.method === "round"){
      const game = response.game
      setAuth([clientId,game.id, game.clients, game.acronym, game.stage, game.roundWinner, response.method, game.availability, location.pathname])
      setAuth([clientId,game.id, game.clients, game.acronym, game.stage, game.roundWinner, response.method, game.availability, location.pathname])
    }

    if(response.method === "reset"){
      const game = response.game
      setAuth([clientId,game.id, game.clients, game.acronym, game.stage, game.roundWinner, response.method, game.availability, location.pathname])
    }

    if(response.method === "serverClosed"){
      window.location.reload();
      alert("The server has closed due to lack of players")

      setAuth([clientId, null, null, null, null, null, null])
    }
  }
  
  
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    locationHistory.push(location.pathname);
    if(locationHistory[locationHistory.length-1] === "/FindaGame" && (locationHistory[locationHistory.length-2] === "/GameWaitingPageCreator" || locationHistory[locationHistory.length-2] === "/GameWaitingPageJoin" || locationHistory[locationHistory.length-2] === "/GamePage")){
      window.location.reload();
    }
    if((locationHistory[locationHistory.length-1] === "/GameWaitingPageCreator" || locationHistory[locationHistory.length-1] === "/GameWaitingPageJoin") && locationHistory[locationHistory.length-2] === "/GamePage"){
      window.location.reload();
    }
  },[location])
  return (
    <div>
      <HomePage location={location}/>
      <FindaGame location={location}/>
      <GameWaitingPageCreator location={location}/>
      <GameWaitingPageJoin location={location}/>
      <GamePage location={location}/>
    </div>
  );
}


export default App;


