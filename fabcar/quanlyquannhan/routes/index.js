const { json } = require('express');
var express = require('express');
var router = express.Router();
var blockChain = require('../utils/blockchain')
var validateInput = require('../utils/validateRequest');
var backInTime = require('../utils/backInTime');
const { clone } = require('lodash');
/* GET home page. */

async function contract() {
  const contract = await blockChain.contract();
  return contract;
}
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/createUser', async function (req, res) {
  try {
    /*let userID = '123456';
    let name = 'Do Van An';
    let Phone = '0904039946';
    let certification = 'Cao Hoc';
    let position = 'developer';
    let password = 'ahihi';
    let dept = 'IT';*/
    let userID = req.body.userID;
    let name = req.body.name
    let Phone = req.body.Phone;
    let certification = req.body.certification;
    let position = req.body.position;
    let password = req.body.password;
    let dept = req.body.dept;
    const contract_ = await contract();
    const block = await contract_.submitTransaction('createUser', userID, name, Phone, certification, position, dept, password);
    console.log(block.toString());
    res.status(200).send('ok')
  }
  catch (err) {
    res.status(400).send(err)
  }
})

router.post('/saveOfficerProfile', async function (req, res, next) {

  try {
    let body = clone(req.body);
    let missItem = await validateInput.saveOfficerProfileValidation(req);
    if (missItem.length > 0) {
      console.log('miss items', missItem)
      if (missItem.includes('user_id') || missItem.includes('SoHieuQuanNhan')) {
        //res.status(400).send({ 'statusCode': res.statusCode, 'miss Item': missItem });
        res.status(400).send({ 'statusCode': res.statusCode, 'message': 'user_id or SoHieuQuanNhan unavailable' });
        next();
      }
      for (let item of missItem) {
        body[item.toString()] = "";
      }

    }
    console.log('body', body);
    console.log('suc khoe', body.SucKhoe)
    let user_id = body.user_id;
    let HoVaTen = body.HoVaTen;
    let HoVaTenKhaiSinh = body.HoVaTenKhaiSinh;
    let NgaySinh = parseInt(body.NgaySinh);
    let DanToc = body.DanToc;
    let BiDanh = body.BiDanh;
    let TonGiao = body.TonGiao;
    let TenKhac = body.TenKhac;
    let NgayNhapNgu = parseInt(body.NgayNhapNgu);
    let SoHieuQuanNhan = body.SoHieuQuanNhan;
    let NgayXuatNgu = parseInt(body.NgayXuatNgu);
    let SoCMND = body.SoCMND;
    let NgayTaiNgu = parseInt(body.NgayTaiNgu);
    let GioiTinh = body.GioiTinh;
    let NguyenQuan = body.NguyenQuan;
    let CapBac = body.CapBac;
    let NgayNhanCapBac = parseInt(body.NgayNhanCapBac);
    let ThuongTru = body.ThuongTru;
    let ChucVu = body.ChucVu;
    let NgayNhanChucVu = parseInt(body.NgayNhanChucVu);
    let TPGiaDinh = body.TPGiaDinh;
    let TPBanThan = body.TPBanThan;
    let NgayVaoDang = parseInt(body.NgayVaoDang);
    let NoiVaoDang = body.NoiVaoDang;
    let NgayVaoDangChinhThuc = parseInt(body.NgayVaoDangChinhThuc);
    let NgayVaoDoan = parseInt(body.NgayVaoDoan);
    let ChucVuDoan = body.ChucVuDoan;
    let ChucVuDang = body.ChucVuDang;
    let TrinhDoVanHoa = body.TrinhDoVanHoa;
    let TrinhDoQuanLy = body.TrinhDoQuanLy;
    let HocHam = body.HocHam;
    let TrinhDoLyLuanChinhTri = body.TrinhDoLyLuanChinhTri;
    let HocVi = body.HocVi;
    let TrinhDoCMKT = body.TrinhDoCMKT;
    let IDNguoiUpdate = body.IDNguoiUpdate;
    let updateTime = parseInt(Date.now());
    let CapToChucDaoTao = body.CapToChucDaoTao;
    let CoSoDaoTao = body.CoSoDaoTao;
    let ChungChiDaoTao = body.ChungChiDaoTao;
    let NoiDungDaoTao = body.NoiDungDaoTao;
    let SucKhoe = body.SucKhoe;
    let BacLuong = body.BacLuong;
    let NhomMau = body.NhomMau;
    let HeSoLuong = parseInt(body.HeSoLuong);
    let SoBHXH = body.SoBHXH;
    let TinhTrangHonNhan = body.TinhTrangHonNhan;
    let NganhQuanLy = body.NganhQuanLy;
    let DonVi = body.DonVi;
    let NganhNgheDaoTao = body.NganhNgheDaoTao;
    let LoaiHinhDaoTao = body.LoaiHinhDaoTao;
    let TrinhDoNgoaiNgu = body.TrinhDoNgoaiNgu


    const contract_ = await contract();

    const queryString = {
      "selector": {
        'user_id': req.body.user_id,
        'docType': 'QuanNhan'
      }
    }

    const thongTinQuanNhan = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
    console.log('TTQN', thongTinQuanNhan.toString());

    let blockChainRep;
    if (JSON.parse(thongTinQuanNhan).length == 0) {
      console.log('no data', JSON.parse(thongTinQuanNhan).length);
      blockChainRep = await contract_.submitTransaction('saveOfficerProfile',
        user_id, HoVaTen, HoVaTenKhaiSinh, NgaySinh, DanToc, BiDanh, TonGiao, TenKhac, NgayNhapNgu,
        SoHieuQuanNhan, NgayXuatNgu, SoCMND, NgayTaiNgu, GioiTinh, NguyenQuan, CapBac, NgayNhanCapBac,
        ThuongTru, ChucVu, NgayNhanChucVu, TPGiaDinh, TPBanThan, NgayVaoDang, NoiVaoDang, NgayVaoDangChinhThuc,
        NgayVaoDoan,
        ChucVuDoan, ChucVuDang, TrinhDoVanHoa, TrinhDoQuanLy, HocHam, TrinhDoLyLuanChinhTri, HocVi,
        TrinhDoCMKT, IDNguoiUpdate,
        CapToChucDaoTao, CoSoDaoTao, ChungChiDaoTao, NoiDungDaoTao, SucKhoe, BacLuong, NhomMau, HeSoLuong,
        SoBHXH, TinhTrangHonNhan, NganhQuanLy,
        DonVi, NganhNgheDaoTao, LoaiHinhDaoTao, TrinhDoNgoaiNgu,
        updateTime);
      //blockChainRep = await contract_.submitTransaction('savePrivateMessage', '1', '2', '3', '4', '5', '6', '7')
      let verify = await contract_.submitTransaction('verifyMessBlockchain', user_id, new Date().getTime())
    }
    else if (JSON.parse(thongTinQuanNhan).length > 0) {
      console.log('available data', JSON.parse(thongTinQuanNhan).length);
      blockChainRep = await contract_.submitTransaction('updateOfficerProfile',
        user_id, HoVaTen, HoVaTenKhaiSinh, NgaySinh, DanToc, BiDanh, TonGiao, TenKhac, NgayNhapNgu,
        SoHieuQuanNhan, NgayXuatNgu, SoCMND, NgayTaiNgu, GioiTinh, NguyenQuan, CapBac, NgayNhanCapBac,
        ThuongTru, ChucVu, NgayNhanChucVu, TPGiaDinh, TPBanThan, NgayVaoDang, NoiVaoDang, NgayVaoDangChinhThuc,
        NgayVaoDoan,
        ChucVuDoan, ChucVuDang, TrinhDoVanHoa, TrinhDoQuanLy, HocHam, TrinhDoLyLuanChinhTri, HocVi,
        TrinhDoCMKT, IDNguoiUpdate,
        CapToChucDaoTao, CoSoDaoTao, ChungChiDaoTao, NoiDungDaoTao, SucKhoe, BacLuong, NhomMau, HeSoLuong,
        SoBHXH, TinhTrangHonNhan, NganhQuanLy,
        DonVi, NganhNgheDaoTao, LoaiHinhDaoTao, TrinhDoNgoaiNgu,
        updateTime)
      console.log('blockChainRep', JSON.parse(blockChainRep.toString()));
    }

    let responseBlock = JSON.parse(blockChainRep.toString());
    if (responseBlock.message == 'ok') {
      res.status(200).send({ 'statusCode': res.statusCode, 'message': 'ok' });
    }
    else if (responseBlock.message == 'ng') {
      res.status(400).send({ 'statusCode': res.statusCode, 'message': 'ng', 'status': responseBlock.status });
    }

  }
  catch (error) {
    console.log(error);
    res.status(400).send({ 'message': error });
  }
});

