window.AdminPortalMock = {
  admin: {
    name: "Ayesha Fernando",
    initials: "AF",
    role: "Administrator",
    email: "admin@lawsphere.lk",
    notificationCount: 8
  },
  stats: {
    totalClients: 18420,
    totalLawyers: 812,
    pendingLawyerApprovals: 27,
    totalConsultations: 4826,
    completedConsultations: 3184,
    totalPaymentVolume: 18465000,
    platformCommissionRevenue: 1832000,
    pendingLawyerSettlements: 16
  },
  bookingActivity: [
    { month: "Jan", count: 180 },
    { month: "Feb", count: 210 },
    { month: "Mar", count: 230 },
    { month: "Apr", count: 280 },
    { month: "May", count: 260 },
    { month: "Jun", count: 320 },
    { month: "Jul", count: 340 },
    { month: "Aug", count: 290 },
    { month: "Sep", count: 360 },
    { month: "Oct", count: 420 }
  ],
  revenueComparison: {
    consultationVolume: 14920000,
    commissionRevenue: 1492000,
    monthlyChange: 12.4
  },
  verificationApplications: [
    {
      id: "LAW-2048",
      name: "Anura Samarasinghe",
      email: "anura.s@lawsphere.io",
      phone: "+94 77 445 9011",
      licenceNumber: "LC/2021/1456",
      barCouncilId: "BC-99124",
      specialization: "Family Law",
      district: "Colombo",
      city: "Colombo",
      submitted: "2026-10-10",
      status: "Pending",
      dob: "1987-05-14",
      gender: "Male",
      qualifications: "LL.B (Hons), Attorney-at-Law",
      languages: ["Sinhala", "English", "Tamil"],
      experience: 11,
      fee: 12000,
      documents: ["NIC Front", "NIC Back", "Bar Council ID"]
    },
    {
      id: "LAW-2049",
      name: "Kavindi Ranatunga",
      email: "kavindi.r@gmail.com",
      phone: "+94 71 220 4431",
      licenceNumber: "LC/2019/4821",
      barCouncilId: "BC-77104",
      specialization: "Property Law",
      district: "Gampaha",
      city: "Ja-Ela",
      submitted: "2026-10-09",
      status: "Approved",
      dob: "1991-03-28",
      gender: "Female",
      qualifications: "LL.B, Advocate",
      languages: ["Sinhala", "English"],
      experience: 8,
      fee: 10000,
      documents: ["NIC Front", "NIC Back", "Bar Council ID"]
    },
    {
      id: "LAW-2050",
      name: "Ruwan Dias",
      email: "ruwan.dias@outlook.com",
      phone: "+94 76 431 9902",
      licenceNumber: "LC/2022/8834",
      barCouncilId: "BC-11022",
      specialization: "Criminal Law",
      district: "Kandy",
      city: "Kandy",
      submitted: "2026-10-08",
      status: "Rejected",
      dob: "1989-07-09",
      gender: "Male",
      qualifications: "LL.B, Legal Consultant",
      languages: ["Sinhala", "English"],
      experience: 6,
      fee: 9500,
      documents: ["NIC Front", "NIC Back", "Bar Council ID"]
    },
    {
      id: "LAW-2051",
      name: "Ishara Wijesinghe",
      email: "ishara.wj@protonmail.com",
      phone: "+94 76 900 5121",
      licenceNumber: "LC/2023/1140",
      barCouncilId: "BC-12488",
      specialization: "Commercial Law",
      district: "Colombo",
      city: "Nugegoda",
      submitted: "2026-10-06",
      status: "Pending",
      dob: "1994-11-02",
      gender: "Female",
      qualifications: "LL.B (Hons)",
      languages: ["Sinhala", "English"],
      experience: 5,
      fee: 13000,
      documents: ["NIC Front", "NIC Back", "Bar Council ID"]
    }
  ],
  users: [
    { id: "USR-1034", name: "Nimal Perera", email: "nimal.p@gmail.com", phone: "+94 71 219 7788", role: "Client", registered: "2026-09-12", status: "Active" },
    { id: "USR-1035", name: "Anura Samarasinghe", email: "anura.s@lawsphere.io", phone: "+94 77 445 9011", role: "Lawyer", registered: "2026-08-25", status: "Approved" },
    { id: "USR-1036", name: "Madhavi Silva", email: "madhavi.silva@pmail.com", phone: "+94 77 100 4419", role: "Client", registered: "2026-09-18", status: "Active" },
    { id: "USR-1037", name: "Ruwan Dias", email: "ruwan.dias@outlook.com", phone: "+94 76 431 9902", role: "Lawyer", registered: "2026-07-28", status: "Suspended" },
    { id: "USR-1038", name: "Dinesh Wickramasinghe", email: "dinesh.w@gmail.com", phone: "+94 72 908 1124", role: "Client", registered: "2026-10-03", status: "Active" },
    { id: "USR-1039", name: "Kavindi Ranatunga", email: "kavindi.r@gmail.com", phone: "+94 71 220 4431", role: "Lawyer", registered: "2026-09-22", status: "Approved" }
  ],
  bookings: [
    { id: "BK-3101", client: "Nimal Perera", lawyer: "Anura Samarasinghe", specialization: "Family Law", date: "2026-10-12", time: "11:00", method: "Online", fee: 12000, bookingStatus: "Pending Lawyer Response", paymentStatus: "Unpaid" },
    { id: "BK-3102", client: "Madhavi Silva", lawyer: "Kavindi Ranatunga", specialization: "Property Law", date: "2026-10-18", time: "14:15", method: "Physical", fee: 11000, bookingStatus: "Awaiting Payment", paymentStatus: "Pending" },
    { id: "BK-3103", client: "Dinesh Wickramasinghe", lawyer: "Anura Samarasinghe", specialization: "Civil Law", date: "2026-10-15", time: "13:00", method: "Online", fee: 13000, bookingStatus: "Alternative Proposed", paymentStatus: "Unpaid" },
    { id: "BK-3104", client: "Shehani De Silva", lawyer: "Ruwan Dias", specialization: "Labour Law", date: "2026-10-16", time: "09:45", method: "Online", fee: 10500, bookingStatus: "Confirmed", paymentStatus: "Paid" },
    { id: "BK-3105", client: "Saumya Weerasinghe", lawyer: "Kavindi Ranatunga", specialization: "Commercial Law", date: "2026-10-08", time: "16:30", method: "Physical", fee: 11500, bookingStatus: "Completed", paymentStatus: "Paid" },
    { id: "BK-3106", client: "Tharindu Karunaratne", lawyer: "Anura Samarasinghe", specialization: "Criminal Law", date: "2026-10-19", time: "16:15", method: "Online", fee: 14500, bookingStatus: "Cancelled", paymentStatus: "Refunded" }
  ],
  payments: [
    { id: "PMT-9152", bookingId: "BK-3104", client: "Shehani De Silva", lawyer: "Ruwan Dias", gross: 10500, commission: 1050, net: 9450, paidOn: "2026-10-16", status: "Paid", reference: "TXN-104510" },
    { id: "PMT-9153", bookingId: "BK-3105", client: "Saumya Weerasinghe", lawyer: "Kavindi Ranatunga", gross: 11500, commission: 1150, net: 10350, paidOn: "2026-10-09", status: "Paid", reference: "TXN-104640" },
    { id: "PMT-9154", bookingId: "BK-3102", client: "Madhavi Silva", lawyer: "Kavindi Ranatunga", gross: 11000, commission: 1100, net: 9900, paidOn: "2026-10-18", status: "Pending", reference: "TXN-104720" },
    { id: "PMT-9155", bookingId: "BK-3101", client: "Nimal Perera", lawyer: "Anura Samarasinghe", gross: 12000, commission: 1200, net: 10800, paidOn: "2026-10-12", status: "Failed", reference: "TXN-104860" }
  ],
  settlements: [
    { id: "SET-2026-08", lawyer: "Anura Samarasinghe", period: "Aug 2026", gross: 48600, commission: 4860, refundAdjustment: 0, recoverableBalance: 0, net: 43740, status: "Pending", date: "2026-09-03" },
    { id: "SET-2026-09", lawyer: "Kavindi Ranatunga", period: "Sep 2026", gross: 43200, commission: 4320, refundAdjustment: 650, recoverableBalance: 650, net: 38230, status: "Draft", date: "2026-10-02" },
    { id: "SET-2026-07", lawyer: "Ruwan Dias", period: "Jul 2026", gross: 32100, commission: 3210, refundAdjustment: 0, recoverableBalance: 0, net: 28890, status: "Settled", date: "2026-08-15" }
  ],
  reviews: [
    { id: "REV-901", client: "Madhavi Silva", lawyer: "Kavindi Ranatunga", bookingId: "BK-3105", rating: 5, comment: "Very professional and clear. I felt informed and supported throughout the consultation.", date: "2026-10-12", status: "Published" },
    { id: "REV-902", client: "Shehani De Silva", lawyer: "Ruwan Dias", bookingId: "BK-3104", rating: 4, comment: "Helpful advice with a practical approach. Could have been a little more detailed on the legal timeline.", date: "2026-10-10", status: "Flagged" },
    { id: "REV-903", client: "Nimal Perera", lawyer: "Anura Samarasinghe", bookingId: "BK-3101", rating: 5, comment: "Excellent consultation. The advice was calm, clear, and actionable.", date: "2026-10-09", status: "Published" }
  ],
  notifications: [
    { id: "NT-2001", title: "New lawyer application requires review", detail: "LAW-2051 from Ishara Wijesinghe is awaiting verification.", time: "Today, 8:42 AM", read: false },
    { id: "NT-2002", title: "Refund request pending", detail: "REF-4011 requires administrator decision.", time: "Today, 10:15 AM", read: false },
    { id: "NT-2003", title: "Settlement batch requires action", detail: "SET-2026-09 for Kavindi Ranatunga is ready for review.", time: "Yesterday, 5:00 PM", read: true },
    { id: "NT-2004", title: "Account suspension notice", detail: "USR-1037 was temporarily suspended for review.", time: "Sep 28, 4:30 PM", read: true },
    { id: "NT-2005", title: "Review moderation request", detail: "REV-902 requires moderator attention.", time: "Sep 27, 9:10 AM", read: true }
  ],
  activityLog: [
    { admin: "Ayesha Fernando", action: "Approved lawyer application", target: "LAW-2049", date: "2026-10-10 16:30", reason: "Documents verified and licensing checked." },
    { admin: "Ayesha Fernando", action: "Rejected application", target: "LAW-2050", date: "2026-10-09 11:20", reason: "Bar council ID could not be verified." },
    { admin: "Ayesha Fernando", action: "Suspended account", target: "USR-1037", date: "2026-10-05 14:45", reason: "Flagged for compliance review." },
    { admin: "Ayesha Fernando", action: "Approved refund", target: "REF-4013", date: "2026-10-04 09:10", reason: "Refund request matched documented cancellation terms." }
  ]
};
