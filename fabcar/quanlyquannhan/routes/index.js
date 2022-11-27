const { json } = require('express');
var express = require('express');
var router = express.Router();
var blockChain = require('../utils/blockchain')
var validateInput = require('../utils/validateRequest');
var backInTime = require('../utils/backInTime');
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
  /*
    "CapToChucDaoTao":"ABCD",
    "CoSoDaoTao":"ABCD",
    "ChungChiDaoTao":"ABCD",
    "NoiDungDaoTao":"ABCD",
    "SucKhoe":"Loai 1",
    "BacLuong":"ABCCD",
    "NhomMau":"A",
    "HeSoLuong":"4,6",
    "SoBHXH":"ABCCD",
    "TinhTrangHonNhan":"ABCCD",
    "NganhQuanLy":"ABCCD"*/
  try {
    let user_id = req.body.user_id;
    let HoVaTen = req.body.HoVaTen;
    let HoVaTenKhaiSinh = req.body.HoVaTenKhaiSinh;
    let NgaySinh = parseInt(req.body.NgaySinh);
    let DanToc = req.body.DanToc;
    let BiDanh = req.body.BiDanh;
    let TonGiao = req.body.TonGiao;
    let TenKhac = req.body.TenKhac;
    let NgayNhapNgu = parseInt(req.body.NgayNhapNgu);
    let SoHieuQuanNhan = req.body.SoHieuQuanNhan;
    let NgayXuatNgu = parseInt(req.body.NgayXuatNgu);
    let SoCMND = req.body.SoCMND;
    let NgayTaiNgu = parseInt(req.body.NgayTaiNgu);
    let GioiTinh = req.body.GioiTinh;
    let NguyenQuan = req.body.NguyenQuan;
    let CapBac = req.body.CapBac;
    let NgayNhanCapBac = parseInt(req.body.NgayNhanCapBac);
    let ThuongTru = req.body.ThuongTru;
    let ChucVu = req.body.ChucVu;
    let NgayNhanChucVu = parseInt(req.body.NgayNhanChucVu);
    let TPGiaDinh = req.body.TPGiaDinh;
    let TPBanThan = req.body.TPBanThan;
    let NgayVaoDang = parseInt(req.body.NgayVaoDang);
    let NoiVaoDang = req.body.NoiVaoDang;
    let NgayVaoDangChinhThuc = parseInt(req.body.NgayVaoDangChinhThuc);
    let NgayVaoDoan = parseInt(req.body.NgayVaoDoan);
    let ChucVuDoan = req.body.ChucVuDoan;
    let ChucVuDang = req.body.ChucVuDang;
    let TrinhDoVanHoa = req.body.TrinhDoVanHoa;
    let TrinhDoQuanLy = req.body.TrinhDoQuanLy;
    let HocHam = req.body.HocHam;
    let TrinhDoLyLuanChinhTri = req.body.TrinhDoLyLuanChinhTri;
    let HocVi = req.body.HocVi;
    let TrinhDoCMKT = req.body.TrinhDoCMKT;
    let IDNguoiUpdate = req.body.IDNguoiUpdate;
    let updateTime = parseInt(Date.now());
    let CapToChucDaoTao = req.body.CapToChucDaoTao;
    let CoSoDaoTao = req.body.CoSoDaoTao;
    let ChungChiDaoTao = req.body.ChungChiDaoTao;
    let NoiDungDaoTao = req.body.NoiDungDaoTao;
    let SucKhoe = req.body.SucKhoe;
    let BacLuong = req.body.BacLuong;
    let NhomMau = req.body.NhomMau;
    let HeSoLuong = parseInt(req.body.HeSoLuong);
    let SoBHXH = req.body.SoBHXH;
    let TinhTrangHonNhan = req.body.TinhTrangHonNhan;
    let NganhQuanLy = req.body.NganhQuanLy;
    let DonVi = req.body.DonVi;
    let NganhNgheDaoTao = req.body.NganhNgheDaoTao;
    let LoaiHinhDaoTao = req.body.LoaiHinhDaoTao;
    let TrinhDoNgoaiNgu = req.body.TrinhDoNgoaiNgu

    let missItem = await validateInput.saveOfficerProfileValidation(req);
    if (missItem.length > 0) {
      res.status(200).send({ 'statusCode': res.statusCode, 'miss Item': missItem });
      next();
    }
    const contract_ = await contract();

    const queryString = {
      "selector": {
        'SoHieuQuanNhan': req.body.SoHieuQuanNhan,
        'docType': 'QuanNhan'
      }
    }

    const thongTinQuanNhan = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
    console.log('TTQN', thongTinQuanNhan.toString());

    let blockChainRep;
    console.log('b');
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
    }


    console.log('blockChainRep', JSON.parse(blockChainRep.toString()))
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
    let DonVi = query.DonVi;
    let HoVaTen = query.HoVaTen;
    let NganhNgheDaoTao = query.NganhNgheDaoTao;
    let NguyenQuan = query.NguyenQuan;
    let queryParam = { DonVi, HoVaTen, NganhNgheDaoTao, NguyenQuan };
    for (let param in queryParam) {
      if (queryParam[param] == undefined || queryParam[param] == '""') {
        delete queryParam[param]
      }
      else if (queryParam[param] != undefined) {
        queryParam[param] = decodeURIComponent(queryParam[param])
      }
    }
    queryParam.docType = "QuanNhan";
    let queryString = {
      "selector": queryParam
    }
    console.log('queryString', queryString)
    const thongTinQuanNhan = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
    //let result = JSON.parse(thongTinQuanNhan.toString());
    res.status(200).send({ 'statusCode': res.statusCode, 'message': JSON.parse(thongTinQuanNhan.toString()) })
  }
  catch (error) {
    console.log(error);
    res.status(400).send({ 'message': error });
  }
});