router.get('/timkiem', async function (req, res, next) {
  try {
    const contract_ = await contract();

    let query = req.query;
    /*let DonVi = query.DonVi;
    let HoVaTen = query.HoVaTen;
    let NganhNgheDaoTao = query.NganhNgheDaoTao;
    let NguyenQuan = query.NguyenQuan;*/

    let sort = query.sort;
    let limit = query.limit;

    let skip;
    let page = query.page;

    if (page == 1) {
      skip = 0
    }
    else {
      skip = (page - 1) * limit;
    }

    //let queryParam = { DonVi, HoVaTen, NganhNgheDaoTao, NguyenQuan };
    let queryParam;
    if (!query.metric) {
      queryParam = {}
    }
    else if (query.metric) {
      let metric = decodeURIComponent(query.metric);
      if (metric == '""') {
        metric = '';
      }

      queryParam = {
        '$or': [
          {
            'DonVi':
              { '$regex': '(?i)' + metric }
          },
          {
            'HoVaTen':
              { '$regex': '(?i)' + metric }
          },
          {
            'NganhNgheDaoTao':
              { '$regex': '(?i)' + metric }
          },
          {
            'NguyenQuan':
              { '$regex': '(?i)' + metric }
          }
        ]
      }
    }

    /*for (let param in queryParam) {
      if (queryParam[param] == undefined || queryParam[param] == '""') {
        delete queryParam[param]
      }
      else if (queryParam[param] != undefined) {
        queryParam[param] = decodeURIComponent(queryParam[param])
      }
    }*/
    //queryParam["HoVaTen"] = { "$gt": null }
    queryParam.docType = "QuanNhan";
    let queryString = {
      "selector": queryParam,
      "sort": [{ "HoVaTen": "asc" }],
      //"limit": parseInt(limit),
      "skip": parseInt(skip),
      "use_index": ["indexQuanNhanDoc", "indexQuanNhan"],
      "execution_stats": true
    }
    console.log('queryString', queryString)
    const thongTinQuanNhan = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
    let queryCount = {
      "selector": queryParam
    }
    const countTTQN = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryCount));
    let result = JSON.parse(thongTinQuanNhan.toString());
    let total = JSON.parse(countTTQN.toString()).length;
    let _result = result.slice(0, limit);
    res.status(200).send(
      {
        'statusCode': res.statusCode,
        'message': _result,
        'page': parseInt(page),
        'limit': parseInt(limit),
        'total': total
      })
  }
  catch (error) {
    console.log(error);
    res.status(400).send({ 'message': error });
  }
});
router.get('/timkiemthongke', async function (req, res, next) {
  try {
    const contract_ = await contract();
    let query = req.query;
    let filter = query.filter;
    let value = decodeURIComponent(query.value); console.log('value', query.value, value);

    if (value == '') {
      value = '""';
    }

    let limit = query.limit;

    let skip;
    let page = query.page;

    if (page == 1) {
      skip = 0
    }
    else {
      skip = (page - 1) * limit;
    }
    let queryParam = {};
    if (filter == 'KhuVucDiaLy' && value != '""') {
      if (value == 'TP Hà Nội') {
        queryParam = { 'ThuongTru': value }
      }
      else if (value != 'TP Hà Nội') {
        queryParam = {
          '$not': {
            'ThuongTru': value
          },
        }
      }
    }
    else if (filter == 'CoSoDaoTao' && value != '""') {
      if (value == 'TP Hà Nội') {
        queryParam = { 'CoSoDaoTao': value }
      }
      else if (value != 'TP Hà Nội') {
        queryParam = {
          '$not': {
            'CoSoDaoTao': value
          }
        }
      }
    }
    else if (filter == 'SoNamNhapNgu') {
      if (value == '25') {
        queryParam = { 'NgayNhapNgu': { '$lt': backInTime.backInTime(25) } }
      }
      else {
        queryParam = {
          '$and': [
            {
              'NgayNhapNgu': { '$lt': backInTime.backInTime(value.split('-')[0]) }
            },
            {
              'NgayNhapNgu': { '$gte': backInTime.backInTime(value.split('-')[1]) }
            }
          ]
        }
      }
    }
    else if (filter == 'SoTuoi') {
      if (value == '30') {
        queryParam = {
          'NgaySinh': { '$gte': backInTime.backInTime(30) }
        }
      }
      else {
        queryParam = {
          '$and': [
            {
              'NgaySinh': { '$lt': backInTime.backInTime(value.split('-')[0]) }
            },
            {
              'NgaySinh': { '$gte': backInTime.backInTime(value.split('-')[1]) }
            }
          ]
        }
      }
    }
    else {
      queryParam[filter] = value;
    }

    queryParam['docType'] = 'QuanNhan';

    let queryString = {
      "selector": queryParam,
      "sort": [{ "HoVaTen": "asc" }],
      //"limit": parseInt(limit),
      "skip": parseInt(skip),
      "use_index": ["indexQuanNhanDoc", "indexQuanNhan"],
      "execution_stats": true
    }
    console.log('queryString', queryString)
    const thongTinQuanNhan = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
    let queryCount = {
      "selector": queryParam
    }
    const countTTQN = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryCount));
    let result = JSON.parse(thongTinQuanNhan.toString());
    let total = JSON.parse(countTTQN.toString()).length;
    let _result = result.slice(0, limit);
    res.status(200).send(
      {
        'statusCode': res.statusCode,
        'message': _result,
        'page': parseInt(page),
        'limit': parseInt(limit),
        'total': total
      })


  } catch (err) {
    console.log(error);
    res.status(400).send({ 'message': error });
  }
})

