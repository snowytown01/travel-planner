function mask_screen(){
    let masking = document.createElement('div')
    masking.setAttribute('id', 'masking')
    masking.setAttribute('style', 'width: 100%; height: 100%; background-color: #000000; opacity: 0.5; position: absolute; top: 0px; left: 0px; z-index: 9999; text-align: center;')
    masking.textContent = 'Calculating optimal tour'

    document.body.appendChild(masking)
}

function demask_screen(){
    let masking = document.getElementById('masking')

    document.body.removeChild(masking)
}

window.onload = async function read_destination(){
    await fetch("http://192.168.1.3:80/destinations")
    .then(response => response.json())
    .then(data => { //data는 {"data": [{1row의 key:val, ...}, {2row의 key:val, ...}]}의 딕셔너리객체
        const destbox = document.getElementById('destbox')
        while (destbox.firstChild){
            destbox.removeChild(destbox.firstChild)
        }
        temp = data["data"] //temp는 [{1row의 key:val, ...}, {2row의 key:val, ...}] 리스트
        for (let i=0; i<temp.length; i++){
            let dest = document.createElement('div')
            dest.setAttribute('style', 'width: 440px; height: 30px; background-color: lightgreen; position: relative; left: 4.5px; border-radius: 20px; text-align: center; margin-top: 5px;')
            dest.textContent = temp[i]['lon'] + ', ' + temp[i]['lat'] + ', ' + temp[i]['util'] + ', ' + temp[i]['stay'] + ', ' + temp[i]['open'] + ', ' + temp[i]['close']
            destbox.append(dest)
        }
    })
}

async function read_destination(){
    await fetch("http://192.168.1.3:80/destinations")
    .then(response => response.json())
    .then(data => { //data는 {"data": [{1row의 key:val, ...}, {2row의 key:val, ...}]}의 딕셔너리객체
        const destbox = document.getElementById('destbox')
        while (destbox.firstChild){
            destbox.removeChild(destbox.firstChild)
        }
        temp = data["data"] //temp는 [{1row의 key:val, ...}, {2row의 key:val, ...}] 리스트
        for (let i=0; i<temp.length; i++){
            let dest = document.createElement('div')
            dest.textContent = Object.values(temp[i])       //values의 값들이 뒤죽박죽인 상태 고쳐야함
            destbox.append(dest)
        }
    })
}

async function create_destination(){
    if (document.getElementsByClassName('input')[0].value !== ""
    && document.getElementsByClassName('input')[1].value !== ""
    && document.getElementsByClassName('input')[2].value !== ""
    && document.getElementsByClassName('input')[3].value !== ""
    && document.getElementsByClassName('input')[4].value !== ""
    && document.getElementsByClassName('input')[5].value !== ""){
        let data = {
            lon: document.getElementById('lon').value,
            lat: document.getElementById('lat').value,
            util: document.getElementById('util').value,
            stay: document.getElementById('stay').value,
            open: document.getElementById('open').value,
            close: document.getElementById('close').value
        }
        
        await fetch("http://192.168.1.3:80/destinations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data) //body에 문자열을 실어보내는것이다. JSON.stringify()는 문자열이다
        })
        .then(response => response.json()) //서버에서 온 응답인 response는 method, headers, body 등의 정보가 들어있는 리스폰스객체이기때문에 response에 .json()메소드를 사용해서 json부분만을 딕셔너리객체로 가져오는것을 결과로 이행하는 또다른 프로미스를 반환함.
        .then(data => { //data는 {"data": [{1row의 key:val, ...}, {2row의 key:val, ...}]}의 딕셔너리객체
            const destbox = document.getElementById('destbox')
            while (destbox.firstChild){
                destbox.removeChild(destbox.firstChild)
            }
            temp = data["data"] //temp는 [{1row의 key:val, ...}, {2row의 key:val, ...}] 리스트
            for (let i=0; i<temp.length; i++){
                let dest = document.createElement('div')
                dest.setAttribute('style', 'width: 440px; height: 30px; background-color: lightgreen; position: relative; left: 4.5px; border-radius: 20px; text-align: center; margin-top: 5px;')
                dest.textContent = temp[i]['lon'] + ', ' + temp[i]['lat'] + ', ' + temp[i]['util'] + ', ' + temp[i]['stay'] + ', ' + temp[i]['open'] + ', ' + temp[i]['close']
                destbox.append(dest)
            }
        })

    }
    else{
        alert('please complete the input form.')
    }
}

async function delete_all_destinations(){
    await fetch("http://192.168.1.3:80/destinations", {
        method: "DELETE"
    })       
    .then()
    const destbox = document.getElementById('destbox')
    while (destbox.firstChild){
        destbox.removeChild(destbox.firstChild)
    }
}

async function read_optimalroute(){
    if (document.getElementById('starttime').value !== ""){
        mask_screen()

        let qs_starttime = "?starttime=" + document.getElementById('starttime').value

        await fetch("http://192.168.1.3:80/destinations/optimalroute" + qs_starttime)
        .then(response => response.json())
        .then(data => { //data는 {"data": html문서내용}의 딕셔너리 객체
            const section = document.getElementById('section')
            while (section.firstChild){
                section.removeChild(section.firstChild)
            }
            let iframeele = document.createElement('iframe')
            iframeele.setAttribute('srcdoc', data["data"])
            iframeele.setAttribute('style', 'border: none; width: 100%; height: 100%;')
            section.appendChild(iframeele)
        })

        demask_screen()
    }
    else{
        document.getElementById('starttime').style.cssText = "border: 2px solid red;"
    }
}