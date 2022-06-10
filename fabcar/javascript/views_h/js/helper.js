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