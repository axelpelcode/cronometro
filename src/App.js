import './App.css';
import { useState, useEffect, useRef } from 'react';

function App() {

  const [num, setNum] = 
    useState({ 
      break:  5, 
      session:  25, 
      timeInSec: 1500, 
      timing: true, 
      play: false,
      firstInit: true
    });
    const countRef = useRef(null);

  useEffect(() => {
      countRef.current = setTimeout(()=>{
      if(num.play === true && num.timeInSec > 0){
        clearTimeout( countRef.current );
        setNum({...num, timeInSec: num.timeInSec - 1 });
        console.log("interval play true: "+ num.timeInSec + num.play)
      } else if (num.play === true && num.timeInSec === 0){
        if(num.timing === true){
        setNum({...num, timing: false, timeInSec: num.break * 60 });
        } else {
          setNum({...num, timing: true, timeInSec: num.session * 60 });
        }
        audio.play();
      } 
      return  clearTimeout( countRef.current )
    }, 1000);
  }, [num.play, num.timeInSec, countRef.current]);

  const TimeFormat = () =>{
    const minutes =  Math.floor(num.timeInSec / 60);
    const seconds =  num.timeInSec - minutes * 60;
    const formatSec = seconds < 10 ? "0" + seconds : seconds;
    const formatMin = minutes < 10 ? "0" + minutes : minutes;
    return `${formatMin}:${formatSec}`;
  };

  const title = num.timing === true ? "Session" : "Break";
  const audio = document.getElementById("beep");
      
  function timeHandler (){
    if( title === "Session" ){
      setNum({...num, timeInSec: num.session * 60 })
    } else {
      setNum({...num, timeInSec: num.break * 60 })
    }
  };

  function eventHandler ( val ){
    switch( val ){
      case "break-increment":
        if( num.break<60 ){
          setNum({...num,
          break:  num.break+=1
        });
        timeHandler()
      } else {
        console.log("Limit reached");
      }
        break;
      case "break-decrement":
        if( num.break>1 ){
          setNum({...num,
          break: num.break-=1
        });
        timeHandler()
      } else {
        console.log("Limit reached");
      }
        break;
      case "session-increment":
        if( num.session<60 ){
          setNum({...num,
            session: num.session+=1
          });
          timeHandler()
        } else {
          console.log("Limit reached");
        }
        break;
      case "session-decrement":
          if( num.session>1 ){
            setNum({...num,
            session: num.session-=1
          });
          timeHandler()
        } else {
          console.log("Limit reached");
        }
        break;
      case "start_stop":
          if(num.play){
            clearTimeout( countRef.current )
            setNum({...num, play: false });
            console.log("Stop: " + num.timeInSec + num.play)
          } else {
            clearTimeout( countRef.current )
            if(num.firstInit){
              setTimeout(()=>{
                  setNum({...num, play: true, timeInSec: num.timeInSec - 1, firstInit: false})
                  return  clearTimeout( countRef.current )
                }, 1000);
            } else {
              setNum({...num, play: true, timeInSec: num.timeInSec - 1});
            };
            //setNum({...num, play: true, timeInSec: num.timeInSec - 1});
            //setNum({...num, play: true, firstInit: false});
            console.log("Start: " + num.timeInSec + num.play)
          }
        break;
      default:
          clearTimeout( countRef.current )
          setNum({...num,
            break:  5,
            session:  25,
            timeInSec: 1500,
            play: false,
            timing: true,
            firstInit: true
          });
          if(audio !== null){
          audio.pause();
          audio.currentTime = 0;
          };
        break;
    }
  };

  return (
    <div className="App">
      <span className="title"><h1>25+5 Clock</h1></span>

  {/* Botones de descanso */}   

      <div className="keypad">
        <div className="breakKeys">
          <span className="break-label"><p id="break-label">Break Length</p></span>
            <button 
              id="break-increment"
              disabled={ num.play } 
              onClick={ () => { eventHandler("break-increment") } }
              >↑</button>
            <p id="break-length" >{ num.break }</p>
            <button 
              id="break-decrement"
              disabled={ num.play } 
              onClick={ () => { eventHandler("break-decrement") } }
              >↓</button>
        </div>

  {/*Botones de sesión*/}

        <div className="sessionKeys">
          <span className="session-label"><p id="session-label">Session Length</p></span>
            <button 
              id="session-increment"
              disabled={ num.play } 
              onClick={ () => { eventHandler("session-increment") } }
              >↑</button>
            <p id="session-length" >{ num.session }</p>
            <button 
              id="session-decrement"
              disabled={ num.play } 
              onClick={ () => { eventHandler("session-decrement") } }
              >↓</button>
        </div>
      </div>

  {/* Display */}

      <div className="display">
        <span className="timer-label" ><p id="timer-label" >{ title }</p></span>
        <span className="time-left"><p id="time-left"><TimeFormat /></p></span>
      </div>

  {/* Start-Stop-Reset */}

      <button 
        onClick={ () => { eventHandler("start_stop") } }
        id="start_stop" 
        >Start/Stop</button>
      <button 
        onClick={ () => { eventHandler("reset") } }
        id="reset" 
        >Reset</button>
       
      <audio
        id="beep" 
        preload="auto"
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        defer
      />

      <footer>by <a href="https://github.com/axelpelcode" target='_blank' rel="noreferrer">AxelPelCode</a></footer>
    </div>
  );
}

export default App;