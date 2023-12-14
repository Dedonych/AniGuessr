
import './App.css';
import Left from './components/left/Left';
import Right from './components/right/Right';
import Bottom from './components/bottom/Bottom';
import Menu from './components/menu/Menu';
import Middle from './components/middle/Middle.tsx';
import { APIContext, APIProvider } from './core/api.tsx';
import Gear from './assets/gear.tsx';
import { useState, useContext, useEffect } from 'react';
import Status from './components/status/Status.tsx';
function App() {

  const [blocked, setBlocked] = useState(false);
  return (<APIProvider>
    <MenuButton />
    <Left />
    <Middle />
    <Right blocked={blocked} />
    <Bottom  {...{ setBlocked }} />
    <Menu />
    <Status />
  </APIProvider>
  )
}
function MenuButton() {
  const { settings: { minScore: m, nsfw: n, rus: r }, restartGame } = useContext(APIContext);
  const [isMenu, setIsMenu] = useState(false);
  const [clickToSave, setClickToSave] = useState(false);
  useEffect(() => {
    setClickToSave(true);
  }, [m, n, r]);
  useEffect(() => {
    setClickToSave(false);
  }, [])
  const handleClick = () => {
    setIsMenu(!isMenu);
    if (clickToSave) {
      setClickToSave(false);
      restartGame!();

    }
  }
  return <button className={`menuBtn${isMenu ? ' active' : ''}${clickToSave?' changed':''}`} onClick={handleClick}>
    <Gear />
  </button>
}

export default App
