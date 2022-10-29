const { json } = require('express');
var express = require('express');
var router = express.Router();
var blockChain = require('../utils/blockchain')

/* GET home page. */

async function contract(){
  const contract = await blockChain.contract();
  return contract;
}
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/saveOfficerProfile', async function(req, res, next){
  try
  {
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

    const contract_ = await contract();
    const blockChainRep = await contract_.submitTransaction('saveOfficerProfile', 
        HoVaTen, HoVaTenKhaiSinh, NgaySinh, DanToc, BiDanh, TonGiao, TenKhac, NgayNhapNgu,
        SoHieuQuanNhan, NgayXuatNgu, SoCMND, NgayTaiNgu, GioiTinh, NguyenQuan, CapBac, NgayNhanCapBac,
        ThuongTru, ChucVu, NgayNhanChucVu, TPGiaDinh, TPBanThan, NgayVaoDang, NoiVaoDang, NgayVaoDangChinhThuc, NgayVaoDoan,
        ChucVuDoan, ChucVuDang, TrinhDoVanHoa, TrinhDoQuanLy,  HocHam, TrinhDoLyLuanChinhTri, HocVi, TrinhDoCMKT, IDNguoiUpdate)
    
    res.sendStatus(200).json({'message': 'ok'});
  }
  catch(error)
  {
    console.log(error);
    res.send(error);
  }
})
router.post('/updateOfficerProfile', async function(req, res, next){
  try
  {
    const contract_ = await contract();
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

    const blockChainRep = await contract_.submitTransaction('updateOfficerProfile', 
    HoVaTen, HoVaTenKhaiSinh, NgaySinh, DanToc, BiDanh, TonGiao, TenKhac, NgayNhapNgu,
    SoHieuQuanNhan, NgayXuatNgu, SoCMND, NgayTaiNgu, GioiTinh, NguyenQuan, CapBac, NgayNhanCapBac,
    ThuongTru, ChucVu, NgayNhanChucVu, TPGiaDinh, TPBanThan, NgayVaoDang, NoiVaoDang, NgayVaoDangChinhThuc, NgayVaoDoan,
    ChucVuDoan, ChucVuDang, TrinhDoVanHoa, TrinhDoQuanLy,  HocHam, TrinhDoLyLuanChinhTri, HocVi, TrinhDoCMKT, IDNguoiUpdate)
    res.sendStatus(200).json({'message': 'ok'});
  }
  catch(error){
    console.log(error);
    res.send(error);
  }
})

router.post('/getOfficerProfileByID', async function(req, res, next){
  try
  {
    const contract_ = await contract();
    const queryString = {
      "selector":{
        'SoHieuQuanNhan': req.body.SoHieuQuanNhan,
        'docType': 'QuanNhan'
      }
    }
    const thongTinQuanNhan = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
    res.sendStatus(200).json({'message': thongTinQuanNhan.toString()});
  }
  catch(error){
    return error
  }
})

router.post('/getOfficerUpdateHistoryByID', async function(req, res, next){
  try
  {
    const contract_ = await contract();
    const queryString = {
      "selector":{
        'SoHieuQuanNhan': req.body.SoHieuQuanNhan,
        'docType': 'lichSuCapNhatQuanNhan'
      }
    }
    const lichSuthongTinQuanNhan = await contract_.evaluateTransaction('queryCustom', JSON.stringify(queryString));
    res.sendStatus(200).json({'message': lichSuthongTinQuanNhan.toString()});
  }
  catch(error)
  {
    res.send(error)
  }
})

module.exports = router;
