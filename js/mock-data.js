window.LawSphereMock = (() => {
  const lawyers = [
    {
      id: "amal-perera", name: "Amal Perera", initials: "AP", color: "blue",
      specialization: "Family Law", experience: 12, district: "Colombo", city: "Colombo",
      fee: 8500, rating: 4.9, reviews: 84, languages: ["Sinhala", "English"],
      qualification: "LL.B (University of Colombo), Attorney-at-Law",
      bio: "Amal advises individuals and families on matrimonial matters, custody arrangements, and thoughtful dispute resolution. His approach is practical, discreet, and focused on helping clients understand their options.",
      duration: "60 minutes"
    },
    {
      id: "nisha-fernando", name: "Nisha Fernando", initials: "NF", color: "rose",
      specialization: "Property Law", experience: 9, district: "Gampaha", city: "Negombo",
      fee: 7000, rating: 4.8, reviews: 62, languages: ["Sinhala", "English", "Tamil"],
      qualification: "LL.B (University of Sri Jayewardenepura), Attorney-at-Law",
      bio: "Nisha works with buyers, families, and small businesses on property transactions, title reviews, and land-related matters. She makes complex documents easier to understand.",
      duration: "60 minutes"
    },
    {
      id: "kasun-jayawardena", name: "Kasun Jayawardena", initials: "KJ", color: "gold",
      specialization: "Business & Corporate", experience: 15, district: "Kandy", city: "Kandy",
      fee: 12000, rating: 4.9, reviews: 107, languages: ["Sinhala", "English"],
      qualification: "LL.B (University of London), Attorney-at-Law",
      bio: "Kasun supports entrepreneurs and established companies with commercial contracts, company matters, and day-to-day legal guidance tailored to business needs.",
      duration: "60 minutes"
    },
    {
      id: "dinithi-silva", name: "Dinithi Silva", initials: "DS", color: "teal",
      specialization: "Labour & Employment", experience: 7, district: "Colombo", city: "Dehiwala",
      fee: 6500, rating: 4.7, reviews: 41, languages: ["Sinhala", "Tamil", "English"],
      qualification: "LL.B (University of Colombo), Attorney-at-Law",
      bio: "Dinithi helps employees and employers navigate workplace policies, employment agreements, and labour disputes with clear, balanced advice.",
      duration: "60 minutes"
    },
    {
      id: "tharindu-wickramasinghe", name: "Tharindu Wickramasinghe", initials: "TW", color: "purple",
      specialization: "Criminal Law", experience: 11, district: "Galle", city: "Galle",
      fee: 9000, rating: 4.8, reviews: 73, languages: ["Sinhala", "English"],
      qualification: "LL.B (University of Peradeniya), Attorney-at-Law",
      bio: "Tharindu provides careful counsel in criminal matters, explains each stage of the process, and works with clients to prepare for the next step.",
      duration: "60 minutes"
    },
    {
      id: "sachini-rajapaksa", name: "Sachini Rajapaksa", initials: "SR", color: "rose",
      specialization: "Civil Law", experience: 6, district: "Matara", city: "Matara",
      fee: 6000, rating: 4.6, reviews: 29, languages: ["Sinhala", "English"],
      qualification: "LL.B (Open University of Sri Lanka), Attorney-at-Law",
      bio: "Sachini advises on civil disputes and helps clients assess practical options, documentation, and potential routes to resolution.",
      duration: "60 minutes"
    }
  ];

  const bookings = [
    { id: "LS-24081", lawyerId: "amal-perera", date: "2026-10-16", time: "10:30", method: "Online", duration: 60, fee: 8500, status: "Pending Lawyer Response" },
    { id: "LS-24074", lawyerId: "nisha-fernando", date: "2026-10-19", time: "14:00", method: "Physical", duration: 60, fee: 7000, status: "Alternative Proposed", proposedDate: "2026-10-20", proposedTime: "15:30" },
    { id: "LS-24061", lawyerId: "kasun-jayawardena", date: "2026-10-22", time: "09:00", method: "Online", duration: 60, fee: 12000, status: "Awaiting Payment" },
    { id: "LS-23998", lawyerId: "dinithi-silva", date: "2026-10-19", time: "11:00", method: "Online", duration: 60, fee: 6500, status: "Confirmed" },
    { id: "LS-23882", lawyerId: "amal-perera", date: "2026-09-28", time: "13:30", method: "Physical", duration: 60, fee: 8500, status: "Completed" },
    { id: "LS-23840", lawyerId: "nisha-fernando", date: "2026-09-22", time: "14:00", method: "Online", duration: 60, fee: 7000, status: "Completed" },
    { id: "LS-23714", lawyerId: "tharindu-wickramasinghe", date: "2026-09-19", time: "10:00", method: "Online", duration: 60, fee: 9000, status: "Rejected" },
    { id: "LS-23690", lawyerId: "sachini-rajapaksa", date: "2026-09-15", time: "16:00", method: "Physical", duration: 30, fee: 3000, status: "Cancelled" }
  ];

  const transactions = [
    { id: "TX-90041", bookingId: "LS-23998", lawyerId: "dinithi-silva", amount: 6500, date: "2026-10-08", status: "Paid" },
    { id: "TX-89963", bookingId: "LS-23882", lawyerId: "amal-perera", amount: 8500, date: "2026-09-26", status: "Paid" },
    { id: "TX-90072", bookingId: "LS-24061", lawyerId: "kasun-jayawardena", amount: 12000, date: "", status: "Pending" }
  ];

  const notifications = [
    { id: "n1", type: "accepted", title: "Consultation accepted", text: "Dinithi Silva accepted your consultation request.", time: "Today, 9:42 AM", read: false, bookingId: "LS-23998" },
    { id: "n2", type: "alternative", title: "Alternative time proposed", text: "Nisha Fernando suggested 20 October at 3:30 PM.", time: "Yesterday, 4:18 PM", read: false, bookingId: "LS-24074" },
    { id: "n3", type: "payment", title: "Payment required", text: "Your agreed consultation with Kasun Jayawardena is awaiting payment.", time: "12 Oct, 11:05 AM", read: false, bookingId: "LS-24061" },
    { id: "n4", type: "confirmed", title: "Consultation confirmed", text: "Your consultation with Dinithi Silva is confirmed for 19 October.", time: "8 Oct, 2:16 PM", read: true, bookingId: "LS-23998" },
    { id: "n5", type: "cancelled", title: "Cancellation update", text: "Your request LS-23714 was declined by the lawyer.", time: "20 Sep, 10:20 AM", read: true, bookingId: "LS-23714" },
    { id: "n6", type: "completed", title: "Consultation completed", text: "Your session with Amal Perera is complete. You can now leave a review.", time: "28 Sep, 2:45 PM", read: true, bookingId: "LS-23882" }
  ];

  const reviews = [
    { bookingId: "LS-23882", lawyerId: "amal-perera", rating: 5, text: "Clear, considerate advice and an easy-to-understand explanation of my options.", date: "29 Sep 2026" }
  ];

  return { lawyers, bookings, transactions, notifications, reviews };
})();
