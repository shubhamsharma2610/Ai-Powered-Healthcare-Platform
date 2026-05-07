export const appointments = [
  {
    id: 1,
    doctor: "Dr. Arvind Sharma",
    specialty: "Cardiologist",
    date: "May 12, 2026",
    time: "10:30 AM",
    status: "upcoming",
    avatar: "AS",
    color: "#00BFBF",
  },
  {
    id: 2,
    doctor: "Dr. Priya Kapoor",
    specialty: "Neurologist",
    date: "May 08, 2026",
    time: "2:00 PM",
    status: "upcoming",
    avatar: "PK",
    color: "#2a6f7c",
  },
  {
    id: 3,
    doctor: "Dr. Rahul Mehta",
    specialty: "Dermatologist",
    date: "Apr 28, 2026",
    time: "11:00 AM",
    status: "completed",
    avatar: "RM",
    color: "#6366f1",
  },
  {
    id: 4,
    doctor: "Dr. Sneha Verma",
    specialty: "Orthopedist",
    date: "Apr 15, 2026",
    time: "9:00 AM",
    status: "cancelled",
    avatar: "SV",
    color: "#ff6b6b",
  },
];

export const transactions = [
  {
    id: 1,
    doctor: "Dr. Arvind Sharma",
    specialty: "Cardiologist",
    date: "May 12, 2026",
    amount: 800,
    status: "pending",
  },
  {
    id: 2,
    doctor: "Dr. Priya Kapoor",
    specialty: "Neurologist",
    date: "May 08, 2026",
    amount: 1200,
    status: "pending",
  },
  {
    id: 3,
    doctor: "Dr. Rahul Mehta",
    specialty: "Dermatologist",
    date: "Apr 28, 2026",
    amount: 600,
    status: "paid",
  },
  {
    id: 4,
    doctor: "Dr. Sneha Verma",
    specialty: "Orthopedist",
    date: "Apr 15, 2026",
    amount: 950,
    status: "refunded",
  },
];

export const overviewCards = [

  // NEW HOME CARD
  {
    label: "Back To Home",
    value: "Home",
    sub: "Go to homepage",
    color: "#00BFBF",
    bg: "hsl(182,100%,94%)",
    icon: "home",
    path: "/",
  },

  {
    label: "Total Appointments",
    value: "12",
    sub: "+2 this month",
    color: "#00BFBF",
    bg: "hsl(182,100%,94%)",
    icon: "appointments",
  },

  {
    label: "Upcoming",
    value: "2",
    sub: "Next: May 8",
    color: "#2a6f7c",
    bg: "#e0f5f7",
    icon: "clock",
  },

  {
    label: "Reports Uploaded",
    value: "5",
    sub: "Last: 3 days ago",
    color: "#6366f1",
    bg: "#eeeefd",
    icon: "report",
  },

  {
    label: "Total Spent",
    value: "₹3,550",
    sub: "2 pending",
    color: "#ff6b6b",
    bg: "#fff0f0",
    icon: "transactions",
  },
];

export const patientProfile = {
  name: "Rahul Sharma",
  id: "MED-20240312",
  avatar: "RS",
  role: "Patient",

  fields: [
    { label: "Full Name", value: "Rahul Sharma" },
    { label: "Email", value: "rahul@example.com" },
    { label: "Phone", value: "+91 98765 43210" },
    { label: "Date of Birth", value: "15 March 1995" },
    { label: "City", value: "Ludhiana" },
    { label: "State", value: "Punjab" },
    { label: "Gender", value: "Male" },
    { label: "Allergies", value: "None" },
  ],

  health: [
    { label: "Blood Group", value: "B+" },
    { label: "Height", value: "175 cm" },
    { label: "Weight", value: "70 kg" },
  ],

  emergency: {
    name: "Amit Sharma",
    phone: "+91 91234 56789",
    relation: "Parent",
  },
};