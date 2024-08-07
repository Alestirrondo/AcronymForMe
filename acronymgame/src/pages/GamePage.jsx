import logo from './4me.png';
import Red from '../Images/RedPerson.png';
import Green from '../Images/GreenPerson.png';
import Blue from '../Images/BluePerson.png';
import Yellow from '../Images/YellowPerson.png';
import Orange from '../Images/OrangePerson.png';
import Purple from '../Images/PurplePerson.png';
import RedT from '../Images/RedPersonTurn.png';
import GreenT from '../Images/GreenPersonTurn.png';
import BlueT from '../Images/BluePersonTurn.png';
import YellowT from '../Images/YellowPersonTurn.png';
import OrangeT from '../Images/OrangePersonTurn.png';
import PurpleT from '../Images/PurplePersonTurn.png';
import { useNavigate } from 'react-router-dom';
import react, {useEffect, useState, useRef} from 'react';
import useAuth from '../hooks/useAuth';
const ws = new WebSocket("ws://localhost:9090")

let shuffledID = []
let wordlist = [];
const GamePage = ({location}) => {
  let ImageList = []

  let stage3run = false;

  const { auth } = useAuth();
  const [gameStage, setGame] = useState(1);
  const [userlist, setList] = useState();
  const [Height, setHeight] = useState('100hv');
  const navigate = useNavigate();
  const [imageList, setImageList] = useState();
  const [image, setImage] = useState();
  const [noAnswer, setNo] = useState(false);

  const [stage1, setStage1] = useState(30);
  const timerId1 = useRef()
  const timerId1check = useRef()
 
  const [stage2, setStage2] = useState(60);
  const timerId2 = useRef()
  const timerId2check = useRef()

  const [stage3, setStage3] = useState(30);
  const timerId3 = useRef()
  const timerId3check = useRef()

  const [stage4, setStage4] = useState(5);
  const [stage4run, setStage4run] = useState(false)
  const [timeInBetween, setTimeInBetween] = useState(3);
  const [inbetweenRoundClock, setINRClock] = useState(false)
  const [acronym, setAcronym] = useState(["","",""]);
  const [turn, setTurn] = useState(false);
  const [mainAcronym, setMain] = useState("")
  const [answer, setAnswer] = useState({
    response: '',
  });
  const [shuffled, setShuffle] = useState()
  const [whoseTurn, setWho] = useState()
  const [answerChoiceList, setChoiceList] = useState();
  const [answerList, setAnswerList] = useState();
  const [submitted, setSubmit] = useState(false)
  const [roundWinner, setRoundWinner] = useState("")
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswer({
      ...answer,
      [name]: value,
    });
  };


  useEffect(() => {
    if(auth[1] == null){
      navigate('/');
    }else{
      if(location.pathname === '/GamePage'){
        //setGame(auth[3].stage)
        const serverlist = [];
        let turncheck = false;
        
        auth[2].forEach(c =>{
          serverlist.push(c.clientName + "\nScore: " + c.score);
          if(c.colour === 'Red'){
            if(c.turn === true){
              ImageList.push(RedT)
              setWho(c.clientName)
            }else{
              ImageList.push(Red)
            }
            
          }
          if(c.colour === 'Green'){
            if(c.turn === true){
              ImageList.push(GreenT)
              setWho(c.clientName)
            }else{
              ImageList.push(Green)
            }
            
          }
          if(c.colour === 'Blue'){
            if(c.turn === true){
              ImageList.push(BlueT)
              setWho(c.clientName)
            }else{
              ImageList.push(Blue)
            }
            
          }
          if(c.colour === 'Yellow'){
            if(c.turn === true){
              ImageList.push(YellowT)
              setWho(c.clientName)
            }else{
              ImageList.push(Yellow)
            }
            
          }
          if(c.colour === 'Orange'){
            if(c.turn === true){
              ImageList.push(OrangeT)
              setWho(c.clientName)
            }else{
              ImageList.push(Orange)
            }
            
          }
          if(c.colour === 'Purple'){
            if(c.turn === true){
              ImageList.push(PurpleT)
              setWho(c.clientName)
            }else{
              ImageList.push(Purple)
            }
            
          }
          if(c.turn === true && c.clientId === auth[0]){
            
            DeclareTurn()
            turncheck = true;
          }
        })

        
        setList(serverlist.map(name => <li className='namelist'>{name}</li>))
        setImage(ImageList.map(colour => (<img className='playerimg' key={colour} src= {colour} />)))
        if(auth[6] === true && turncheck === true){
          nextRound()
        }
        if(auth[6] === "ping"){
          SendPing(auth[1],auth[0])
        }
        if(gameStage == 1 && auth[6] !== "join" && auth[6] !== "delete"){
          wordlist = GenerateAcronym()
          Stage1Clock(turncheck, wordlist)
        }
        if(auth[4] != gameStage){
          UpdateGame(true)
        }else{
          UpdateGame(false)
        }
        
      } 
    }
},[auth])

