const _ = require("lodash");
const uns = require("underscore");


async function saveOfficerProfileValidation(req) {
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
    let IDNguoiUpdate = req.body.IDNguoiUpdate;;
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
    let fullData =
    {
        user_id,
        HoVaTen,
        HoVaTenKhaiSinh,
        NgaySinh,
        DanToc,
        BiDanh,
        TonGiao,
        TenKhac,
        NgayNhapNgu,
        SoHieuQuanNhan,
        NgayXuatNgu,
        SoCMND,
        NgayTaiNgu,
        GioiTinh,
        NguyenQuan,
        CapBac,
        NgayNhanCapBac,
        ThuongTru,
        ChucVu,
        NgayNhanChucVu,
        TPGiaDinh,
        TPBanThan,
        NgayVaoDang,
        NoiVaoDang,
        NgayVaoDangChinhThuc,
        NgayVaoDoan,
        ChucVuDoan,
        ChucVuDang,
        TrinhDoVanHoa,
        TrinhDoQuanLy,
        HocHam,
        TrinhDoLyLuanChinhTri,
        HocVi,
        TrinhDoCMKT,
        IDNguoiUpdate,
        CapToChucDaoTao,
        CoSoDaoTao,
        ChungChiDaoTao,
        NoiDungDaoTao,
        SucKhoe,
        BacLuong,
        NhomMau,
        HeSoLuong,
        SoBHXH,
        TinhTrangHonNhan,
        NganhQuanLy,
        DonVi,
        NganhNgheDaoTao,
        LoaiHinhDaoTao,
        TrinhDoNgoaiNgu
    }
    let missArr = [];
    for (let item in fullData) {
        if (fullData[item] == undefined) {
            missArr.push(item);
        }
    }
    return missArr;
}

async function verifyBlockchainData(ObjA, ObjB) {
    if (ObjA.hasOwnProperty('verify_count')) {
        delete ObjA.verify_count
    }
    if (ObjA.hasOwnProperty('verify_time')) {
        delete ObjA.verify_time
    }
    if (ObjB.hasOwnProperty('verify_count')) {
        delete ObjB.verify_count
    }
    if (ObjB.hasOwnProperty('verify_time')) {
        delete ObjB.verify_time
    }
    console.log('A', ObjA);
    console.log('B', ObjB)
    if (_.isEqual(ObjA, ObjB)) {
        return ({ 'result': true })
    }
    else if (!_.isEqual(ObjA, ObjB)) {
        return ({ 'result': false })
    }
}
module.exports.saveOfficerProfileValidation = saveOfficerProfileValidation;
module.exports.verifyBlockchainData = verifyBlockchainData; 