router.get('/thongke', async function (req, res, next) {
  try {

    const contract_ = await contract();
    let query = req.query;

    /*for (let i in query) {
      if (query[i] == '""') {
        query[i] = '';
      }
    }*/
    console.log('thongke query', query)

    let DonVi = decodeURIComponent(query.DonVi);
    let ChucVu = decodeURIComponent(query.ChucVu);
    let CapBac = decodeURIComponent(query.CapBac);
    let TrinhDoNgoaiNgu = decodeURIComponent(query.TrinhDoNgoaiNgu);

    let KhuVucDiaLy = decodeURIComponent(query.KhuVucDiaLy);
    let ChungChiDaoTao = decodeURIComponent(query.ChungChiDaoTao);
    let TrinhDoCMKT = decodeURIComponent(query.TrinhDoCMKT);
    let LoaiHinhDaoTao = decodeURIComponent(query.LoaiHinhDaoTao);
    let CoSoDaoTao = decodeURIComponent(query.CoSoDaoTao);

    let SoNamNhapNgu = decodeURIComponent(query.SoNamNhapNgu);
    let SoTuoi = decodeURIComponent(query.SoTuoi);

    let queryDonVi = {
      'selector': { 'DonVi': DonVi, 'docType': 'QuanNhan' }
    }

    let _DonVi;
    let countDonVi;


    _DonVi = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryDonVi));
    countDonVi = JSON.parse(_DonVi.toString()).length;


    let queryChucVu = {
      'selector': { 'ChucVu': ChucVu, 'docType': 'QuanNhan' }
    }
    let _ChucVu;
    let countChucVu;


    _ChucVu = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryChucVu));
    countChucVu = JSON.parse(_ChucVu.toString()).length;


    let queryCapBac = {
      'selector': { 'CapBac': CapBac, 'docType': 'QuanNhan' }
    }
    let _CapBac;
    let countCapBac;


    _CapBac = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryCapBac));
    countCapBac = JSON.parse(_CapBac.toString()).length;


    let queryTrinhDoNgoaiNgu = {
      'selector': { 'TrinhDoNgoaiNgu': TrinhDoNgoaiNgu, 'docType': 'QuanNhan' }
    }
    let _TrinhDoNgoaiNgu //= await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryTrinhDoNgoaiNgu));
    let countTrinhDoNgoaiNgu //= JSON.parse(_TrinhDoNgoaiNgu.toString()).length;


    _TrinhDoNgoaiNgu = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryTrinhDoNgoaiNgu));
    countTrinhDoNgoaiNgu = JSON.parse(_TrinhDoNgoaiNgu.toString()).length;


    let queryKhuVucDiaLy = {};
    if (KhuVucDiaLy == 'TP Hà Nội') {
      queryKhuVucDiaLy = {
        'selector': {
          'ThuongTru': KhuVucDiaLy, 'docType': 'QuanNhan'
        }
      }
    }
    else if (KhuVucDiaLy != 'TP Hà Nội' && KhuVucDiaLy != '') {
      queryKhuVucDiaLy = {
        'selector': {
          '$not': {
            'ThuongTru': 'TP Hà Nội'
          },
          'docType': 'QuanNhan'
        }
      }
    }
    let _KhuVucDiaLy //= await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryKhuVucDiaLy));
    let countKhuVucDiaLy //= JSON.parse(_KhuVucDiaLy.toString()).length;
    console.log('kvdl', queryKhuVucDiaLy);

    _KhuVucDiaLy = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryKhuVucDiaLy));
    countKhuVucDiaLy = JSON.parse(_KhuVucDiaLy.toString()).length;
    // console.log('khuVucDiaLy', JSON.parse(_KhuVucDiaLy.toString()));

    let queryCoSoDaoTao;
    if (CoSoDaoTao == 'TP Hà Nội' && CoSoDaoTao != 'TP Hà Nội') {
      queryCoSoDaoTao = {
        'selector': {
          'CoSoDaoTao': CoSoDaoTao, 'docType': 'QuanNhan'
        }
      }
    }
    else if (CoSoDaoTao != 'TP Hà Nội') {
      queryCoSoDaoTao = {
        'selector': {
          '$not': {
            'CoSoDaoTao': 'TP Hà Nội'
          },
          'docType': 'QuanNhan'
        }
      }
    }

    let _CoSoDaoTao //= await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryCoSoDaoTao));
    let countCoSoDaoTao //= JSON.parse(_CoSoDaoTao.toString()).length;


    _CoSoDaoTao = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryCoSoDaoTao));
    countCoSoDaoTao = JSON.parse(_CoSoDaoTao.toString()).length;


    let queryChungChiDaoTao = {
      'selector': {
        'ChungChiDaoTao': ChungChiDaoTao, 'docType': 'QuanNhan'
      }
    }
    let _ChungChiDaoTao // = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryChungChiDaoTao));
    let countChungChiDaoTao // = JSON.parse(_ChungChiDaoTao.toString()).length;

    _ChungChiDaoTao = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryChungChiDaoTao));
    countChungChiDaoTao = JSON.parse(_ChungChiDaoTao.toString()).length;


    let queryTrinhDoCMKT = {
      'selector': {
        'TrinhDoCMKT': TrinhDoCMKT, 'docType': 'QuanNhan'
      }
    }
    let _TrinhDoCMKT // =  await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryTrinhDoCMKT));
    let countTrinhDoCMKT // =  JSON.parse(_TrinhDoCMKT.toString()).length;


    _TrinhDoCMKT = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryTrinhDoCMKT));
    countTrinhDoCMKT = JSON.parse(_TrinhDoCMKT.toString()).length;


    let queryLoaiHinhDaoTao = {
      'selector': {
        'LoaiHinhDaoTao': LoaiHinhDaoTao, 'docType': 'QuanNhan'
      }
    }

    let _LoaiHinhDaoTao // = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryLoaiHinhDaoTao));
    let countLoaiHinhDaoTao // = JSON.parse(_LoaiHinhDaoTao.toString()).length;


    _LoaiHinhDaoTao = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryLoaiHinhDaoTao));
    countLoaiHinhDaoTao = JSON.parse(_LoaiHinhDaoTao.toString()).length;


    let querySoNamNhapNgu = {};
    let _SoNamNhapNgu // = await contract_.evaluateTransaction('queryCustom', JSON.stringify(querySoNamNhapNgu));
    let countSoNamNhapNgu // = await JSON.parse(_SoNamNhapNgu).length;

    if (query.SoNamNhapNgu != undefined && query.SoNamNhapNgu != '') {
      console.log('soNamNhapNgu', SoNamNhapNgu)
      if (SoNamNhapNgu == '0-5') {
        querySoNamNhapNgu = {
          'selector': {
            '$and': [
              {
                'NgayNhapNgu': { '$lt': backInTime.backInTime(0) }
              },
              {
                'NgayNhapNgu': { '$gte': backInTime.backInTime(5) }
              }
            ]
          }
        }
      }
      else if (SoNamNhapNgu == '5-10') {
        querySoNamNhapNgu = {
          'selector': {
            '$and': [
              {
                'NgayNhapNgu': { '$lt': backInTime.backInTime(5) }
              },
              {
                'NgayNhapNgu': { '$gte': backInTime.backInTime(10) }
              }
            ]
          }
        }
      }
      else if (SoNamNhapNgu == '10-15') {
        querySoNamNhapNgu = {
          'selector': {
            '$and': [
              {
                'NgayNhapNgu': { '$lt': backInTime.backInTime(10) }
              },
              {
                'NgayNhapNgu': { '$gte': backInTime.backInTime(15) }
              }
            ]
          }
        }
      }
      else if (SoNamNhapNgu == '15-20') {
        querySoNamNhapNgu = {
          'selector': {
            '$and': [
              {
                'NgayNhapNgu': { '$lt': backInTime.backInTime(15) }
              },
              {
                'NgayNhapNgu': { '$gte': backInTime.backInTime(20) }
              }
            ]
          }
        }
      }
      else if (SoNamNhapNgu == '20-25') {
        querySoNamNhapNgu = {
          'selector': {
            '$and': [
              {
                'NgayNhapNgu': { '$lt': backInTime.backInTime(20) }
              },
              {
                'NgayNhapNgu': { '$gte': backInTime.backInTime(25) }
              }
            ]
          }
        }
      }
      else if (SoNamNhapNgu == '25') {
        querySoNamNhapNgu = {
          'selector': {
            'NgayNhapNgu': { '$lt': backInTime.backInTime(25) }
          }
        }
      }
      // querySoNamNhapNgu.selector.docType = 'QuanNhan';
      _SoNamNhapNgu = await contract_.evaluateTransaction('queryCustom', JSON.stringify(querySoNamNhapNgu));
      countSoNamNhapNgu = await JSON.parse(_SoNamNhapNgu).length;

    }
    else if (query.SoNamNhapNgu == undefined) {
      console.log('snnn');
    }

    let querySoTuoi = {};

    let _SoTuoi // = await contract_.evaluateTransaction('queryCustom', JSON.stringify(querySoTuoi));
    let countSoTuoi // = JSON.parse(_SoTuoi.toString()).length;

    if (query.SoTuoi != undefined && query.SoTuoi != '') {
      console.log('sotuoi', SoTuoi);
      if (SoTuoi == '30') {
        querySoTuoi = {
          'selector': {
            'NgaySinh': { '$gte': backInTime.backInTime(30) }
          }
        }
      }
      else if (SoTuoi == '30-35') {
        querySoTuoi = {
          'selector': {
            '$and': [
              {
                'NgaySinh': { '$lt': backInTime.backInTime(30) }
              },
              {
                'NgaySinh': { '$gte': backInTime.backInTime(35) }
              }
            ]
          }
        }
      }
      else if (SoTuoi == '35-40') {
        querySoTuoi = {
          'selector': {
            '$and': [
              {
                'NgaySinh': { '$lt': backInTime.backInTime(35) }
              },
              {
                'NgaySinh': { '$gte': backInTime.backInTime(40) }
              }
            ]
          }
        }
      }
      else if (SoTuoi == '40-45') {
        querySoTuoi = {
          'selector': {
            '$and': [
              {
                'NgaySinh': { '$lt': backInTime.backInTime(40) }
              },
              {
                'NgaySinh': { '$gte': backInTime.backInTime(45) }
              }
            ]
          }
        }
      }
      else if (SoTuoi == '45-50') {
        querySoTuoi = {
          'selector': {
            '$and': [
              {
                'NgaySinh': { '$lt': backInTime.backInTime(45) }
              },
              {
                'NgaySinh': { '$gte': backInTime.backInTime(50) }
              }
            ]
          }
        }
      }
      else if (SoTuoi == '50-55') {
        querySoTuoi = {
          'selector': {
            '$and': [
              {
                'NgaySinh': { '$lt': backInTime.backInTime(50) }
              },
              {
                'NgaySinh': { '$gte': backInTime.backInTime(55) }
              }
            ]
          }
        }
      }
      else if (SoTuoi == '55-60') {
        querySoTuoi = {
          'selector': {
            '$and': [
              {
                'NgaySinh': { '$lt': backInTime.backInTime(55) }
              },
              {
                'NgaySinh': { '$gte': backInTime.backInTime(60) }
              }
            ]
          }
        }
      }
      // querySoTuoi.selector.docType = 'QuanNhan';
      _SoTuoi = await contract_.evaluateTransaction('queryCustom', JSON.stringify(querySoTuoi));
      countSoTuoi = JSON.parse(_SoTuoi.toString()).length;
    }
    else if (query.SoTuoi == undefined) {
      console.log('st')
    }

    let queryTotal = await contract_.evaluateTransaction('queryCustom', JSON.stringify({ 'selector': { 'docType': 'QuanNhan' } }));
    let countTotal = await JSON.parse(queryTotal.toString()).length;
    let finalResult = {
      countSoNamNhapNgu,
      countLoaiHinhDaoTao,
      countChungChiDaoTao,
      countCapBac,
      countChucVu,
      countCoSoDaoTao,
      countDonVi,
      countSoTuoi,
      countKhuVucDiaLy,
      countTrinhDoNgoaiNgu,
      countTrinhDoCMKT,
      countTotal
    }

    res.status(200).send({ 'statusCode': res.statusCode, 'message': finalResult })

  }
  catch (error) {
    console.log(error);
    res.status(400).send({ 'message': error });
  }
})
router.post('/updateOfficerProfile', async function (req, res, next) {
  try {
    const contract_ = await contract();
    let user_id = req.body.user_id;
    let HoVaTen = req.body.HoVaTen;
    let HoVaTenKhaiSinh = req.body.HoVaTenKhaiSinh;
    let NgaySinh = req.body.NgaySinh;
    let DanToc = req.body.DanToc;
    let BiDanh = req.body.BiDanh;
    let TonGiao = req.body.TonGiao;
    let TenKhac = req.body.TenKhac;
    let NgayNhapNgu = req.body.NgayNhapNgu;
    let SoHieuQuanNhan = req.body.SoHieuQuanNhan;
    let NgayXuatNgu = req.body.NgayXuatNgu;
    let SoCMND = req.body.SoCMND;
    let NgayTaiNgu = req.body.NgayTaiNgu;
    let GioiTinh = req.body.GioiTinh;
    let NguyenQuan = req.body.NguyenQuan;
    let CapBac = req.body.CapBac;
    let NgayNhanCapBac = req.body.NgayNhanCapBac;
    let ThuongTru = req.body.ThuongTru;
    let ChucVu = req.body.ChucVu;
    let NgayNhanChucVu = req.body.NgayNhanChucVu;
    let TPGiaDinh = req.body.TPGiaDinh;
    let TPBanThan = req.body.TPBanThan;
    let NgayVaoDang = req.body.NgayVaoDang;
    let NoiVaoDang = req.body.NoiVaoDang;
    let NgayVaoDangChinhThuc = req.body.NgayVaoDangChinhThuc;
    let NgayVaoDoan = req.body.NgayVaoDoan;
    let ChucVuDoan = req.body.ChucVuDoan;
    let ChucVuDang = req.body.ChucVuDang;
    let TrinhDoVanHoa = req.body.TrinhDoVanHoa;
    let TrinhDoQuanLy = req.body.TrinhDoQuanLy;
    let HocHam = req.body.HocHam;
    let TrinhDoLyLuanChinhTri = req.body.TrinhDoLyLuanChinhTri;
    let HocVi = req.body.HocVi;
    let TrinhDoCMKT = req.body.TrinhDoCMKT;
    let IDNguoiUpdate = req.body.IDNguoiUpdate;
    let updateTime = Date.now().toString();

    const blockChainRep = await contract_.submitTransaction('updateOfficerProfile',
      user_id, HoVaTen, HoVaTenKhaiSinh, NgaySinh, DanToc, BiDanh, TonGiao, TenKhac, NgayNhapNgu,
      SoHieuQuanNhan, NgayXuatNgu, SoCMND, NgayTaiNgu, GioiTinh, NguyenQuan, CapBac, NgayNhanCapBac,
      ThuongTru, ChucVu, NgayNhanChucVu, TPGiaDinh, TPBanThan, NgayVaoDang, NoiVaoDang, NgayVaoDangChinhThuc, NgayVaoDoan,
      ChucVuDoan, ChucVuDang, TrinhDoVanHoa, TrinhDoQuanLy, HocHam, TrinhDoLyLuanChinhTri, HocVi, TrinhDoCMKT, IDNguoiUpdate,
      updateTime)
    let responseBlock = JSON.parse(blockChainRep.toString());
    console.log(responseBlock);
    if (responseBlock.message == 'ok') {
      res.status(200).send({ 'statusCode': res.statusCode, 'message': 'ok' });
    }
    else {
      res.status(200).send({ 'statusCode': res.statusCode, 'message': 'ng' });
    }
  }
  catch (error) {
    console.log(error);
    res.status(400).send({ 'statusCode': res.statusCode, 'message': error });
  }
})

