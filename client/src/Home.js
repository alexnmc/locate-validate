import React, {Component} from 'react'
import Loading from './Animations/Loading.js'
import axios from 'axios'
import camera from './Icons/camera.png'
import PhotoCamera from './Camera'
import moment from 'moment'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
const openGeocoder = require('node-open-geocoder');


class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
           img: '',
           email: '',
           date: new Date(),
           enlargeToggle: false,
           toggleHome: true,
           toggle: false,
           loading: 'off',
        }
    }

    componentDidMount(){
        this.getLocation()
    }

    getLocation = () => {
        navigator.geolocation.getCurrentPosition(
        function(position) {
            openGeocoder().reverse(position.coords.longitude, position.coords.latitude)
                .end((err, res) => {       
                        if(err){
                            alert('Location Unknown !')
                        }  
                        if(res){
                            localStorage.setItem("address", JSON.stringify(res.address))
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
        if(!this.state.img){
            alert("Please take your photo!")
            return null
        }

        this.setState({
            loading: "on"
        })
        
        const newMail = {
            date: moment(this.state.date).format("LLLL"),
            email: this.state.email,
            location: JSON.parse(localStorage.getItem("address")) || {},
            img: this.state.img || '',
        }
       
        axios.post('/mail', newMail).then(res => {
            this.setState({
                loading: "off"
            })
            let response = !res.data.code ? res.data : "Something went wrong, please try again."
            this.alertCallBack(response)
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
        var answer = window.confirm("Are you sure you want to delete?")
            if(answer){
                this.setState({
                    img: '',
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
        const { name, value } = e.target
        this.setState({
            [name]: value,
        })
    } 
    
    alertCallBack = (message) => {
        confirmAlert({
         customUI: ({ onClose }) => {
           return (
             <div className='customAlert'>
               <h1 className = "alertH1">{message}</h1>
               {message === "Email sent!" && <h1 className = "alertH1">Thank you for using Validate!</h1>}
               <button style = {{marginBottom: "30pt"}} className = 'photoButton' onClick={onClose}>close</button>
             </div>
           )
         }
       })
    }


    render(){
        return(
            <>
                <div className = 'home'>
                    <div className='bookingContainer'>
                        {this.state.toggleHome ? 
                            <div>
                                <div className = "imgWrap">
                                    <h1 className = 'cauta'>{this.state.loading === "off" ? "Enter details:" : "Sending..."}</h1>
                                </div>
                            </div>
                            : 
                            <div className = "imgWrap">
                                <h1 className = 'cauta3'>{!this.state.enlargeToggle ? "Take your photo:" : "Photo saved"}</h1>
                            </div>
                        }
                       
                        <form className = 'bookingForm' onSubmit={this.sendEmail}>
                        {this.state.toggleHome ?
                            <div>
                                {this.state.loading === 'off' ?
                                <div>
                                    <input 
                                        type='email'
                                        name='email'
                                        placeholder='email address'
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        required={true}
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
                                   {!this.state.enlargeToggle && this.state.img.length && <h2 className = "savedImg">Saved photo:</h2>}
                                    <div style = {{display: "block", margin:"auto"}}>
                                        <div style = {{display: 'flex', alignItems: "center" , justifyContent: 'space-between'}}>
                                            {this.state.enlargeToggle && <p className = "returnImg" onClick = {() => this.enlargePicture()}>return</p>}
                                            {this.state.enlargeToggle && <button onClick = {()=> this.deleteImg()}className = 'deletePic'>delete</button>}
                                        </div>
                                        <img 
                                            className = 'savedPicture' 
                                            alt = '' src = {this.state.img}  
                                            style = {this.state.enlargeToggle ? document.documentElement.clientWidth < 900 ? {width: '85vw' , height: '60vh'} : {width: '300pt' , height: '300pt'} : null} 
                                            onClick = {() => this.enlargePicture()}
                                        /> 
                                    </div>
                                </div>
                                :
                                null
                            }
                               { !this.state.enlargeToggle ?
                                <div>
                                    <PhotoCamera onTakePhoto = {this.onTakePhoto}/>
                                    <button className = 'cameraButton' onClick = {() => this.toggle()}>return</button>
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