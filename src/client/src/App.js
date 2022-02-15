import axios from 'axios'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import './App.css';

const socket = io('http://localhost:5000')

function App() {

  const [size, setSize] = useState('0')

  useEffect(() => {
    socket.on('voicechannelInfo', (m) => {
      setSize(m.size)
    })
  })
  return (
    <div>{`ValidChannelSize: ${size}`}</div>
  );
}

export default App;
