import React, { useEffect, useState } from "react";
import { AreaChart, XAxis , YAxis ,Tooltip , Area} from 'recharts';
import './styles.scss';
function App() {
  const [animes,setAnimes]=useState([])
  const [chartData,setChartData] = useState([]) 




  // cards functions
  function handleMouseDown(i){
    let allCards = document.querySelectorAll('.card');
    allCards.forEach(e => {
      e.classList.remove('active')
    })
    allCards[i].classList.add('active')
  }
  function handleMouseUp(i){
    let allCards = document.querySelectorAll('.card');
    allCards[i].classList.remove('active')
  }



  useEffect(()=>{


    //to get the data
    fetch('https://api.jikan.moe/v4/top/anime')
    .then(res => res.json())
    .then(data => {
      let allData = data.data
      allData.splice(20)
      setAnimes(allData)


      // to set the array for the chart
      let newChartData = []
      allData.forEach((ele,i)=>{
        let bool = true
        for(let k=0;k<newChartData.length;k++){
          if(newChartData[k]['name'] == ele.year){
            newChartData[k]['numbr'] += 1
            newChartData[k]['animes'] += ` & ${ele.title}`
            bool = false
          }
        }
        if(bool && ele.year){
          newChartData.push({'name':ele.year,'numbr':1,'animes':`${ele.title} `})
        }
      })


      //to sort the array by the year
      newChartData.sort(function(a, b){return a['name'] - b['name']})
      setChartData(newChartData)

      
    })
  },[])
  return (
    <div className="App">
      <section className="cards">
        {
        animes.map((anime,i) => {
          let date = anime.aired.string
          let dateArr = date.split(' to ')
          return (
            <article 
                className="card" 
                key={i}
                onMouseDown={(e)=>handleMouseDown(i)}
                onMouseUp={(e)=>handleMouseUp(i)}
                >
              <div style={{'backgroundImage':`url(${anime.images.jpg.image_url})`}}></div>
              <h1 className="rank">{i+1}</h1>
              <p className="anime-name">{anime.title}</p>
              <p className="other-info"><span>Release : </span>{dateArr[0]}</p>
              <p className="other-info"><span>latest : </span>{dateArr[1]}</p>
              <p className="other-info"><span>Rating : </span> {anime.rating}</p>
            </article>
          )
        })
        }
      </section>
      <section className="chart">
        <AreaChart width={1000} height={300} data={chartData}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="numbr" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
          <Area type="monotone" dataKey="animes" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
        </AreaChart>
      </section>
    </div>
  );
}

export default App;
