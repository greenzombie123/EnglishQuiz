return 

const stream = await navigator.mediaDevices.getUserMedia({audio:true})

const mediaRecorder = new MediaRecorder(stream)

let mediaSwitch = true

document.body.addEventListener("click", ()=>{
    if(mediaSwitch){
        mediaRecorder.start()
        mediaSwitch = false
        console.log(mediaRecorder.state)
    }
    else{
        mediaRecorder.stop()
        mediaSwitch = true
         console.log(mediaRecorder.state)
    }
})

let dataArray = []

mediaRecorder.ondataavailable = (e)=>{
    dataArray.push(e.data)
}

mediaRecorder.onstop = (e)=>{
    const blob = new Blob(dataArray, {type:"audio/mp3;"})

    const audioUrl = window.URL.createObjectURL(blob)

    const audio = document.createElement("audio")

    audio.src = audioUrl

    document.body.appendChild(audio)

    audio.play()
}


export{}