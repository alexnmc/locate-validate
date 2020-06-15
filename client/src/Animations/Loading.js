import React from 'react'
import ReactLoading from "react-loading"


const Loading = ({type, color}) => {
    
  return(
    <div className = "loading">
      {document.documentElement.clientWidth > 1100 ?
        <ReactLoading  type={'spin'} color={' rgb(0, 97, 207)'} height={'40pt'} width={'40pt'}/>
        :
        <ReactLoading  type={'spin'} color={' rgb(0, 97, 207)'} height={'30pt'} width={'30pt'}/>
      }
    </div>
  )
}




export default Loading