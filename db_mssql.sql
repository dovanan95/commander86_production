create database httcddh2018_86_130
go
create table DoIT_CanBo 
(
    Id INT NOT NULL PRIMARY KEY,
    Id_DNN INT,
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    TenDayDu NVARCHAR(250),
    TenDangNhap NVARCHAR(100),
    MatKhau NVARCHAR(255),
    Mobile NVARCHAR(50),
    Phone NVARCHAR(50),
    Id_DonVi UNIQUEIDENTIFIER,
    Id_ChucVu INT,
    Id_CapBac INT
)
go
CREATE TABLE DoIT_DMCapBac 
(
    Id int not NULL,
    Title NVARCHAR(255),

)
GO
CREATE TABLE DoIT_DMChucVu
(
    Id INT not NULL,
    Title NVARCHAR(255),
    Id_old int

)
GO
CREATE TABLE DoIT_DMDonVi
(
    Id UNIQUEIDENTIFIER,
    MaDV NCHAR(50),
    ParentId UNIQUEIDENTIFIER,
    TenDonVi NVARCHAR(255)
)