router.get('/thongke', async function (req, res, next) {
  try {

    const contract_ = await contract();
    let query = req.query;
    let DonVi = decodeURIComponent(query.DonVi);
    let ChucVu = decodeURIComponent(query.ChucVu);
    let CapBac = decodeURIComponent(query.CapBac);
    let TrinhDoNgoaiNgu = decodeURIComponent(query.TrinhDoNgoaiNgu);

    let KhuVucDiaLy = decodeURIComponent(query.KhuVucDiaLy);
    let ChungChiDaoTao = decodeURIComponent(query.ChungChiDaoTao);
    let TrinhDoCMKT = decodeURIComponent(query.TrinhDoCMKT);
    let LoaiHinhDaoTao = decodeURIComponent(query.LoaiHinhDaoTao);
    let CoSoDaoTao = decodeURIComponent(query.CoSoDaoTao);

    let SoNamNhapNgu = decodeURIComponent(query.SoNamNhapNgu) || 25;
    let SoTuoi = decodeURIComponent(query.SoTuoi) || 30;

    let queryDonVi = {
      'selector': { 'DonVi': DonVi, 'docType': 'QuanNhan' }
    }
    let _DonVi = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryDonVi));
    let countDonVi = JSON.parse(_DonVi.toString()).length;

    let queryChucVu = {
      'selector': { 'ChucVu': ChucVu, 'docType': 'QuanNhan' }
    }
    let _ChucVu = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryChucVu));
    let countChucVu = JSON.parse(_ChucVu.toString()).length;

    let queryCapBac = {
      'selector': { 'CapBac': CapBac, 'docType': 'QuanNhan' }
    }
    let _CapBac = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryCapBac));
    let countCapBac = JSON.parse(_CapBac.toString()).length;

    let queryTrinhDoNgoaiNgu = {
      'selector': { 'TrinhDoNgoaiNgu': TrinhDoNgoaiNgu, 'docType': 'QuanNhan' }
    }
    let _TrinhDoNgoaiNgu = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryTrinhDoNgoaiNgu));
    let countTrinhDoNgoaiNgu = JSON.parse(_TrinhDoNgoaiNgu.toString()).length;

    let queryKhuVucDiaLy = {};
    if (KhuVucDiaLy = 'Hà Nội') {
      queryKhuVucDiaLy = {
        'selector': {
          'ThuongTru': KhuVucDiaLy, 'docType': 'QuanNhan'
        }
      }
    }
    else if (KhuVucDiaLy != 'Hà Nội') {
      queryKhuVucDiaLy = {
        'selector': {
          '$not': {
            'ThuongTru': KhuVucDiaLy
          },
          'docType': 'QuanNhan'
        }
      }
    }
    let _KhuVucDiaLy = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryKhuVucDiaLy));
    let countKhuVucDiaLy = JSON.parse(_KhuVucDiaLy.toString()).length;

    let queryCoSoDaoTao;
    if (CoSoDaoTao == 'Hà Nội') {
      queryCoSoDaoTao = {
        'selector': {
          'CoSoDaoTao': CoSoDaoTao, 'docType': 'QuanNhan'
        }
      }
    }
    else if (CoSoDaoTao != 'Hà Nội') {
      queryCoSoDaoTao = {
        'selector': {
          '$not': {
            'CoSoDaoTao': CoSoDaoTao
          },
          'docType': 'QuanNhan'
        }
      }
    }

    let _CoSoDaoTao = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryCoSoDaoTao));
    let countCoSoDaoTao = JSON.parse(_CoSoDaoTao.toString()).length;

    let queryChungChiDaoTao = {
      'selector': {
        'ChungChiDaoTao': ChungChiDaoTao, 'docType': 'QuanNhan'
      }
    }
    let _ChungChiDaoTao = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryChungChiDaoTao));
    let countChungChiDaoTao = JSON.parse(_ChungChiDaoTao.toString()).length;

    let queryTrinhDoCMKT = {
      'selector': {
        'TrinhDoCMKT': TrinhDoCMKT, 'docType': 'QuanNhan'
      }
    }
    let _TrinhDoCMKT = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryTrinhDoCMKT));
    let countTrinhDoCMKT = JSON.parse(_TrinhDoCMKT.toString()).length;

    let queryLoaiHinhDaoTao = {
      'selector': {
        'LoaiHinhDaoTao': LoaiHinhDaoTao, 'docType': 'QuanNhan'
      }
    }

    let _LoaiHinhDaoTao = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryLoaiHinhDaoTao));
    let countLoaiHinhDaoTao = JSON.parse(_LoaiHinhDaoTao.toString()).length;

    let Today = new Date().getTime();

    let querySoNamNhapNgu = {};
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
    querySoNamNhapNgu.selector.docType = 'QuanNhan';

    let _SoNamNhapNgu = await contract_.evaluateTransaction('queryCustom', JSON.stringify(querySoNamNhapNgu));
    let countSoNamNhapNgu = await JSON.parse(_SoNamNhapNgu).length;

    let querySoTuoi = {};
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
    querySoTuoi.selector.docType = 'QuanNhan';

    let _SoTuoi = await contract_.evaluateTransaction('queryCustom', JSON.stringify(querySoTuoi));
    let countSoTuoi = JSON.parse(_SoTuoi.toString()).length;

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
      countTrinhDoCMKT
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

module.exports = router;