router.post('/getOfficerProfileByID', async function (req, res, next) {
  try {
    const contract_ = await contract();
    const queryString = {
      "selector": {
        'SoHieuQuanNhan': req.body.SoHieuQuanNhan,
        'docType': 'QuanNhan'
      }
    }
    const thongTinQuanNhan = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
    res.status(200).send({ 'statusCode': res.statusCode, 'message': JSON.parse(thongTinQuanNhan.toString()) })
  }
  catch (error) {
    res.status(400).send({ 'statusCode': res.statusCode, 'message': error });
  }
})


router.post('/getOfficerUpdateHistoryByID', async function (req, res, next) {
  try {
    const contract_ = await contract();
    const queryString = {
      "selector": {
        'SoHieuQuanNhan': req.body.SoHieuQuanNhan,
        'docType': 'updateHistory'
      }
    }
    const lichSuthongTinQuanNhan = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
    res.status(200).send({ 'statusCode': res.statusCode, 'message': JSON.parse(lichSuthongTinQuanNhan.toString()) });
  }
  catch (error) {
    res.status(400).send({ 'statusCode': res.statusCode, 'message': error });
  }
})

router.post('/getOfficerProfileByUserID', async function (req, res, next) {
  try {
    const contract_ = await contract();
    const queryString = {
      "selector": {
        'user_id': req.body.user_id,
        'docType': 'QuanNhan'
      }
    }
    const thongTinQuanNhan = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
    res.status(200).send({ 'statusCode': res.statusCode, 'message': JSON.parse(thongTinQuanNhan.toString()) })
  }
  catch (error) {
    res.status(400).send({ 'statusCode': res.statusCode, 'message': error });
  }
})

