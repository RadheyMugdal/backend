import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
function App() {
  const [jokes, setJokes] = useState([]);
  // const jokes=[]

  useEffect(() => {
    axios.get('/api/joke')
      .then((res) => setJokes(res.data))
      .catch((e) => console.log(e));
      
  }, []); // Make sure to pass an empty dependency array to useEffect if you only want it to run once

  return (
    <>
      <h1>Full Stack with Radhey</h1>
      <p>JOKES: {jokes.length}</p>
      {jokes.map((joke, index) => (
        <div key={joke.id}>
          <h3>{joke.title}</h3>
          <p>{joke.joke}</p> {/* Assuming the joke content is stored in the 'joke' property */}
        </div>
      ))}
    </>
  );
}

export default App;
