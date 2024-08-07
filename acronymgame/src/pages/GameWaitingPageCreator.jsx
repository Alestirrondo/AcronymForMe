import logo from './4me.png';
import { useNavigate } from 'react-router-dom';
import react, {useEffect, useState, useRef } from 'react';
import useAuth from '../hooks/useAuth';
const ws = new WebSocket("ws://localhost:9090")


const GameWaitingPageCreator = ({location}) => {

    const { auth } = useAuth();
    const [Height, setHeight] = useState('100hv');
    const navigate = useNavigate();
    const [userlist, setList] = useState();
    const [time, setTime] = useState(30);
    const [clock, setClock] = useState(false);
    const timerId1 = useRef()
    const checkPlayerCount = () => {
        const payLoad = {
            "method": "count",
            "gameId": auth[1]
        }
        ws.send(JSON.stringify(payLoad))
    };

    
    useEffect(() => {
        if(location.pathname === '/GameWaitingPageCreator'){
            if(auth[1] == null){
                navigate('/');
            }else{
                const serverlist = [];
                auth[2].forEach(c =>{
                serverlist.push(c.clientName);
                })
                setList(serverlist.map(name => <li className='waitingList'>{name}</li>))
                if((auth[2].length >= 3 && auth[7] === 'Public') || auth[2].length == 6){
                    Countdown()
                    setClock(true)
                }  
            }
        }
    },[auth])

    function Countdown(){
        clearInterval(timerId1.current)

        timerId1.current = setInterval(() => {
          
            setTime(prev => prev - 1)
        },1000)
        return() => clearInterval(timerId1.current) 
    }

  useEffect(() => {
    if(auth[1] == null){
      navigate('/');
    }else{
      if(location.pathname === '/GameWaitingPageCreator'){
        if(time <= 0){
            StartGame();
        }
      }
    }
  },[time])


    const StartGame = () =>{
        if(userlist.length >= 3 ){
            const payLoad = {
                "method": "start",
                "gameId" : auth[1]
            }
            ws.send(JSON.stringify(payLoad))
        }else{
            alert("Not enough players to start")
        }
        
    }
    return (location.pathname === '/GameWaitingPageCreator')
    ? (
        <div className="App" style={{ height: Height}}>
        <h1 className="App-header">
            Acronym for me
        </h1>
        <div className= "usercode">Game Code: {auth[1]}</div>

        <div className= "usercode">Player List</div>
        <ul >{userlist}</ul>
        <button type="button" className="App-button" onClick={() =>StartGame()} >Start the game</button>
        {clock && <div className='usercode'>Game Starting in {time}</div>}
        </div>
        
    ): null;
}

export default GameWaitingPageCreator;