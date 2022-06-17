function serializeRSAKey(key) {
    return JSON.stringify({
        coeff: key.coeff.toString(16),
        d: key.d.toString(16),
        dmp1: key.dmp1.toString(16),
        dmq1: key.dmq1.toString(16),
        e: key.e.toString(16),
        n: key.n.toString(16),
        p: key.p.toString(16),
        q: key.q.toString(16)
      })
    }

function deserializeRSAKey(key) {
      let json = JSON.parse(key);
      let rsa = new RSAKey();
      rsa.setPrivateEx(json.n, json.e, json.d, json.p, json.q, json.dmp1, json.dmq1, json.coeff);
      return rsa;
    }
function SecurePrivMessageTextObj(message, docType, senderID, receiverID, sender_name, sender_pubKey, receiver_pubKey, socket, socket_event ){
    try
    {
        if(docType=='secure_private_message'){
            message = encodeURIComponent(message);
            let privateKeyString = sessionStorage.getItem('privKeyRSA');
            let privKeyRSA = deserializeRSAKey(privateKeyString);
            let encrypted_sender_mess =cryptico.encrypt(message, sender_pubKey, privKeyRSA); console.log('encr_sender', encrypted_sender_mess);
            let encrypted_sender_receiver = cryptico.encrypt(message, receiver_pubKey, privKeyRSA); console.log('receiv', encrypted_sender_receiver);
            var encrypted_message = [
                {'userID': senderID, 'encrypted_message': encrypted_sender_mess},
                {'userID': receiverID, 'encrypted_message':encrypted_sender_receiver}
            ];
            var secure_data={
                'messID': 'securePrivMess.' + senderID+ '.'+ receiverID + '.' + Date.now().toString(),
                'docType': 'secure_private_message',
                'sender': parseInt(senderID),
                'receiver': parseInt(receiverID),
                'message': encrypted_message, //ex:[{'userID': 123, encrypted_message: 'e393nd3823d'}] 
                'sender_name': sender_name,
                'timestamp':parseInt(Date.now()),
                'isImportant': 'false',
                'seen':[],
            }
            socket.emit(socket_event, secure_data);
        }
    
    }
    catch(error){
        console.log(error);
    }
}

function decryptMyMessage(message){
    try{
        var myID_json = sessionStorage.getItem('login_data');
        var myID = parseInt(JSON.parse(myID_json)['id']);
        let privateKeyString = sessionStorage.getItem('privKeyRSA');
        let privKeyRSA = deserializeRSAKey(privateKeyString);
        var myMessage;
        for(let i=0;i<message.length;i++){
            if(myID==message[i].userID){
                myMessage=message[i].encrypted_message.cipher;
            }
        }
        var decodedMessage = cryptico.decrypt(myMessage, privKeyRSA);
        console.log(decodedMessage);
        if(decodedMessage.signature=='verified'){
            return decodeURIComponent(decodedMessage.plaintext);
        }
        else if(decodedMessage.signature=='unsigned'){
            return 'tin nhan khong an toan';
        }
        else if(decodedMessage.status == 'failure')
        {
            return '***********************';
        }

    }catch(error){
        console.log(error);
    }
}

    //------------------Call------------------//
    function call()
    {
        if(sessionStorage.getItem('current_partner_id'))
        {
            var partnerID = sessionStorage.getItem('current_partner_id');
            var partner_element = document.getElementById(tab_partner_prefix+ partnerID);
            var docType = partner_element.getAttribute('docType');
            if(docType=='private_message'){
                var online_list = JSON.parse(sessionStorage.getItem('online_partner'));
                let flag_online=0;
                for(let i=0;i<online_list.live.length;i++)
                {
                    if(online_list.live[i].userID==partnerID)
                    {
                        flag_online=1;
                    }
                }
                if(flag_online==1)
                {
                    window.open('/call?partnerID='+partnerID+'&docType='+docType+'&call=caller');
                }
                else if(flag_online==0)
                {
                    alert('nguoi nhan cuoc goi dang ngoai tuyen');
                }
                
            }
        }
        else if(!sessionStorage.getItem('current_partner_id'))
        {
            alert('chon nguoi goi');
        }

    }

    //----------------End Call--------------------------//

    //------------------Search User-----------------------
    function el_partner_connect(id, name, position, dept, Phone, rank)
    {
        var element_partner_selection_element =
        `
            <div class="tablinks" username="${name}"" id="${tab_partner_prefix+id}" dept="${dept}" rank="${rank}"
                onclick={connect_user(this)} id_user="${id}" position="${position}" Phone="${Phone}">
                <div class="acc-status">
                    <div class="acc">${name}</div>
                    <div class="status-online">${rank}</div>
                </div>
            </div>
            <hr class="solid">
        `
        return element_partner_selection_element;
    }
    var id = document.getElementById("input_ID");

    id.addEventListener("keyup", function(e){
        if (e.keyCode === 13){
        search();
        }
    })
    var user_obj;
    async function search()
    {
        if(myID==id.value) {
        alert('this is your ID');
        } 
        else
        {
            const options = {
                method: 'GET',
                headers: {
                    'authorization': 'token '+ accessToken,
                }
            }
            var res = await fetch('/searchUserByID?id='+id.value, options);
            var res_json = await res.json();
            console.log(res_json);
            if(res_json.data == 'no_data')
            {
                infor.innerHTML='no information';
            }
            else if(res_json.data != 'no_data')
                {
                    left_tab.innerHTML='';
                    for(let i=0;i<res_json.data.length;i++)
                    {
                        var el_connect= el_partner_connect(res_json.data[i].id,res_json.data[i].TenDayDu,
                        res_json.data[i].chuc_vu, res_json.data[i].TenDonVi, res_json.data[i].Mobile, res_json.data[i].cap_bac);
                        left_tab.insertAdjacentHTML("beforeend", el_connect);
                    }
                    sessionStorage.setItem('temp_list_connect', JSON.stringify(res_json.data));
                }
        }
        
    }

    function connect_user(obj)
    {
        var searchUrl = "/user_information";
        var connect_list = JSON.parse(sessionStorage.getItem('temp_list_connect'));
        var uid = obj.getAttribute('id_user');
        var user_obj;
        for(let i=0;i<connect_list.length;i++)
        {
            if(uid==connect_list[i].id)
            {
                searchUrl=searchUrl+'?id_user='+connect_list[i].id;
                console.log(searchUrl);
                window.location.href = searchUrl;
                //window.open(searchUrl);
            }
        }
        
    }

    //---------------End Search User-------------------------------