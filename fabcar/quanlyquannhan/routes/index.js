const { json } = require('express');
var express = require('express');
var router = express.Router();
var blockChain = require('../utils/blockchain')
var validateInput = require('../utils/validateRequest');
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
    let CapToChucDaoTao = req.body.CapToChucDaoTao;
    let CoSoDaoTao = req.body.CoSoDaoTao;
    let ChungChiDaoTao = req.body.ChungChiDaoTao;
    let NoiDungDaoTao = req.body.NoiDungDaoTao;
    let SucKhoe = req.body.SucKhoe;
    let BacLuong = req.body.BacLuong;
    let NhomMau = req.body.NhomMau;
    let HeSoLuong = req.body.HeSoLuong;
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
    let HoTen = query.HoTen;
    let NganhNgheDaoTao = query.NganhNgheDaoTao;
    let NguyenQuan = query.NguyenQuan;
    let queryParam = { DonVi, HoTen, NganhNgheDaoTao, NguyenQuan };
    for (let param in queryParam) {
      if (queryParam[param] == undefined) {
        delete queryParam[param]
      }
    }
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
