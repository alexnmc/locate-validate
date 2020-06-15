import React from 'react'
import Camera, { FACING_MODES, IMAGE_TYPES} from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'

const PhotoCamera = (props) => {
    
    function onCameraError(error){
        alert('Please activate your camera!')
    }
    
    return(
        <Camera
            sizeFactor = {0.4}
            isImageMirror = {true}
            idealFacingMode = {FACING_MODES.USER}
            onTakePhoto = { (dataUri) => { props.onTakePhoto(dataUri)} }
            onCameraError = { (error) => { onCameraError(error) } }
            isDisplayStartCameraError = {false}
            imageType = {IMAGE_TYPES.JPG}
            imageCompression = {1}
        />
    )
}

export default PhotoCamera