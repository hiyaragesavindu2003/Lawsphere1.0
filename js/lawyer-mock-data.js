window.LawyerPortalMock = {
  lawyer: {
    firstName: "Anura",
    lastName: "Samarasinghe",
    displayName: "Anura Samarasinghe",
    initials: "AS",
    color: "blue",
    role: "Senior Lawyer",
    email: "anura.s@lawsphere.io",
    phone: "+94 77 445 9011",
    dob: "1987-05-14",
    gender: "Male",
    licenceNumber: "LC/2021/1456",
    barCouncilId: "BC-99124",
    qualification: "LL.B (Hons), Attorney-at-Law",
    bio: "Anura advises clients on commercial, civil, and family law matters with a practical and client-focused approach. He is known for clear guidance, careful documentation, and client communication throughout every stage of the matter.",
    specializations: ["Family Law", "Civil Law", "Property Law"],
    languages: ["Sinhala", "English", "Tamil"],
    experience: 11,
    district: "Colombo",
    city: "Colombo",
    fee: 12000,
    consultationDurations: ["30 minutes", "60 minutes", "90 minutes"],
    methods: ["Physical", "Online"],
    verificationStatus: "Pending",
    approved: false
  },
  stats: {
    totalConsultations: 184,
    upcomingConsultations: 14,
    pendingRequests: 7,
    completedConsultations: 126
  },
  dashboard: {
    upcoming: [
      { client: "Nimal Perera", date: "2026-10-16", time: "10:30", method: "Online", status: "Confirmed" },
      { client: "Madhavi Silva", date: "2026-10-18", time: "14:15", method: "Physical", status: "Awaiting Payment" },
      { client: "Kasun Jayasuriya", date: "2026-10-20", time: "09:00", method: "Online", status: "Confirmed" }
    ],
    requests: [
      { id: "LR-2041", client: "Dinesh Wickramasinghe", date: "2026-10-12", time: "11:00", duration: 60, method: "Online", fee: 12000, speciality: "Family Law", status: "New Request" },
      { id: "LR-2042", client: "Anjali Fernando", date: "2026-10-13", time: "15:30", duration: 60, method: "Physical", fee: 11000, speciality: "Property Law", status: "New Request" },
      { id: "LR-2043", client: "Ranjith Herath", date: "2026-10-15", time: "13:00", duration: 90, method: "Online", fee: 13000, speciality: "Civil Law", status: "New Request" }
    ],
    earnings: {
      gross: 286500,
      commission: 28650,
      net: 257850,
      pending: 34600
    },
    activity: [
      { title: "New booking request", detail: "LR-2041 received from Nimal Perera", time: "15 mins ago" },
      { title: "Accepted consultation", detail: "Client: Madhavi Silva · 18 Oct", time: "2 hours ago" },
      { title: "Completed consultation", detail: "Client: Saman De Silva · 12 Oct", time: "Yesterday" },
      { title: "Settlement update", detail: "August payout batch processed", time: "2 days ago" }
    ]
  },
  requests: [
    { id: "LR-2041", client: "Nimal Perera", date: "2026-10-12", time: "11:00", method: "Online", duration: 60, fee: 12000, speciality: "Family Law", status: "Pending Review" },
    { id: "LR-2042", client: "Anjali Fernando", date: "2026-10-13", time: "15:30", method: "Physical", duration: 60, fee: 11000, speciality: "Property Law", status: "Awaiting Payment" },
    { id: "LR-2043", client: "Ranjith Herath", date: "2026-10-15", time: "13:00", method: "Online", duration: 90, fee: 13000, speciality: "Civil Law", status: "Alternative Proposed" },
    { id: "LR-2044", client: "Shehani De Silva", date: "2026-10-16", time: "09:45", method: "Online", duration: 60, fee: 10500, speciality: "Labour Law", status: "Pending Review" },
    { id: "LR-2045", client: "Saumya Weerasinghe", date: "2026-10-18", time: "14:00", method: "Physical", duration: 60, fee: 11500, speciality: "Commercial Law", status: "Rejected" },
    { id: "LR-2046", client: "Tharindu Karunaratne", date: "2026-10-19", time: "16:15", method: "Online", duration: 90, fee: 14500, speciality: "Criminal Law", status: "Pending Review" }
  ],
  consultations: [
    { id: "LS-24098", client: "Madhavi Silva", date: "2026-10-18", time: "14:15", method: "Physical", duration: 60, fee: 12000, status: "Awaiting Payment", meetingLink: "" },
    { id: "LS-24071", client: "Kasun Jayasuriya", date: "2026-10-20", time: "09:00", method: "Online", duration: 60, fee: 11000, status: "Confirmed", meetingLink: "https://meet.lawsphere.io/room/24071" },
    { id: "LS-23966", client: "Saman De Silva", date: "2026-10-10", time: "11:30", method: "Online", duration: 60, fee: 9500, status: "Completed", meetingLink: "https://meet.lawsphere.io/room/23966" },
    { id: "LS-23844", client: "Dilani Gunawardena", date: "2026-10-03", time: "16:00", method: "Physical", duration: 90, fee: 14000, status: "Cancelled", meetingLink: "" }
  ],
  earnings: {
    gross: 286500,
    commission: 28650,
    net: 257850,
    pending: 34600,
    history: [
      { bookingId: "LS-24098", client: "Madhavi Silva", date: "2026-10-18", gross: 12000, commission: 1200, net: 10800, status: "Pending" },
      { bookingId: "LS-24071", client: "Kasun Jayasuriya", date: "2026-10-20", gross: 11000, commission: 1100, net: 9900, status: "Approved" },
      { bookingId: "LS-23966", client: "Saman De Silva", date: "2026-10-10", gross: 9500, commission: 950, net: 8550, status: "Settled" },
      { bookingId: "LS-23891", client: "Nimal Perera", date: "2026-10-04", gross: 12000, commission: 1200, net: 10800, status: "Settled" } 
    ],
    settlements: [
      { reference: "SET-2026-08", period: "Aug 2026", amount: 109400, status: "Processed", date: "2026-09-03" },
      { reference: "SET-2026-07", period: "Jul 2026", amount: 83420, status: "Processed", date: "2026-08-05" },
      { reference: "SET-2026-06", period: "Jun 2026", amount: 67310, status: "Scheduled", date: "2026-07-12" }
    ]
  },
  reviews: [
    {
      client: "Saman De Silva",
      rating: 5,
      comment: "The advice was clear, practical, and very easy to follow. I felt prepared and informed at every step.",
      date: "2026-10-11",
      consultation: "Family law consultation"
    },
    {
      client: "Nimal Perera",
      rating: 4,
      comment: "Helpful and professional. The legal options were explained carefully and without jargon.",
      date: "2026-09-21",
      consultation: "Property dispute review"
    },
    {
      client: "Dilani Gunawardena",
      rating: 5,
      comment: "Very responsive and reassuring throughout the process. I appreciated the timely follow-up.",
      date: "2026-09-03",
      consultation: "Commercial advisory session"
    }
  ],
  notifications: [
    { id: "N-1001", title: "New consultation request", detail: "Nimal Perera requested a Family Law consultation for 12 Oct at 11:00 AM.", time: "Today, 8:42 AM", read: false },
    { id: "N-1002", title: "Client accepted an alternative time", detail: "Anjali Fernando accepted the revised appointment for 14 Oct at 4:00 PM.", time: "Yesterday, 1:14 PM", read: false },
    { id: "N-1003", title: "Payment confirmed", detail: "Payment for LS-23966 was successfully verified.", time: "Sep 28, 10:55 AM", read: true },
    { id: "N-1004", title: "Settlement processed", detail: "August settlement batch was processed by the administrator.", time: "Sep 24, 3:20 PM", read: true },
    { id: "N-1005", title: "Profile verification update", detail: "Your verification status remains pending while the administrator reviews your documents.", time: "Sep 20, 9:10 AM", read: true }
  ],
  settings: {
    account: {
      email: "anura.s@lawsphere.io",
      phone: "+94 77 445 9011"
    },
    notificationPreferences: [
      { label: "New consultation requests", enabled: true },
      { label: "Alternative proposals", enabled: true },
      { label: "Payment confirmations", enabled: true },
      { label: "Profile updates", enabled: false }
    ],
    consultationPreferences: {
      methods: ["Physical", "Online"],
      defaultDuration: "60 minutes"
    }
  }
};
