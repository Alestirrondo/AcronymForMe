import logo from './4me.png';
import { useNavigate } from 'react-router-dom';
import react, {useState} from 'react';


const HomePage = ({location}) => {

 

  const [Height, setHeight] = useState('100hv');
  const navigate = useNavigate();
  return (location.pathname === '/HomePage' || location.pathname === '/')
  ? (
    <div className="App" style={{ height: Height}}>
      <h1 className="App-header">
        Acronym for me
      </h1>
      <img src={logo} className="App-logo" alt="logo" />
      <div></div>
      <button type="button" className="App-button" onClick={() => navigate('/FindaGame')} >search for game</button>
    </div>
  ): null;
}

export default HomePage;