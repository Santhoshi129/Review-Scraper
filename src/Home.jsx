import './Home.css';
import "@lottiefiles/lottie-player"
import Superagent from 'superagent'
import { createSignal} from 'solid-js';
import Configs from "../configs.json"



//let Link = "http://localhost:18907/search/callback?product="
const [isWaiting, setWaiting] = createSignal(false);
const [isGotResults, setResultsStatus] = createSignal(false);
const [isIdle, setIdle] = createSignal(false);
const [ErrorStatus,setErrorStatus] = createSignal(false)
const [SearchResults,setResults] = createSignal([])


function Waiting(){
  return(
  <div style={"margin-top:8vh"}>
    <lottie-player autoplay src="assets/peace.json" loop mode="normal" style="width: 101vw;height:55vh"></lottie-player>
    <h3 style="margin-left:35vw;font-size:4vh;">Please Wait I'm Getting Reviews...!</h3>       
  </div>
  )
}

function Idle(){
  return(
  <div style={"margin-top:8vh"}>
    <lottie-player autoplay src="assets/robo.json" loop mode="normal" style="width: 101vw;height:55vh"></lottie-player>
    <h3 style="margin-left:33vw;font-size:4vh;">Please Search Anything I'm Getting Bore...!</h3>       
  </div>
  )
}

function Error(){
  return(
  <div style={"margin-top:8vh"}>
    <lottie-player autoplay src="assets/error.json" loop mode="normal" style="width: 101vw;height:55vh"></lottie-player>
    <h3 style="margin-left:33vw;font-size:4vh;">Ops Something Went Wrong Sorry...!</h3>       
  </div>
  )
}


const getResults = async(Search)=>{
  try
  {
    let Link = Configs['Server']
    if(Link!=undefined&&Link!=null)
    {
      if(Link.endsWith("/"))
      {
        Link = Link+"search/callback?product="
      }else{
        Link =  Link+"/search/callback?product="
      }
      setResults([])
      setIdle(false)
      setErrorStatus(false)
      setResultsStatus(false)
      setWaiting(true)
      let Requests = Superagent.agent()
      let Response = await Requests.get(Link+Search)
      setResults(await JSON.parse(Response.text))
      setWaiting(false)
      setResultsStatus(true)
    }
  }catch(e){
    console.log(e)
    setIdle(false)
    setWaiting(false)
    setResultsStatus(false)
    setErrorStatus(true)
    setResults([])
    return []
  }
}

function Results(){
  return(
  <div id='Results'>
  {
    SearchResults().map((Product,Index)=>{
    let Name = Product['Name']
    return(
      <div>
        <div class='Gap'></div>
        <div class='Product'>
          <img src={Product['Image']} class='ProductImage'></img>
          <div class='InfoBar'>
            <h2 style={"height:3vh; overflow: hidden;text-overflow: ellipsis; "}>👀Name : {Product['Name']}</h2>
            <h2>🐱Rating : {Product['Rating'][0]}⭐</h2>
            <h2>☃️Impression : {Product['Impression']}</h2>
            <h2 class='Review'>😎Review : {Product['Review']}</h2>
            <div class='Domain'>
              <h1> 👉🏼</h1>
              <img src={'assets/'+Product['Domain']+".png"} style={"width:4wv;height:4vh;"}></img>
              <h2>
                <a href={Product['Product']} class='DomainIcon' target="_blank" >{Product['Domain']}</a>
              </h2>
            </div>
          </div>
        </div>
        <div class='Gap'></div>
        <div class='Outline'></div>
      </div>
    )})
  } 
  </div>
  )
}
function App() {
  setIdle(true)
  return (
    <div id='Body'>
      <div id='Main'>
        <div class='Heading'>
          <h3 style={"font-weight:300;font-size:4vh;margin-left:6.5vw"}>Review Scraper</h3>
          <h3 style={"font-weight:300;font-size:4vh"}>Developed By Abhishek Paul</h3>
        </div>
        <div id='SearchBar'>
        <lottie-player autoplay src="assets/search.json" loop mode="normal" style="width: 10vw"></lottie-player>
        <input id='Search' placeholder='Search....' onchange={(e)=>{getResults(e.target.value)}}></input>
        </div>
        {isIdle() && <Idle />}
        {isWaiting() && <Waiting />}
        {isGotResults()&& <Results />}
        {ErrorStatus()&& <Error />}
      </div>
    </div>
  );
}

export default App;
