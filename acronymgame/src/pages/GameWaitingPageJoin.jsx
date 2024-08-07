import logo from './4me.png';
import { useNavigate } from 'react-router-dom';
import react, {useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
let ws = new WebSocket("ws://localhost:9090")
let x = 1;

const GameWaitingPageJoin = ({location}) => {

    const { auth } = useAuth();
    const [userlist, setList] = useState();
    const [Height, setHeight] = useState('100hv');
    const [time, setTime] = useState(30);
    const [clock, setClock] = useState(false);
    const navigate = useNavigate();
    const checkPlayerCount = () => {
        const payLoad = {
            "method": "count",
            "gameId": auth[1]
        }
        ws.send(JSON.stringify(payLoad))
    };

    useEffect(() => {
        if(location.pathname === '/GameWaitingPageJoin'){
            if(auth[1] == null){
                navigate('/');
            }else{
                const serverlist = [];
                auth[2].forEach(c =>{
                    serverlist.push(c.clientName);                
                })
                setList(serverlist.map(name => <li className='waitingList'>{name}</li>))
                if((auth[2].length >= 3 && auth[3] === 'Public') || auth[2].length == 6){
                    setTime(time - 1);
                    setClock(true)
                }
            }
            
        }
    },[auth])

    useEffect(() =>{
        if(location.pathname === '/GameWaitingPageJoin'){
            if(auth[1] == null){
                navigate('/');
            }else{
                if((auth[2].length >= 3 && auth[3] === 'Public') || auth[2].length == 6){
                    setTimeout(() => {
                        if(time >= 0){
                            setTime(time - 1);
                        }
                    }, 1000)
                }
            }
        }
    },[time])

    return (location.pathname === '/GameWaitingPageJoin')
    ? (
        <div className="App" style={{ height: Height}}>
        <h1 className="App-header">
            Acronym for me
        </h1>
        <div className= "usercode">Game Code: {auth[1]}</div>
        <div className= "usercode">Player List</div>
        <ul >{userlist}</ul>
        {clock && <div className='usercode'>Game Starting in {time}</div>}
        </div>
        
    ): null;
}

export default GameWaitingPageJoin;