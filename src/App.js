import React, { Component } from 'react';
import Particles from "react-tsparticles";
import Clarifai from 'clarifai';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Navigation from './Components/Navigation/Navigation';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import './App.css';


const app = new Clarifai.App({ apiKey: '3cdf9c0f45cb4596b2cccf95802ad782' });

const particlesOptions = {fullScreen: {enable: true, zIndex: 0},particles: {number: {value: 110,limit: 130,density: {enable: true,value_area: 800}},color: {value: "#ffffff"},shape: {type: "square",stroke: {width: 0,color: "#000000"},polygon: {nb_sides: 5},image: {src: "images/github.svg",width: 100,height: 100}},opacity: {value: 0.2,random: true,anim: {enable: true,speed: 1,opacity_min: 0.1,sync: false}},size: {value: 40,random: true,anim: {enable: true,speed: 10,size_min: 30,sync: false}},line_linked: {enable: true,distance: 100,color: "#ffffff",opacity: 1,width: 1},move: {enable: true,speed: 3,direction: "none",random: false,straight: false,out_mode: "out",bounce: false,attract: {enable: false,rotateX: 600,rotateY: 1200}}},interactivity: {detect_on: "canvas",events: {onHover: {enable: true,mode: "bubble",parallax: {enable: false,force: 60,smooth: 10}},onClick: {enable: true,mode: "push"},resize: true},modes: {grab: {distance: 400,lineLinked: {opacity: 1}},bubble: {distance: 400,size: 50,duration: 2,opacity: 1,speed: 2},repulse: {distance: 200},push: {particles_nb: 4},remove: {particles_nb: 2}}},retina_detect: true,fps_limit: 60,}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }



  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
  
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
        console.log('hi', response)
        if (response) {
          fetch('https://serene-castle-33705.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
  
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }


  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;