

CREATE DATABASE [httcddh2018_86_130]
GO
USE [httcddh2018_86_130]
GO
/****** Object:  Table [dbo].[DoIT_CanBo]    Script Date: 24-Mar-22 3:05:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DoIT_CanBo](
	[Id] [int] NOT NULL,
	[Id_DNN] [int] NULL,
	[Number] [int] NULL,
	[FirstName] [nvarchar](50) NULL,
	[LastName] [nvarchar](50) NULL,
	[TenDayDu] [nvarchar](250) NULL,
	[TenDangNhap] [nvarchar](100) NULL,
	[MatKhau] [nvarchar](255) NULL,
	[Email] [nvarchar](50) NULL,
	[MatKhauMail] [nvarchar](50) NULL,
	[TKCongVan] [nvarchar](50) NULL,
	[MatKhauCV] [nvarchar](50) NULL,
	[IdCV] [int] NULL,
	[Mobile] [nvarchar](50) NULL,
	[Phone] [nvarchar](50) NULL,
	[BirthDay] [smalldatetime] NULL,
	[IconName] [nvarchar](400) NULL,
	[IconUrl] [nvarchar](400) NULL,
	[Id_Top] [int] NULL,
	[Id_DonVi] [uniqueidentifier] NULL,
	[iddonvi2] [uniqueidentifier] NULL,
	[Id_ChucVu] [int] NULL,
	[Id_CapBac] [int] NULL,
	[IPAddress] [nvarchar](50) NULL,
	[LastLoginDate] [datetime] NULL,
	[isDelete] [bit] NULL CONSTRAINT [DF_DoIT_CanBo_isDelete_1]  DEFAULT ((0)),
	[Status] [bit] NULL,
	[Id_old] [int] NULL,
	[PublicKey] [nvarchar](400) NULL,
	[PubKey_Status] [int] NULL,
 CONSTRAINT [PK_DoIT_CanBo] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DoIT_DMCapBac]    Script Date: 24-Mar-22 3:05:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DoIT_DMCapBac](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PortalId] [int] NULL,
	[Number] [int] NULL,
	[Title] [nvarchar](255) NULL,
	[Description] [nvarchar](255) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
	[Status] [bit] NULL,
	[Id_old] [int] NULL,
 CONSTRAINT [PK_DoIT_DMCapBac_1] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DoIT_DMChucVu]    Script Date: 24-Mar-22 3:05:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DoIT_DMChucVu](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PortalId] [int] NULL,
	[Number] [int] NULL,
	[Title] [nvarchar](255) NULL,
	[Description] [nvarchar](255) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
	[Status] [bit] NULL,
	[Id_old] [int] NULL,
 CONSTRAINT [PK_DoIT_DMChucVu] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DoIT_DMDonVi]    Script Date: 24-Mar-22 3:05:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DoIT_DMDonVi](
	[Id] [uniqueidentifier] NOT NULL,
	[MaDV] [nchar](50) NULL,
	[ParentId] [uniqueidentifier] NULL,
	[TopUnitId] [uniqueidentifier] NULL,
	[PortalId] [int] NULL,
	[Number] [int] NULL,
	[TenDonVi] [nvarchar](255) NULL,
	[Description] [nvarchar](255) NULL,
	[KyHieu] [nvarchar](15) NULL,
	[iType] [int] NULL,
	[isVanThu] [bit] NULL,
	[LoaiBaoCao] [int] NULL,
	[Icon] [nvarchar](255) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
	[Status] [bit] NULL,
	[Id_old] [uniqueidentifier] NULL,
	[OwnerID_old] [uniqueidentifier] NULL,
 CONSTRAINT [PK_DoIT_DMDonVi] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO




 --insert bang can bo
GO
INSERT [dbo].[DoIT_CanBo] ([Id], [Id_DNN], [Number], [FirstName], [LastName], [TenDayDu], [TenDangNhap], [MatKhau], [Email], [MatKhauMail], [TKCongVan], [MatKhauCV], [IdCV], [Mobile], [Phone], [BirthDay], [IconName], [IconUrl], [Id_Top], [Id_DonVi], [iddonvi2], [Id_ChucVu], [Id_CapBac], [IPAddress], [LastLoginDate], [isDelete], [Status], [Id_old], [PublicKey], [PubKey_Status]) VALUES (777, NULL, 9, NULL, NULL, N'Đinh Thế Cường', N'dinhthecuong', N'IQ5r4iwZQ8adUuoONqVmHc7kdfsC7pJio6seVu3B+bw=', N'', NULL, N'', NULL, NULL, N'0972558724', N'', NULL, N'default.png', N'/images/profile/default.png', NULL, N'76790c65-c224-47ee-87de-e9e207fcf95f', NULL, 37, 2, N'86.64.88.253', CAST(N'2021-06-23 07:36:55.067' AS DateTime), NULL, 1, NULL, N'RUNLNUIAAAAANkOGJopej0ArWPTpW49A2RlCMUZlSc7Ai9TU/l0F5UKZ0rFmBd56jqMQ3pFDxAkPCxUPKxVHlnNJyo3XOD0HoVIBbLfoSS3H9t94m2VlBRn91sqsCcRMe94WyC7lipPMpekcfQ0EadyrUZKS3F7QIm5TzenBMfPXWXL8lw0CNCbjdeI=', 1)
INSERT [dbo].[DoIT_CanBo] ([Id], [Id_DNN], [Number], [FirstName], [LastName], [TenDayDu], [TenDangNhap], [MatKhau], [Email], [MatKhauMail], [TKCongVan], [MatKhauCV], [IdCV], [Mobile], [Phone], [BirthDay], [IconName], [IconUrl], [Id_Top], [Id_DonVi], [iddonvi2], [Id_ChucVu], [Id_CapBac], [IPAddress], [LastLoginDate], [isDelete], [Status], [Id_old], [PublicKey], [PubKey_Status]) VALUES (778, NULL, 12, NULL, NULL, N'Nguyễn Hồng Tuân', N'nguyenhongtuan', N'Q3vLZEUO9Nslwvz7VbK986jzEyI0WSzuG9/SY0SzDXA=', N'', NULL, N'', NULL, NULL, N'0961108721', N'', CAST(N'1997-04-01 00:00:00' AS SmallDateTime), N'default.png', N'/images/profile/default.png', NULL, N'b667ce9b-68a9-4f0a-ad9e-7deb1c9e42d1', NULL, 37, 7, N'86.128.28.253', CAST(N'2021-06-23 07:26:44.150' AS DateTime), NULL, 1, NULL, N'RUNLNUIAAAABQ4GFyMwLBC4bJbDfta3MIHc3uB+tx4fxQ4w/OZUsu2W7GvM/QfQanYkeUrfZtPBH/09AFoo6Kb/D3w/bWvWmvv0Aln6MiLV+lwmIQJDjI3ZH+gMV3vBfErSpqCrOX1gm/mS5KhZycAqFzRIhjm3Ov/YxTrA9jQWLwUmkVT3HOo7F9bk=', 1)
INSERT [dbo].[DoIT_CanBo] ([Id], [Id_DNN], [Number], [FirstName], [LastName], [TenDayDu], [TenDangNhap], [MatKhau], [Email], [MatKhauMail], [TKCongVan], [MatKhauCV], [IdCV], [Mobile], [Phone], [BirthDay], [IconName], [IconUrl], [Id_Top], [Id_DonVi], [iddonvi2], [Id_ChucVu], [Id_CapBac], [IPAddress], [LastLoginDate], [isDelete], [Status], [Id_old], [PublicKey], [PubKey_Status]) VALUES (779, NULL, 13, NULL, NULL, N'Phạm Hải An', N'phamhaian', N'JfsRq/eXMlzGIGUbhwaKNFtAcnA2pcJCft6fiM562eM=', N'', NULL, N'', NULL, NULL, N'0908139202', N'', CAST(N'1997-12-27 00:00:00' AS SmallDateTime), N'default.png', N'/images/profile/default.png', NULL, N'b667ce9b-68a9-4f0a-ad9e-7deb1c9e42d1', NULL, 37, 2, N'86.128.28.253', CAST(N'2021-06-23 07:22:47.007' AS DateTime), NULL, 1, NULL, N'RUNLNUIAAAABpeRoL5pvkoVWjryzksS6rIU+BGi9t6aegG4lYEb3xySZu9IlQO+Ox724QAB6YMKKMcj5xSALTkYyKwbd2p8MGvQAJzqOXFOteQZ2hRwVLQWiWoe5JR2uZQbTP2WdxpkIj20mSsFMyicHJoWyJ34OsUtcHXD5TNrNugvW5702POkcqcc=', 1)
INSERT [dbo].[DoIT_CanBo] ([Id], [Id_DNN], [Number], [FirstName], [LastName], [TenDayDu], [TenDangNhap], [MatKhau], [Email], [MatKhauMail], [TKCongVan], [MatKhauCV], [IdCV], [Mobile], [Phone], [BirthDay], [IconName], [IconUrl], [Id_Top], [Id_DonVi], [iddonvi2], [Id_ChucVu], [Id_CapBac], [IPAddress], [LastLoginDate], [isDelete], [Status], [Id_old], [PublicKey], [PubKey_Status]) VALUES (780, NULL, 14, NULL, NULL, N'Nguyễn Văn Hải', N'hainv', N'BI0OFcix9xMBMUKyByanwg==', N'', NULL, N'', NULL, NULL, N'0967120696', N'', NULL, N'default.png', N'/images/profile/default.png', NULL, N'be2c90fe-104d-44d0-beed-d3193dbb2e0e', NULL, 36, 2, N'86.128.28.253', CAST(N'2021-06-17 13:39:36.970' AS DateTime), NULL, 1, NULL, N'RUNLNUIAAAABCp3H2lucAEkyGAAvy/c6aTnJzWwkpPfaCKo1RnDHkZsEa8l8I98piOnRYhPkSMO/UggNGs1hESezEzqPvLZ6Rd0BuUu0ceo2tj3bGwxlZ/0gzB5H4a2AXLgGNLsa5B8D59TA8SPKmr4vBlITPwC+SiCc7VlRrw9o52x4TwOKeT2fMZI=', 1)
INSERT [dbo].[DoIT_CanBo] ([Id], [Id_DNN], [Number], [FirstName], [LastName], [TenDayDu], [TenDangNhap], [MatKhau], [Email], [MatKhauMail], [TKCongVan], [MatKhauCV], [IdCV], [Mobile], [Phone], [BirthDay], [IconName], [IconUrl], [Id_Top], [Id_DonVi], [iddonvi2], [Id_ChucVu], [Id_CapBac], [IPAddress], [LastLoginDate], [isDelete], [Status], [Id_old], [PublicKey], [PubKey_Status]) VALUES (781, NULL, 8, NULL, NULL, N'Nguyễn Tiến Giang', N'nguyentiengiang', N'SsNvkBRXhILENsJQ76LzQrTm+Vv4felej3lg3htEAI0=', N'', NULL, N'', NULL, NULL, N'0943472729', N'', NULL, N'default.png', N'/images/profile/default.png', NULL, N'447d1904-84f7-4e70-a932-9425131b597b', NULL, 36, 7, N'86.128.28.253', CAST(N'2021-06-22 15:06:15.863' AS DateTime), NULL, 1, NULL, N'RUNLNUIAAAAAnQ4l8B69FRevIOWruh2OTLCqmjjclFQ1yN5Yh8/CFGNsjohzB/hPpe9hQn6nV/dSPh33ZRLB/I01gfpPd6+LWuUA0fIvPK19lHnEf9QXyYeXYx1+ypsXn4ts6pZCRnUylmDi7z3F1MAH6HDkpDRCQJ4HdJ1X1LucnY+zXVb0VywrfD8=', 1)
INSERT [dbo].[DoIT_CanBo] ([Id], [Id_DNN], [Number], [FirstName], [LastName], [TenDayDu], [TenDangNhap], [MatKhau], [Email], [MatKhauMail], [TKCongVan], [MatKhauCV], [IdCV], [Mobile], [Phone], [BirthDay], [IconName], [IconUrl], [Id_Top], [Id_DonVi], [iddonvi2], [Id_ChucVu], [Id_CapBac], [IPAddress], [LastLoginDate], [isDelete], [Status], [Id_old], [PublicKey], [PubKey_Status]) VALUES (782, NULL, 698, NULL, NULL, N'Nguyễn Hữu Kim', N'nguyenhuukim', N'w4LkjGK9qutRixbHIa63hGwq9AF0hVtYxJxtICKxaVo=', N'', NULL, N'', NULL, NULL, N'0386180160', N'', NULL, N'default.png', N'/images/profile/default.png', NULL, N'953825bf-8604-493f-9285-830cfc88bc74', NULL, 44, 7, N'86.0.116.100', CAST(N'2021-06-23 08:27:32.943' AS DateTime), NULL, 1, NULL, N'RUNLNUIAAAABdP5HVy96Z01yYaQ9QoSC7HAd0Ahb35A5/rHIXuDEl89PXbA5zrQwG6yFYxoCeJ+hf5DQJDdZ8DxnVtJPBWhZ9IoA1WPJThqqJ88/DkWViZraujjQFw0nrHa9TQd6cWc0Kb3eemxn0XOvUmehiFNJa/Qcw3h+C0+TgQn6WKbBI/ZbzPM=', 1)
INSERT [dbo].[DoIT_CanBo] ([Id], [Id_DNN], [Number], [FirstName], [LastName], [TenDayDu], [TenDangNhap], [MatKhau], [Email], [MatKhauMail], [TKCongVan], [MatKhauCV], [IdCV], [Mobile], [Phone], [BirthDay], [IconName], [IconUrl], [Id_Top], [Id_DonVi], [iddonvi2], [Id_ChucVu], [Id_CapBac], [IPAddress], [LastLoginDate], [isDelete], [Status], [Id_old], [PublicKey], [PubKey_Status]) VALUES (783, NULL, 699, NULL, NULL, N'Phạm Văn Hưng', N'phamvanhung', N'wWAIfc1GbWCoXARiplwDJA==', N'', NULL, N'', NULL, NULL, N'0942562296', N'', NULL, N'default.png', N'/images/profile/default.png', NULL, N'2542f8db-3338-42d9-9890-0e8a6bea9b41', NULL, 44, 7, N'86.0.116.100', CAST(N'2021-06-21 07:42:02.347' AS DateTime), NULL, 1, NULL, N'RUNLNUIAAAABlUNPa2iwrMUSP512kjH8pFkif2k++/0aHtciIxh140NWP/PvgL9VKOUu/bDERTU7m3k0VKNh2ugD8bPIAJ9PvwwAkXV20HDHBlymMbKMU6qzGfyPy8HB8W2c3BAG1MZLqCdMKwCaozS4DvsijK/+J4IXz57YCKq7PAf4wjY5XL6W2qQ=', 1)
GO
SET IDENTITY_INSERT [dbo].[DoIT_DMChucVu]  OFF
GO

-- insert bang  cap bac
SET IDENTITY_INSERT [dbo].[DoIT_DMCapBac]  ON
GO
INSERT [dbo].[DoIT_DMCapBac] ([Id], [PortalId], [Number], [Title], [Description], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate], [Status], [Id_old]) VALUES (2, NULL, 12, N'Thiếu úy', NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[DoIT_DMCapBac] ([Id], [PortalId], [Number], [Title], [Description], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate], [Status], [Id_old]) VALUES (7, NULL, 11, N'Trung úy', NULL, NULL, NULL, NULL, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[DoIT_DMCapBac]  OFF
GO
-- insert bang chuc vu
SET IDENTITY_INSERT [dbo].[DoIT_DMChucVu]  ON
GO
INSERT [dbo].[DoIT_DMChucVu] ([Id], [PortalId], [Number], [Title], [Description], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate], [Status], [Id_old]) VALUES (81, NULL, 100, N'Chiến đấu viên', N'Thực hiện nhiệm vụ tác chiến', NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[DoIT_DMChucVu] ([Id], [PortalId], [Number], [Title], [Description], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate], [Status], [Id_old]) VALUES (36, NULL, 2000, N'Sĩ quan CNTT', NULL, NULL, NULL, NULL, NULL, NULL, 36)
INSERT [dbo].[DoIT_DMChucVu] ([Id], [PortalId], [Number], [Title], [Description], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate], [Status], [Id_old]) VALUES (37, NULL, 2001, N'Sĩ quan Hành động', NULL, NULL, NULL, NULL, NULL, NULL, 37)
INSERT [dbo].[DoIT_DMChucVu] ([Id], [PortalId], [Number], [Title], [Description], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate], [Status], [Id_old]) VALUES (44, NULL, 1000, N'Trợ lý', NULL, NULL, NULL, NULL, NULL, NULL, 44)
GO
SET IDENTITY_INSERT [dbo].[DoIT_DMChucVu]  OFF
GO
-- insert don vi
INSERT [dbo].[DoIT_DMDonVi] ([Id], [MaDV], [ParentId], [TopUnitId], [PortalId], [Number], [TenDonVi], [Description], [KyHieu], [iType], [isVanThu], [LoaiBaoCao], [Icon], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate], [Status], [Id_old], [OwnerID_old]) VALUES (N'2542f8db-3338-42d9-9890-0e8a6bea9b41', N'CCTS/V11                                          ', N'62e68002-daf7-4ebc-b108-4d097c03f2ab', N'43e36bcd-0b7f-48da-9e04-01d9a454b785', NULL, 6, N'Phòng Công cụ Trinh sát', NULL, N'CCTS/V10       ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, N'2542f8db-3338-42d9-9890-0e8a6bea9b41', N'62e68002-daf7-4ebc-b108-4d097c03f2ab')
GO
INSERT [dbo].[DoIT_DMDonVi] ([Id], [MaDV], [ParentId], [TopUnitId], [PortalId], [Number], [TenDonVi], [Description], [KyHieu], [iType], [isVanThu], [LoaiBaoCao], [Icon], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate], [Status], [Id_old], [OwnerID_old]) VALUES (N'b667ce9b-68a9-4f0a-ad9e-7deb1c9e42d1', N'a1                                                ', N'023b36d2-0617-40ae-ab16-c93b3685da6f', NULL, 1, 9, N'Đội 1', NULL, N'', NULL, 0, NULL, NULL, NULL, NULL, 492, NULL, 1, N'b667ce9b-68a9-4f0a-ad9e-7deb1c9e42d1', N'023b36d2-0617-40ae-ab16-c93b3685da6f')
GO
INSERT [dbo].[DoIT_DMDonVi] ([Id], [MaDV], [ParentId], [TopUnitId], [PortalId], [Number], [TenDonVi], [Description], [KyHieu], [iType], [isVanThu], [LoaiBaoCao], [Icon], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate], [Status], [Id_old], [OwnerID_old]) VALUES (N'953825bf-8604-493f-9285-830cfc88bc74', N'TĐHĐK/V10                                         ', N'62e68002-daf7-4ebc-b108-4d097c03f2ab', N'43e36bcd-0b7f-48da-9e04-01d9a454b785', NULL, 8, N'Phòng Hệ thống Tự động hóa Chỉ huy, Điều khiển', NULL, N'TĐHĐK/V10      ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, N'953825bf-8604-493f-9285-830cfc88bc74', N'62e68002-daf7-4ebc-b108-4d097c03f2ab')
GO
INSERT [dbo].[DoIT_DMDonVi] ([Id], [MaDV], [ParentId], [TopUnitId], [PortalId], [Number], [TenDonVi], [Description], [KyHieu], [iType], [isVanThu], [LoaiBaoCao], [Icon], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate], [Status], [Id_old], [OwnerID_old]) VALUES (N'447d1904-84f7-4e70-a932-9425131b597b', N'c9/d6/Lu2                                         ', N'6c4cca6b-5ea1-4af4-a4f0-59bff17d967e', N'43e36bcd-0b7f-48da-9e04-01d9a454b786', 1, 19, N'Đội 9', NULL, N'c9/d6/Lu2', 2, 0, NULL, NULL, 1, NULL, 492, NULL, 1, N'447d1904-84f7-4e70-a932-9425131b597b', N'6c4cca6b-5ea1-4af4-a4f0-59bff17d967e')
GO
INSERT [dbo].[DoIT_DMDonVi] ([Id], [MaDV], [ParentId], [TopUnitId], [PortalId], [Number], [TenDonVi], [Description], [KyHieu], [iType], [isVanThu], [LoaiBaoCao], [Icon], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate], [Status], [Id_old], [OwnerID_old]) VALUES (N'be2c90fe-104d-44d0-beed-d3193dbb2e0e', N'c10/d6/Lu2                                        ', N'6c4cca6b-5ea1-4af4-a4f0-59bff17d967e', NULL, 1, 18, N'Đội 10', NULL, N'c10/d6/Lu2', 2, 0, NULL, NULL, 492, NULL, 492, NULL, 1, NULL, NULL)
GO
INSERT [dbo].[DoIT_DMDonVi] ([Id], [MaDV], [ParentId], [TopUnitId], [PortalId], [Number], [TenDonVi], [Description], [KyHieu], [iType], [isVanThu], [LoaiBaoCao], [Icon], [CreatedBy], [CreatedDate], [ModifiedBy], [ModifiedDate], [Status], [Id_old], [OwnerID_old]) VALUES (N'76790c65-c224-47ee-87de-e9e207fcf95f', N'c2/d7/Lu3                                         ', N'502bd109-5ec3-49e4-bc2b-03da6b8558a6', NULL, 1, 2, N'Đội 2', NULL, N'c2/d7/Lu3', NULL, 0, NULL, NULL, 493, NULL, NULL, NULL, 1, N'76790c65-c224-47ee-87de-e9e207fcf95f', N'502bd109-5ec3-49e4-bc2b-03da6b8558a6')
GO
