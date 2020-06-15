import React, {Component} from 'react'
import Loading from './Animations/Loading.js'
import axios from 'axios'
import camera from './Icons/camera.png'
import PhotoCamera from './Camera'
const openGeocoder = require('node-open-geocoder');


class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
           enlargeToggle: false,
           toggleHome: true,
           toggle: false,
           img: '',
           email: '',
        }
    }

    
    getLocation = () => {
        navigator.geolocation.getCurrentPosition(
        function(position) {
            openGeocoder().reverse(position.coords.longitude, position.coords.latitude)
                .end((err, res) => {       
                        if(err){
                            alert('Locație necunuscutã !')
                        }  
                        if(res){
                            localStorage.setItem("adress", JSON.stringify(res.address))
                        }
                })
            }
        )
    }
    
    toggle = () => {
        this.setState({
            toggleHome: !this.state.toggleHome
        })
    }

    onTakePhoto = (dataUri) => {
        this.setState({
           img: dataUri
        })
    }

    deletePhoto = () => {
        this.setState({
            img: '',
        })
    }
    
    sendEmail = (e) => {
        e.preventDefault()
        const newMail = {
            date: new Date(),
            email: this.state.email,
            location: JSON.parse(localStorage.getItem("adress")) || {},
            img: this.state.img || '',
        }
        console.log(newMail)
        axios.post('/mail', newMail).then(res => {
        }).catch(err => console.log(err))
        this.setState({
            email: '',
            img: '',
        })
    }
    
   
    enlargePicture = () => {
        this.setState({
            enlargeToggle: !this.state.enlargeToggle
        })
    }

    deleteImg = () => {
        var answer = window.confirm("Ești sigur cã vrei sã ștergi poza?")
            if(answer){
                this.props.deletePhoto()
                this.setState({
                    enlargeToggle: false
                })
            }else{
                this.setState({
                    enlargeToggle: false
                })
            }
    }


    handleChange = (e) => {
        e.preventDefault()
        this.getLocation()
        const { name, value } = e.target
        this.setState({
            [name]: value,
        })
        this.getLocation()
    }  


    
    render(){
        return(
            <>
                <div className = 'home'>
                    <div className='bookingContainer'>
                        {this.state.toggleHome ? 
                            <div>
                                <div className = "imgWrap">
                                    <div className = "img1"></div>
                                    <h1 className = 'cauta'>Validate yourself:</h1>
                                </div>
                            </div>
                            : 
                            <div className = "imgWrap">
                                <h1 className = 'cauta3'>{!this.state.enlargeToggle ? "Fotografiați rețeta sau produsul cãutat:" : "Poza salvatã:"}</h1>
                            </div>
                        }
                       
                        <form className = 'bookingForm' onSubmit={this.sendEmail}  >
                        {this.state.toggleHome ?
                            <div>
                                {!this.state.loading ?
                                <div>
                                    <input 
                                        type='email'
                                        name='email'
                                        placeholder='Email adress'
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    />
                                    <button className = 'photoButton' onClick = {() => this.toggle()}>{this.state.img.length ? "Retake photo" : "Take photo"} <img className = 'cameraLogo' alt ='' src = {camera}></img></button>
                                    <button className = 'button2'>Send</button>
                                </div>
                                
                                :
                                <Loading/>
                                }
                            </div>
                           
                           :
                            
                            <div className = "cameraWrap"> 
                            {this.state.img ?  
                                <div className = "savedImgWrap">
                                    { !this.state.enlargeToggle && this.state.img.length && <h2 className = "savedImg">Pozã salvatã:</h2>}
                                        <div style = {{display: "block", margin:"auto"}}>
                                        <div style = {{display: 'flex', alignItems: "center" , justifyContent: 'space-between'}}>
                                        {this.state.enlargeToggle && <p style = {{ cursor: "pointer" , fontFamily: "arial", color:"white", fontSize: "9pt" , fontWeight: '200'}} onClick = {() => this.enlargePicture()}>înapoi</p>}
                                        {this.state.enlargeToggle && <button onClick = {()=> this.deleteImg()}className = 'deletePic'>șterge</button>}
                                        </div>
                                        <img className = 'savedPicture' alt = '' src = {this.state.img}  style = {this.state.enlargeToggle ? document.documentElement.clientWidth < 900 ? {width: '85vw' , height: '60vh'} : {width: '300pt' , height: '300pt'} : null} onClick = {() => this.enlargePicture()}/> 
                                      
                                      </div>
                                </div>
                                :
                                null
                            }
                               { !this.state.enlargeToggle ?
                                <div>
                                    <PhotoCamera onTakePhoto = {this.onTakePhoto}/>
                                    <button className = 'cameraButton' onClick = {() => this.toggle()}>înapoi</button>
                                </div>
                                : 
                                null
                               }
                            </div>
                            }
                        </form>
                    </div>
                 </div>
            </>            
        )
    }
}

       
    export default Home