useEffect(() => {
  if(auth[1] == null){
    navigate('/');
  }else{
    if(location.pathname === '/GamePage'){
      if(gameStage == 2 && turn === false){
        setSubmit(false)
        setMain(auth[3])
        setStage2(60)
        Stage2Clock()
        clearInterval(timerId1.current)
      }
      if(gameStage == 2 && turn === true){
        clearInterval(timerId1.current)
      }
      if(gameStage == 3){
        let answers = []
        let shuffl1 = []
        auth[2].forEach(c => {
          if(c.answer !== ""){
            answers.push([c.answer, c.clientId]);
          }
        })
        shuffl1 = answers.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)
        let shuffledA = [];
        setShuffle(shuffl1)
        for(let i = 0; i < shuffl1.length; i++){
          shuffledA.push(shuffl1[i][0])
          shuffledID.push(shuffl1[i][1])
        }
        if(shuffledA.length === 0){
          blankAnswers()
        }else{
        setNo(false)
        setID(shuffledID)
        setChoiceList(shuffledA.map(name => <button className="acronymButton2" onClick={() =>SelectAnswer(name, shuffledA.findIndex(x => x === name))} >{name}</button>))
        setAnswerList(shuffledA.map(name => <li className="answerslist">{name}</li>))
        if(turn){
          Stage3Clock()
        }
        }
        
        
        
      }
      if(gameStage == 4){
        
        FinalStage()
        if(turn === true){
          SetINRC()
        }
        
      }
      if(gameStage == 5){
        if(turn === true){
          reset()
        }
        
      }
    }
  }
},[gameStage])

  function FinalStage(){
    setMain(auth[3])
    setRoundWinner(auth[5])
    setTimeInBetween(timeInBetween - 1);
    setINRClock(true)
    setNo(false)
    clearInterval(timerId3.current)
    setStage3(30)
  }

  function UpdateGame(update){
    if(update){
      setGame(auth[4])
    }

  }
  function Stage1Clock(turncheck){
    if((turncheck === true || turn === true) && gameStage === 1){
      clearInterval(timerId1.current)

      timerId1.current = setInterval(() => {
        
          setStage1(prev => prev - 1)
      },1000)
      return() => clearInterval(timerId1.current) 
    }else{
      clearInterval(timerId1.current) 
      
    }
    
  }

  useEffect(() => {
    if(auth[1] == null){
      navigate('/');
    }else{
      if(location.pathname === '/GamePage'){
        if(stage1 <=0){
          clearInterval(timerId1.current)
          setStage1(30)
          SelectAcronym(wordlist[Math.floor(Math.random()*3)])

        }
      }
    }
  },[stage1])


  function Stage2Clock(){
    if(!turn){
      clearInterval(timerId2.current)
      timerId2.current = setInterval(() => {
        setStage2(prev => prev - 1)
      },1000)
      return() => clearInterval(timerId2.current)
    }else{
      setStage2(60)
      clearInterval(timerId2.current)
    }
  }

  useEffect(() => {
    if(auth[1] == null){
      navigate('/');
    }else{
      if(location.pathname === '/GamePage'){
        if(stage2 <=0){
          clearInterval(timerId2.current)
          setStage2(60)
          SubmitAcronymTimeout()
        }
      }
    }
  },[stage2])

  function Stage3Clock(){
    
    if(turn){
      clearInterval(timerId3.current)
      timerId3.current = setInterval(() => {
        setStage3(prev => prev - 1)
      },1000)
      return() => clearInterval(timerId3.current)
    }else{
      setStage3(30)
      clearInterval(timerId3.current)
    }
  }

  useEffect(() => {
    if(auth[1] == null){
      navigate('/');
    }else{
      if(location.pathname === '/GamePage'){
        if(stage3 <=0){
          clearInterval(timerId3.current)
          setStage3(30)
          let shuffledIndex = Math.floor(Math.random()*(shuffled.length-1))
          SelectAnswer(shuffled[shuffledIndex][0], shuffledIndex)
        }
      }
    }
  },[stage3])

  function blankAnswers(){
    setNo(true)
    const clock= setInterval(() => {
      if(turn){
        nextRound()
      }
      clearInterval(clock)
    },3000)
    return() => clearInterval(clock)
  }

  function setID(list){
    shuffledID = list;
  }

  function SetINRC(){
    setTimeout(() => {
      setINRClock(false)
      setTimeInBetween(3)
      nextRound()
      setTurn(false)
      setSubmit(false)
    }, 3000)
    
    
  }

  function DeclareTurn(){
    setTurn(true)
  }

  function GenerateAcronym(){
    let letter;
    let word3 = "", word4 = "", word5 = "";
    for(let i = 3; i<6; i++){
      for(let j = 0; j<i; j++){
        letter = {"0": "A", "1": "B", "2": "C", "3": "D",  "4": "E", "5": "F", "6": "G", "7": "H", "8": "I",  "9": "J", "10": "K", "11": "L", "12": "M", "13": "N",  "14": "O", "15": "P", "16": "Q", "17": "R", "18": "S",  "19": "T", "20": "U", "21": "V", "22": "W", "23": "X", "24" : "Y", "25" : "Z"}[Math.floor(Math.random()*25)];
        if(i == 3){
          word3 += letter;
        }
        if(i == 4){
          word4 += letter;
        }
        if(i == 5){
          word5 += letter;
          }
        }
      }
    setAcronym([word3, word4, word5])
    return([word3, word4, word5])
  }
  
  function SelectAcronym(Word){
    setStage1(30)
    clearInterval(timerId1.current)
    const payLoad = {
      "method": "select",
      "gameId" : auth[1],
      "acronym" : Word
    }
    ws.send(JSON.stringify(payLoad))
  }

  function nextRound(){
    const payLoad = {
      "method": "round",
      "gameId" : auth[1],
    }
    ws.send(JSON.stringify(payLoad))
    ImageList = [];
    setTurn(false)
    setNo(false)
  }

  function reset(){
    setTimeout(() => {
      const payLoad = {
        "method": "reset",
        "gameId" : auth[1],
      }
      ws.send(JSON.stringify(payLoad))
      setTurn(false)
      setSubmit(false)
      ImageList = [];
    }, 5000)
  }

  function SelectAnswer(Word, index){
    
    const id = shuffledID[index]
    const payLoad = {
      "method": "point",
      "gameId" : auth[1],
      "user" : id,
      "acronym" : Word
    }
    ws.send(JSON.stringify(payLoad))
  }

  

  function SubmitAcronym(Word){
    const answercheck = Word.trim().split(" ")
    let check = 0;
    setStage2(60)
    clearInterval(timerId2.current)
    setAnswer({response: '',})
    if(answercheck.length == mainAcronym.length){
      for(let i = 0; i<mainAcronym.length; i++){
        if(answercheck[i][0].toLowerCase() === mainAcronym[i].toLowerCase()){
          check ++;
        }
      }
      if(check == mainAcronym.length){
        const payLoad = {
          "method": "submit",
          "gameId" : auth[1],
          "acronym" : Word,
          "clientId" : auth[0]
        }
        ws.send(JSON.stringify(payLoad))
        setSubmit(true);
      }else{
        alert("this is not an acronym of " + mainAcronym)
      }
      
    }else{
      alert("this is not an acronym of " + mainAcronym)
    }
    
  }

  function SubmitAcronymTimeout(){
    setStage2(60)
    setAnswer({response: '',})
    const payLoad = {
      "method": "submit",
      "gameId" : auth[1],
      "acronym" : "",
      "clientId" : auth[0]
    }
    ws.send(JSON.stringify(payLoad))
    setSubmit(true);
  }

  function SendPing( Id, cId){
    const payLoad = {
      "method": "submit",
      "gameId" : Id,
      "acronym" : "",
      "clientId" : cId
    }
    ws.send(JSON.stringify(payLoad))
  }

  return (location.pathname === '/GamePage')
  ? (
    <div className="App" style={{ height: Height}}>
      <h1 className="App-header">
        Acronym for me
      </h1>
      <div className= "usercode">Game Code: {auth[1]}</div>
      {(gameStage == 1 && turn === true) &&
        <div className = "displaycontainer">
          <div className = "instructions"> Pick an accronym </div>
        <ul>
          <button type="button" className="acronymButton" onClick={() =>SelectAcronym(acronym[0])}> {acronym[0]}</button>
          <button type="button" className="acronymButton" onClick={() =>SelectAcronym(acronym[1])}> {acronym[1]} </button>
          <button type="button" className="acronymButton" onClick={() =>SelectAcronym(acronym[2])}> {acronym[2]} </button>
        </ul>
          <div className = "timer"> Time Left to choose {stage1} </div>
        </div>
      }
      {(gameStage == 1 && turn === false) &&
        <div className = "displaycontainer">
          <div className = "instructions"> Waiting for {whoseTurn} to Pick an Acronym </div>
        </div>
      }
      {(gameStage == 2 && turn !== true && submitted === false) &&
        <div className = "displaycontainer">
          <div className = "instructions"> Fill out an acronym for {mainAcronym} </div>
          <input
            className = "gameTextbox"
            type="text"
            id = "textbox"
            name="response"
            value={answer.response}
            onChange={handleChange}
            />
            <div> </div>
            <button type="button" className="submitButton" onClick={() =>SubmitAcronym(answer.response)}> Submit </button>
            <div className = "timer"> Time left to make an acronym {stage2} </div>
        </div>
      }
      {(gameStage == 2 && turn === true) &&
        <div className = "displaycontainer">
          <div className = "instructions"> Waiting for other players to make their acronym </div>
        </div>
      }
      {(gameStage == 3 && turn === true && noAnswer === false) &&
        <div className = "displaycontainer">
          <div className = "instructions"> Pick Your Favourite </div>
        <ul className="list">
          {answerChoiceList}
        </ul>
        <div className = "timer"> Time Left to choose {stage3} </div>
        </div>
      }

      {(gameStage == 3 && turn === false && noAnswer === false) &&
        <div className = "displaycontainer">
          <div className = "instructions"> These are your answers </div>
        <ul className="answerlist">
          {answerList}
        </ul>
        </div>
      }
      {(gameStage == 3 && noAnswer === true) &&
      <div className = "displaycontainer">
      <div className = "instructions"> No one answered so no points awarded </div>
      </div>      
      }
      {gameStage == 4 &&
        <div className = "displaycontainer">
          <div className = "instructions">{roundWinner} won the round with the acronym {mainAcronym}</div>
        </div>
      }
      {gameStage == 5 &&
        <div className = "displaycontainer">
          <div className = "instructions">{roundWinner} Wins  the Game</div>
        </div>
      }
      <div className= 'playercontainer'>
      <ul className="list">
        {userlist}
      </ul>
      <ul>
        {image}
      </ul>
      </div>
      

    </div>
  ): null;
}

export default GamePage;