router.post('/getOfficerUpdateHistoryByUserID', async function (req, res, next) {
  try {
    const contract_ = await contract();
    const queryString = {
      "selector": {
        'user_id': req.body.user_id,
        'docType': 'updateHistory'
      }
    }
    const lichSuthongTinQuanNhan = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
    res.status(200).send({ 'statusCode': res.statusCode, 'message': JSON.parse(lichSuthongTinQuanNhan.toString()) });
  }
  catch (error) {
    res.status(400).send({ 'statusCode': res.statusCode, 'message': error });
  }
})

router.post('/blockchain-verify', async function (req, res, next) {
  try {
    let body = req.body;
    if (!body.user_id) {
      res.status(400).send({ 'statusCode': res.statusCode, 'message': 'user_id or SoHieuQuanNhan unavailable' });
      next();
    }
    const contract_ = await contract();

    const queryString = {
      "selector": {
        'user_id': body.user_id,
      }
    }
    // const thongTinQuanNhan = await contract_.evaluateTransaction('queryUser', body.user_id);
    const thongTinQuanNhan = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
    let beforeVerify = await JSON.parse(thongTinQuanNhan.toString())[0].Record;
    let key = body.user_id;
    let afterResult = await contract_.submitTransaction('verifyMessBlockchain', key, new Date().getTime());
    let afterVerify = await JSON.parse(afterResult.toString());
    let ObjA = beforeVerify;
    let ObjB = afterVerify;
    let diff = await validateInput.verifyBlockchainData(ObjA, ObjB);
    res.status(200).send({ 'statusCode': res.statusCode, 'message': diff });

  }
  catch (error) {
    res.status(400).send({ 'statusCode': res.statusCode, 'message': error });
  }
})

module.exports = router;
