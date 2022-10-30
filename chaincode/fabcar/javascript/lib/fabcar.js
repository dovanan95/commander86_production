/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const {shim} = require('fabric-shim');

class FabCar extends Contract {
    
    async initLedger(ctx)
    {
        const user = [
            {
                userID: 'DVA',
                name: 'ADMIN',
                Phone: '0931910JQK',
                certification: 'THPT',
                position: 'admin',
                dept: 'BGD',
                password: '6868',
                command_recv_history: [
                    {'userID': 'LTA', 'username': 'Lo Thi A', 'docType': 'private_message'},
                    {'userID': 'BTC', 'username': 'Bui Thi C', 'docType': 'private_message'},
                ]
            },
            {
                userID: 'LTA',
                name: 'Lo Thi A',
                Phone: '0931910JQK',
                certification: 'Dai Hoc',
                position: 'Pho Phong',
                dept: 'CCTC',
                password: '6868',
                command_recv_history: [
                    {'userID': 'DVA', 'username': 'ADMIN', 'docType': 'private_message'},
                    {'userID': 'DTC', 'username': 'Dao Thi C', 'docType': 'private_message'},
                    {'userID': 'TVT', 'username': 'Tran Viet T', 'docType': 'private_message'},
                ]
            },
            {
                userID: 'TVT',
                name: 'Tran Viet T',
                Phone: '0931910JQK',
                certification: 'Tien Si',
                position: 'Truong Phong',
                dept: 'BTL',
                password: '6868',
                command_recv_history: [
                    {'userID': 'LTA', 'username': 'Lo Thi A', 'docType': 'private_message'},
                    {'userID': 'DTC', 'username': 'Dao Thi C', 'docType': 'private_message'},
                ]
            },
            {
                userID: 'DTC',
                name: 'Dao Thi C',
                Phone: '0931910JQK',
                certification: 'Dai Hoc',
                position: 'Nhan Vien',
                dept: 'BTL',
                password: '6868',
                command_recv_history: [
                    {'userID': 'LTA', 'username': 'Lo Thi A', 'docType': 'private_message'},
                    {'userID': 'TVT', 'username': 'Tran Viet T', 'docType': 'private_message'},
                ]
            },
            {
                userID: 'BTC',
                name: 'Bui Thi C',
                Phone: '0931910JQK',
                certification: 'THCS',
                position: 'Giam Doc',
                dept: 'BTL',
                password: '6868',
                command_recv_history: [
                    {'userID': 'DVA', 'username': 'ADMIN', 'docType': 'private_message'},
                ]
            },
            {
                userID: 'NVB',
                name: 'Nguyen Van B',
                Phone: '0931910JQK',
                certification: 'THPT',
                position: 'Pho Giam Doc',
                dept: 'BTL',
                password: '6868',
                command_recv_history: [
                    
                ]
            },
        ];

        for(let ii=0; ii<user.length; ii++)
        {
            user[ii].docType = 'user';
            await ctx.stub.putState(user[ii]['userID'], Buffer.from(JSON.stringify(user[ii])));
            console.info('ADD: ', user[ii]);
        }
    }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }
    //luu du lieu quan nhan
    async saveOfficerProfile(ctx, HoVaTen, HoVaTenKhaiSinh, NgaySinh, DanToc, BiDanh, TonGiao, TenKhac, NgayNhapNgu
        , SoHieuQuanNhan, NgayXuatNgu, SoCMND, NgayTaiNgu, GioiTinh, NguyenQuan, CapBac, NgayNhanCapBac,
        ThuongTru, ChucVu, NgayNhanChucVu, TPGiaDinh, TPBanThan, NgayVaoDang, NoiVaoDang, NgayVaoDangChinhThuc,
        NgayVaoDoan, ChucVuDoan, ChucVuDang, TrinhDoVanHoa, TrinhDoQuanLy, HocHam, TrinhDoLyLuanChinhTri, HocVi, TrinhDoCMKT, IDNguoiUpdate ){
            const quanNhan = {
                'HoVaTen': HoVaTen, 'HoVaTenKhaiSinh': HoVaTenKhaiSinh, 'NgaySinh': NgaySinh,
                'DanToc': DanToc, 'BiDanh': BiDanh, 'TonGiao': TonGiao, 'TenKhac': TenKhac, 'NgayNhapNgu': NgayNhapNgu,
                'SoHieuQuanNhan': SoHieuQuanNhan, 'NgayXuatNgu': NgayXuatNgu, 'SoCMND': SoCMND, 'NgayTaiNgu': NgayTaiNgu,
                'GioiTinh':GioiTinh, 'NguyenQuan':NguyenQuan, 'CapBac':CapBac, 'NgayNhanCapBac': NgayNhanCapBac,
                'ThuongTru': ThuongTru, 'ChucVu': ChucVu, 'NgayNhanChucVu': NgayNhanChucVu, 'TPGiaDinh': TPGiaDinh, 'TPBanThan': TPBanThan,
                'NgayVaoDang': NgayVaoDang, 'NoiVaoDang':NoiVaoDang,'NgayVaoDangChinhThuc': NgayVaoDangChinhThuc, 'NgayVaoDoan': NgayVaoDoan,
                'ChucVuDoan': ChucVuDoan, 'ChucVuDang': ChucVuDang, 'TrinhDoVanHoa': TrinhDoVanHoa, 
                'TrinhDoQuanLy': TrinhDoQuanLy, 'HocHam': HocHam, 'TrinhDoLyLuanChinhTri': TrinhDoLyLuanChinhTri,
                'HocVi': HocVi, 'TrinhDoCMKT': TrinhDoCMKT, 'docType': 'QuanNhan'
            }
            console.log('quanNhan', quanNhan)
            const lichSuCapNhatQuanNhan = {
                'SoHieuQuanNhan': SoHieuQuanNhan,
                'IDNguoiUpdate': IDNguoiUpdate,
                'NgayThangUpdate': Date.now().toString(),
                'docType': 'lichSuCapNhatQuanNhan'
            }
            const query_officer_check={
                "selector":{"SoHieuQuanNhan": SoHieuQuanNhan, "docType":'QuanNhan'}
            };
            let timestamp = Date.now();
            //var result = await this.queryCustom(ctx, JSON.stringify(query_officer_check)); console.log(result);
            await ctx.stub.putState(SoHieuQuanNhan, Buffer.from(JSON.stringify(quanNhan)));
            await ctx.stub.putState('lichSu'+ SoHieuQuanNhan , Buffer.from(JSON.stringify(lichSuCapNhatQuanNhan)))
            
            return('OK');
            //if(!result || JSON.parse(result.toString()).length==0){
                //let quanNhan = await ctx.stub.putState(SoHieuQuanNhan.toString(), Buffer.from(JSON.stringify(quanNhan)));
                //let lichSu = await ctx.stub.putState('lichSu'+ SoHieuQuanNhan.toString()+ timestamp.toString(), Buffer.from(JSON.stringify(lichSuCapNhatQuanNhan)))
                //return(quanNhan);
            //}
            //else if(result || JSON.parse(result.toString()).length>0){
                //return ('user already registered!');
            //}
 
    }

    //cap nhat du lieu quan nhan
    async updateOfficerProfile(ctx, HoVaTen, HoVaTenKhaiSinh, NgaySinh, DanToc, BiDanh, TonGiao, TenKhac, NgayNhapNgu
        , SoHieuQuanNhan, NgayXuatNgu, SoCMND, NgayTaiNgu, GioiTinh, NguyenQuan, CapBac, NgayNhanCapBac,
        ThuongTru, ChucVu, NgayNhanChucVu, TPGiaDinh, TPBanThan, NgayVaoDang, NoiVaoDang, NgayVaoDangChinhThuc,
        NgayVaoDoan, ChucVuDoan, ChucVuDang, TrinhDoVanHoa, TrinhDoQuanLy, HocHam, TrinhDoLyLuanChinhTri, HocVi, TrinhDoCMKT, IDNguoiUpdate){
            
                const quanNhan = {
                    'HoVaTen': HoVaTen, 'HoVaTenKhaiSinh': HoVaTenKhaiSinh, 'NgaySinh': NgaySinh,
                    'DanToc': DanToc, 'BiDanh': BiDanh, 'TonGiao': TonGiao, 'TenKhac': TenKhac, 'NgayNhapNgu': NgayNhapNgu,
                    'SoHieuQuanNhan': SoHieuQuanNhan, 'NgayXuatNgu': NgayXuatNgu, 'SoCMND': SoCMND, 'NgayTaiNgu': NgayTaiNgu,
                    'GioiTinh':GioiTinh, 'NguyenQuan':NguyenQuan, 'CapBac':CapBac, 'NgayNhanCapBac': NgayNhanCapBac,
                    'ThuongTru': ThuongTru, 'ChucVu': ChucVu, 'NgayNhanChucVu': NgayNhanChucVu, 'TPGiaDinh': TPGiaDinh, 'TPBanThan': TPBanThan,
                    'NgayVaoDang': NgayVaoDang, 'NoiVaoDang':NoiVaoDang,'NgayVaoDangChinhThuc': NgayVaoDangChinhThuc, 'NgayVaoDoan': NgayVaoDoan,
                    'ChucVuDoan': ChucVuDoan, 'ChucVuDang': ChucVuDang, 'TrinhDoVanHoa': TrinhDoVanHoa, 
                    'TrinhDoQuanLy': TrinhDoQuanLy, 'HocHam': HocHam, 'TrinhDoLyLuanChinhTri': TrinhDoLyLuanChinhTri,
                    'HocVi': HocVi, 'TrinhDoCMKT': TrinhDoCMKT, 'docType': 'QuanNhan'
                }
                const lichSuCapNhatQuanNhan = {
                    'SoHieuQuanNhan': SoHieuQuanNhan,
                    'IDNguoiUpdate': IDNguoiUpdate,
                    'NgayThangUpdate': Date.now(),
                    'docType': 'lichSuCapNhatQuanNhan'
                }
                let timestamp = Date.now();
                const userAsBytes = await ctx.stub.getState(SoHieuQuanNhan);
                const user_json = JSON.parse(userAsBytes.toString());
                user_json = quanNhan;
    
                await ctx.stub.putState(SoHieuQuanNhan.toString(), Buffer.from(JSON.stringify(user_json)));
                await ctx.stub.putState('lichSu'+ SoHieuQuanNhan.toString()+ timestamp.toString(), Buffer.from(JSON.stringify(lichSuCapNhatQuanNhan)))
                return('finish');
    }

    async authentication(ctx, userID, password)
    {
        //code
        const query_authen={
            "selector":{"userID":userID, "password":password, "docType":"user"}
        };
        const result = await this.queryCustom(ctx, JSON.stringify(query_authen));
        if(result || JSON.parse(result.toString()).length>0)
        {
            var user = JSON.parse(result.toString());
            var username = user[0].Record.name;
            return(username);
        }
        else if(!result || JSON.parse(result.toString()).length==0)
        {
            return(false);
        }
    }
    
    async queryUser(ctx, userID){
        const userAsBytes = await ctx.stub.getState(userID);
        if(!userAsBytes || userAsBytes.length === 0)
        {
            throw new Error(`${userAsBytes} does not exist`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }

    async transfer_login(ctx, uid, username)
    {
        const userAsBytes = await ctx.stub.getState(uid);
        if(!userAsBytes || userAsBytes.length === 0)
        {
            var new_user= {
                userID: uid,
                name: username,
                command_recv_history: []
            };
            await ctx.stub.putState(uid, Buffer.from(JSON.stringify(new_user)));
        }
    }

    async updateCommandHistory(ctx, userID, partnerID, docType)
    {
        function array_move(arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr; // for production
        };
        if(docType=='private_message')
        {
            const userAsBytes = await ctx.stub.getState(userID);
            const user_json = JSON.parse(userAsBytes.toString());
            const prtnerAsBytes = await ctx.stub.getState(partnerID);
            const prtJson = JSON.parse(prtnerAsBytes.toString());
            var prtner_name = prtJson.name;
            var flag =0; var index;
            for(let i in user_json.command_recv_history)
            {
                if(user_json.command_recv_history[i]['userID']==partnerID)
                {
                    flag=1;
                    index=i;
                }
            }
            if(flag==0)
            {
                var cmd_hist = user_json.command_recv_history;
                cmd_hist.unshift({'userID': partnerID, 'username': prtner_name, 'docType':'private_message'});
                user_json.command_recv_history = cmd_hist;
                await ctx.stub.putState(userID, Buffer.from(JSON.stringify(user_json)));

                var cmd_prtn_hist = prtJson.command_recv_history;
                cmd_prtn_hist.unshift({'userID': userID, 'username': user_json.name, 'docType':'private_message'});
                prtJson.command_recv_history = cmd_prtn_hist;
                await ctx.stub.putState(partnerID, Buffer.from(JSON.stringify(prtJson)));
            }
            else if(flag==1)
            {
                var cmd_hist_1= user_json.command_recv_history;
                user_json.command_recv_history = array_move(cmd_hist_1, index, 0);
                await ctx.stub.putState(userID, Buffer.from(JSON.stringify(user_json)));

                var cmd_prtn_hist_1 = prtJson.command_recv_history;
                var kk;
                for(let j in cmd_prtn_hist_1)
                {
                    if(cmd_prtn_hist_1[j]['userID']==userID)
                    {
                        kk=j;
                    }
                }
                prtJson.command_recv_history= array_move(cmd_prtn_hist_1, kk, 0);
                await ctx.stub.putState(partnerID, Buffer.from(JSON.stringify(prtJson)));
            }
        }
        else if(docType=='group_message')
        {
            var group_id = partnerID;
            //code 
        }
        
    }

    async queryHistoryMessage(ctx, userID){
        const userAsBytes = await ctx.stub.getState(userID);
        if(!userAsBytes || userAsBytes.length === 0)
        {
            throw new Error(`${userAsBytes} does not exist`);
        }
        var user = JSON.parse(userAsBytes.toString());
        var messageHistory = user.command_recv_history
        return JSON.stringify(messageHistory);
    }

    async createUser(ctx, userID, name, Phone, certification, position, dept, password) {
        console.info('============= START : Create User ===========');

        const user = {
            userID,
            docType: 'user',
            name,
            Phone,
            certification,
            position,
            password, 
            dept,
            command_recv_history:[]
        };
        const query_authen={
            "selector":{"userID":userID, "docType":"user"}
        };
        var result = await this.queryCustom(ctx, JSON.stringify(query_authen));
        if(JSON.parse(result.toString()).length>0)
        {
            return('user already register');
        }
        else if(JSON.parse(result.toString()).length==0)
        {
            //return(false);
            await ctx.stub.putState(userID, Buffer.from(JSON.stringify(user)));
            return('finish');
        }
        //await ctx.stub.putState(userID, Buffer.from(JSON.stringify(user)));
            //return('finish');
    }

    async savePrivateMessage(ctx, messID, sender, sender_name, receiver, content, timestamp, rawObj)
    {
        var message = {
            messID,
            docType: 'private_message',
            sender,
            receiver,
            content,
            sender_name,
            timestamp,
            rawObj
        }
        await ctx.stub.putState(messID, Buffer.from(JSON.stringify(message)));
        //await this.updateCommandHistory(ctx, sender, receiver, 'private_message');
    }

    async saveGroupMessage(ctx, messID, room_id, sender, sender_name, content, timestamp, rawObj)
    {
        var message = {
            messID,
            docType: 'group_message',
            room_id,
            sender,
            sender_name,
            content,
            timestamp,
            rawObj
        }
        await ctx.stub.putState(messID, Buffer.from(JSON.stringify(message)));
        console.log('saved group message');
    }

    async saveSecurePrivateMessage(ctx, messID, sender, sender_name, receiver, content, timestamp, rawObj){
        var message = {
            messID,
            docType: 'secure_private_message',
            sender,
            receiver,
            content,
            sender_name,
            timestamp,
            rawObj
        }
        await ctx.stub.putState(messID, Buffer.from(JSON.stringify(message)));
    }

    async queryMessage(ctx,sender, receiver, docType, limit, skip)
    {
        if(docType=='private_message')
        {
            //code
            const query_private_message = {
                "selector":{
                    "$or":[
                        {"sender": sender, "receiver": receiver},
                        {"sender": receiver, "receiver": sender}
                    ],
                    "timestamp": {"$gt": null}
                },
                "sort":[{"timestamp":"desc"}],
                "limit": parseInt(limit),
                "skip": parseInt(skip),
                "use_index": ["_design/indexPrivMessDoc", "indexPrivMess"]
            }
            var result = await this.queryCustom(ctx, JSON.stringify(query_private_message));
            return(result);
        }
    }
    async queryCustom(ctx, queryString) {
		return await this.GetQueryResultForQueryString(ctx, queryString);
	}

    async GetQueryResultForQueryString(ctx, queryString) {

		let resultsIterator = await ctx.stub.getQueryResult(queryString);
		let results = await this._GetAllResults(resultsIterator, false);

		return JSON.stringify(results);
    }
    async _GetAllResults(iterator, isHistory) {
		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				console.log(res.value.value.toString('utf8'));
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.txId;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		return allResults;
	}

    async verifyMessBlockchain(ctx, messID, dateTime){
        try
        {
            const messBlock = await ctx.stub.getState(messID);
            const messBlock_json = JSON.parse(messBlock.toString());
            messBlock_json.verify_time = dateTime;
            if(messBlock_json.hasOwnProperty('verify_count'))
            {
                var count = parseInt(messBlock_json.verify_count);
                count++;
                messBlock_json.verify_count= count.toString();
            }
            else if(!messBlock_json.hasOwnProperty('verify_count'))
            {
                messBlock_json.verify_count="1";
            }
            await ctx.stub.putState(messID, Buffer.from(JSON.stringify(messBlock_json)));
            const messBlock_2 = await ctx.stub.getState(messID);
            return messBlock_2.toString();
        }
        catch(error)
        {
            return error;
        }
        
    }

    async queryAllData(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeUserPhone(ctx, userID, newPhone) {
        console.info('============= START : changeUserPhone ===========');

        const userAsBytes = await ctx.stub.getState(userID); // get the car from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userNumber} does not exist`);
        }
        const user = JSON.parse(userAsBytes.toString());
        user.Phone = newPhone;

        await ctx.stub.putState(userID, Buffer.from(JSON.stringify(user)));
        console.info('============= END : changeUserPhone ===========');
    }

}

module.exports = FabCar;