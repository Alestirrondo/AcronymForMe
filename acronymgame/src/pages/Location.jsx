import useAuth from '../hooks/useAuth';

const ws = new WebSocket("ws://localhost:9090")

function RandomLobby(nameR){
    //console.log(props)
    const { auth } = useAuth();
    console.log(auth[0])
      if(nameR != ''){
        const payLoad = {
          "method": "RandomServer",
          "clientId" : auth[0],
          "clientName" : nameR
        }
        ws.send(JSON.stringify(payLoad))
      }else{
        alert("Fill in user name!");
      }
  }

export default RandomLobby;
