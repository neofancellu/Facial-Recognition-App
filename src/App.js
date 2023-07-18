import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


const initialState = {
      input:'',
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id:'',
        name:'',
        email:'',
        entries:0,
        joined: ''
      }
}
class App extends Component{
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user :{
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined 
    }})
  }



  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height- (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) =>{
    console.log(box);
    this.setState({box: box})
  }

  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState)
    }else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }  

  onButtonSubmit = () => {
    console.log("click"); 
    this.setState({imageUrl: this.state.input}); 

    // URL of image to use. Change this to your image.

    const IMAGE_URL = this.state.input;

    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": "neof99",
        "app_id": "my-first-application"
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key a7a76845a52d414fb9cb3e696122c8b7'
        },
        body: raw
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", requestOptions)
        .then(response => response.json())
        .then(result => {
                         if(result){
                            fetch('http://localhost:3001/image',{
                              method: 'put',
                              headers: {'Content-Type': 'application/json'},
                              body: JSON.stringify({
                                id:this.state.user.id
                              })
                            })
                            .then(response => response.json())
                            .then(count =>{
                              this.setState(Object.assign(this.state.user, {entries: count }))
                            })
                            .catch(console.log())
                         }

                          this.displayFaceBox(this.calculateFaceLocation(result))
                        })
        .catch(error => console.log('error', error));

        
  
    /*app.models.predict("6dc7e46bc9124c5c8824be4822abe105","https://samples.clarifai.com/face-det.jpg").then(
      function(response){
        console.log(response);
      },
      function(err){
        console.log(err);
      }
    );
    */
        //{"status":{"code":10000,"description":"Ok","req_id":"267bcad188b126d2ffadafdcdf8567ea"},"outputs":[{"id":"bb54ce78e5584326a54a1552aec7e97e","status":{"code":10000,"description":"Ok"},"created_at":"2023-05-10T09:09:22.671773221Z","model":{"id":"face-detection","name":"Face","created_at":"2020-11-25T16:50:24.453038Z","modified_at":"2022-10-11T17:30:18.021257Z","app_id":"main","model_version":{"id":"6dc7e46bc9124c5c8824be4822abe105","created_at":"2021-03-04T17:40:26.081729Z","status":{"code":21100,"description":"Model is trained and ready"},"visibility":{"gettable":50},"app_id":"main","user_id":"clarifai","metadata":{}},"user_id":"clarifai","model_type_id":"visual-detector","visibility":{"gettable":50},"toolkits":[],"use_cases":[],"languages":[],"languages_full":[],"check_consents":[],"workflow_recommended":false},"input":{"id":"596367a23cb741f5b6eb57baa412cce8","data":{"image":{"url":"https://www.telegraph.co.uk/multimedia/archive/03249/archetypal-female-_3249633c.jpg"}}},"data":{"regions":[{"id":"6ceb05872b3873d2a078dac6a407e9b6","region_info":{"bounding_box":{"top_row":0.19109009,"left_col":0.2874278,"bottom_row":0.7933581,"right_col":0.71533096}},"data":{"concepts":[{"id":"ai_b1b1b1b1","name":"BINARY_POSITIVE","value":0.9999982,"app_id":"main"}]},"value":0.9999982}]}}]}
    


    
}

  render(){
    const {isSignedIn, imageUrl, route, box} = this.state;
    return(
      <div className="App">
        <ParticlesBg className='particles' color="#ffffff" num={300} type="cobweb" bg={true} />
        <Navigation  isSignedIn={isSignedIn} onRouteChange= {this.onRouteChange} />
        { route === 'home'
          ? <div> 
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}  />
              <FaceRecognition box={box} imageUrl = {imageUrl} />
            </div>

          :( 
            route === 'signin' 
            ? <Signin  loadUser={this.loadUser} onRouteChange= {this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange= {this.onRouteChange} />
           )
        }
      </div>
    );
  }
}

export default App;
