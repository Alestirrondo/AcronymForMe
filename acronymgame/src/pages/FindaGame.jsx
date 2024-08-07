//import logo from './4me.png';
import './FindaGame.css';
import { useNavigate } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import useAuth from '../hooks/useAuth';
const ws = new WebSocket("ws://localhost:9090")

const FindaGame = ({location}) => {
  const navigate = useNavigate();
  const [Height, setHeight] = useState('100hv');
  //const {joinlobby} = useRandomLobby();
  const [user, setUser] =useState({
    nameR: '',
    nameS: '',
    nameC: '',
    code: '',
  });
  const { auth } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const randomLobby = () => {
    if(user.nameR != '' && user.nameR.length < 15){
      const payLoad = {
        "method": "RandomServer",
        "clientId" : auth[0],
        "clientName" : user.nameR
      }
      ws.send(JSON.stringify(payLoad))
    }else{
      if(user.nameR == '')
        alert("Fill in user name!");
      else
        alert("User name is too long")
    }
  };

  const CreateLobby = () => {
    if(user.nameC != '' && user.nameC.length < 15){
      const payLoad = {
        "method": "create",
        "clientId" : auth[0],
        "clientName" : user.nameC
      }
      ws.send(JSON.stringify(payLoad))
      navigate('/GameWaitingPageCreator')
    }else{
      if(user.nameC == '')
        alert("Fill in user name!");
      else
        alert("User name is too long")
    }
  };

  const JoinSpecificLobby = () =>{
    console.log(user.nameS.length)
    if(user.nameS.length != 0 && user.nameS.length < 15){
      const payLoad = {
        "method": "join",
        "clientId" : auth[0],
        "clientName": user.nameS,
        "gameId" : user.code
      }
      
      ws.send(JSON.stringify(payLoad))
      
    }else{
      if(user.nameS == ''){
        alert("Fill in user name!")
      }else{
        alert("User name is too long")
      }
    }
    

  }
  return (location.pathname === '/FindaGame')
  ? (
    <div className="App" style={{ height: Height}}>
      <h1 className="App-header">
        Acronym 4 Me
      </h1>
      <div className = "container">
      <h2 className = "findrandomgame"> 
        Search for a random lobby
        <div className = "space">
          <div>
            Name
          </div>
          <input
            className = "textbox"
            type="text"
            name="nameR"
            value={user.nameR}
            onChange={handleChange}
            />
            
        </div>
        <button className = "button-84" onClick={() => randomLobby()}>
          Join Game
        </button>
      </h2>
      <h2 className = "entergamecode"> 
        Search for a lobby using a code
        <div className = "space">
          <div>
            Name
          </div>
          <input
            className = "textbox"
            type="text"
            name="nameS"
            value={user.nameS}
            onChange={handleChange}
            />
        </div>
        <div className = "space">
          <div>
            Code
          </div>
          <input
            className = "textbox"
            type="text"
            name="code"
            value={user.code}
            onChange={handleChange}
            />
        </div>
        <button className = "button-84" onClick={() => JoinSpecificLobby()}>
          Join Game
        </button>
      </h2>
      </div>
      <h3 className = "createagame">
        Create a Lobby
        <div className="space" >
          <div>
            Name
          </div>
          <input
            className = "textbox2"
            type="text"
            name="nameC"
            value={user.nameC}
            onChange={handleChange}
            />
        </div>
        <button className = "button-2" onClick={() => CreateLobby()}>
          Create Game
        </button>
      </h3>
    </div>
  ): null;
}

export default FindaGame;