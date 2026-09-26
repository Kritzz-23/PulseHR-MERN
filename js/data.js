/**
 * PulseHR Enterprise — Realistic Industry Mock Dataset & State Store
 * Supports 245 Employees, 4 RBAC Roles, Attendance, Leaves, Tasks, and Charts
 */

var PULSEHR_DATA = {
  // Current Session User
  currentUser: {
    id: "USR-001",
    name: "Kritika Giri",
    email: "admin@pulsehr.io",
    role: "admin", // 'admin' | 'hr' | 'manager' | 'employee'
    designation: "Chief Technology Officer & Admin",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.pulsehr.admin.2026.token"
  },

  // Available Demo Profiles for 1-Click Role Switcher
  demoRoles: {
    admin: {
      name: "Kritika Giri",
      email: "admin@pulsehr.io",
      role: "admin",
      designation: "Chief Technology Officer & Admin",
      department: "Engineering",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    hr: {
      name: "Pooja Kapoor",
      email: "hr@pulsehr.io",
      role: "hr",
      designation: "Director of People & HR",
      department: "HR & Operations",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
    },
    manager: {
      name: "Vikram Sengupta",
      email: "manager@pulsehr.io",
      role: "manager",
      designation: "Engineering Lead & Manager",
      department: "Engineering",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    employee: {
      name: "Aarav Mukherjee",
      email: "employee@pulsehr.io",
      role: "employee",
      designation: "Senior Backend Developer",
      department: "Engineering",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    }
  },

  // Header KPI Statistics
  metrics: {
    totalEmployees: 245,
    presentToday: 218,
    onLeave: 17,
    pendingRequests: 10
  },

  // Monthly Trajectory for Employee Growth Chart
  growthTrajectory: [
    { month: "Jan", count: 175 },
    { month: "Feb", count: 184 },
    { month: "Mar", count: 192 },
    { month: "Apr", count: 201 },
    { month: "May", count: 210 },
    { month: "Jun", count: 218 },
    { month: "Jul", count: 224 },
    { month: "Aug", count: 231 },
    { month: "Sep", count: 237 },
    { month: "Oct", count: 241 },
    { month: "Nov", count: 243 },
    { month: "Dec", count: 245 }
  ],

  // Department Breakdown for Distribution Chart
  departments: [
    { name: "Engineering", count: 103, percentage: 42, color: "#2563EB", lead: "Vikram Sengupta" },
    { name: "Product & Design", count: 44, percentage: 18, color: "#7C3AED", lead: "Ananya Roy" },
    { name: "Sales & Growth", count: 37, percentage: 15, color: "#059669", lead: "Rajesh Sharma" },
    { name: "Marketing", count: 37, percentage: 15, color: "#D97706", lead: "Sneha Bose" },
    { name: "HR & Operations", count: 24, percentage: 10, color: "#DC2626", lead: "Pooja Kapoor" }
  ],

  // Core Employee List (Pre-seeded with realistic records, scalable to 245)
  employees: [
    {
      id: "EMP-1001",
      name: "Aarav Mukherjee",
      email: "aarav.m@pulsehr.io",
      role: "employee",
      designation: "Senior Backend Developer",
      department: "Engineering",
      manager: "Vikram Sengupta",
      status: "Active",
      phone: "+91 98301 23411",
      location: "Kolkata, IN",
      joiningDate: "2023-04-15",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    },
    {
      id: "EMP-1002",
      name: "Rohan Varma",
      email: "rohan.v@pulsehr.io",
      role: "employee",
      designation: "Frontend Engineer (React)",
      department: "Engineering",
      manager: "Vikram Sengupta",
      status: "Active",
      phone: "+91 98301 23412",
      location: "Bengaluru, IN",
      joiningDate: "2023-06-01",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    {
      id: "EMP-1003",
      name: "Meera Nair",
      email: "meera.n@pulsehr.io",
      role: "employee",
      designation: "Product Designer (UI/UX)",
      department: "Product & Design",
      manager: "Ananya Roy",
      status: "On Leave",
      phone: "+91 98301 23413",
      location: "Mumbai, IN",
      joiningDate: "2023-01-20",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
    },
    {
      id: "EMP-1004",
      name: "Siddharth Jain",
      email: "siddharth.j@pulsehr.io",
      role: "employee",
      designation: "Cloud DevOps Specialist",
      department: "Engineering",
      manager: "Vikram Sengupta",
      status: "Active",
      phone: "+91 98301 23414",
      location: "Pune, IN",
      joiningDate: "2023-08-10",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
    },
    {
      id: "EMP-1005",
      name: "Tanya Sen",
      email: "tanya.s@pulsehr.io",
      role: "employee",
      designation: "Technical Recruiter",
      department: "HR & Operations",
      manager: "Pooja Kapoor",
      status: "Active",
      phone: "+91 98301 23415",
      location: "Kolkata, IN",
      joiningDate: "2023-11-05",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
    },
    {
      id: "EMP-1006",
      name: "Arjun Reddy",
      email: "arjun.r@pulsehr.io",
      role: "employee",
      designation: "Enterprise Account Executive",
      department: "Sales & Growth",
      manager: "Rajesh Sharma",
      status: "Active",
      phone: "+91 98301 23416",
      location: "Hyderabad, IN",
      joiningDate: "2024-02-14",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
    },
    {
      id: "EMP-1007",
      name: "Priya Sundaram",
      email: "priya.s@pulsehr.io",
      role: "employee",
      designation: "Content & Growth Strategist",
      department: "Marketing",
      manager: "Sneha Bose",
      status: "Active",
      phone: "+91 98301 23417",
      location: "Chennai, IN",
      joiningDate: "2024-03-01",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150"
    },
    {
      id: "EMP-1008",
      name: "Devika Patel",
      email: "devika.p@pulsehr.io",
      role: "employee",
      designation: "Machine Learning Engineer",
      department: "Engineering",
      manager: "Vikram Sengupta",
      status: "On Leave",
      phone: "+91 98301 23418",
      location: "Ahmedabad, IN",
      joiningDate: "2024-01-11",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
    }
  ],

  // Leave Requests Queue
  leaves: [
    {
      id: "LV-2026-081",
      employeeName: "Meera Nair",
      department: "Product & Design",
      leaveType: "Casual Leave",
      startDate: "2026-09-28",
      endDate: "2026-09-30",
      days: 3,
      reason: "Attending National Design Conclave and family commitment.",
      status: "Pending",
      appliedAt: "2026-09-26"
    },
    {
      id: "LV-2026-082",
      employeeName: "Devika Patel",
      department: "Engineering",
      leaveType: "Sick Leave",
      startDate: "2026-09-26",
      endDate: "2026-09-27",
      days: 2,
      reason: "Viral fever and physician recommended rest.",
      status: "Approved",
      appliedAt: "2026-09-25"
    },
    {
      id: "LV-2026-083",
      employeeName: "Rohan Varma",
      department: "Engineering",
      leaveType: "Privilege Leave",
      startDate: "2026-10-05",
      endDate: "2026-10-09",
      days: 5,
      reason: "Annual vacation and personal travel.",
      status: "Pending",
      appliedAt: "2026-09-26"
    },
    {
      id: "LV-2026-084",
      employeeName: "Arjun Reddy",
      department: "Sales & Growth",
      leaveType: "Casual Leave",
      startDate: "2026-09-22",
      endDate: "2026-09-23",
      days: 2,
      reason: "Personal banking and documentation work.",
      status: "Approved",
      appliedAt: "2026-09-20"
    }
  ],

  // Tasks Queue
  tasks: [
    {
      id: "TSK-401",
      title: "Migrate Auth Layer to Argon2 & Refresh Token Rotations",
      department: "Engineering",
      assignedTo: "Aarav Mukherjee",
      assignedBy: "Vikram Sengupta",
      priority: "Critical",
      dueDate: "2026-10-02",
      status: "In Progress"
    },
    {
      id: "TSK-402",
      title: "Design Q4 Design System Component Tokens in Figma",
      department: "Product & Design",
      assignedTo: "Meera Nair",
      assignedBy: "Ananya Roy",
      priority: "High",
      dueDate: "2026-10-05",
      status: "Pending"
    },
    {
      id: "TSK-403",
      title: "Automate Monthly Payroll Generation & Tax Deduction Slip PDF",
      department: "HR & Operations",
      assignedTo: "Tanya Sen",
      assignedBy: "Pooja Kapoor",
      priority: "High",
      dueDate: "2026-09-30",
      status: "Completed"
    },
    {
      id: "TSK-404",
      title: "Refactor Redis Caching for Employee Directory Query Speed",
      department: "Engineering",
      assignedTo: "Rohan Varma",
      assignedBy: "Vikram Sengupta",
      priority: "Medium",
      dueDate: "2026-10-08",
      status: "In Progress"
    }
  ],

  // Today's Attendance Logs
  attendanceLogs: [
    { name: "Aarav Mukherjee", id: "EMP-1001", timeIn: "09:05 AM", timeOut: "--", status: "Present" },
    { name: "Rohan Varma", id: "EMP-1002", timeIn: "09:12 AM", timeOut: "--", status: "Present" },
    { name: "Meera Nair", id: "EMP-1003", timeIn: "--", timeOut: "--", status: "On Leave" },
    { name: "Siddharth Jain", id: "EMP-1004", timeIn: "08:58 AM", timeOut: "--", status: "Present" },
    { name: "Tanya Sen", id: "EMP-1005", timeIn: "09:30 AM", timeOut: "--", status: "Present" },
    { name: "Arjun Reddy", id: "EMP-1006", timeIn: "09:15 AM", timeOut: "--", status: "Present" },
    { name: "Priya Sundaram", id: "EMP-1007", timeIn: "09:00 AM", timeOut: "--", status: "Present" },
    { name: "Devika Patel", id: "EMP-1008", timeIn: "--", timeOut: "--", status: "On Leave" }
  ],

  // Payroll & Compensation Information
  payroll: {
    monthlyDisbursement: "₹2,35,20,000",
    averageSalary: "₹96,000 / mo",
    nextPayDate: "October 01, 2026",
    payslips: [
      {
        id: "PAY-2026-0901",
        employeeId: "EMP-1001",
        name: "Aarav Mukherjee",
        designation: "Senior Backend Developer",
        department: "Engineering",
        month: "September 2026",
        basic: 60000,
        hra: 24000,
        allowances: 12000,
        gross: 96000,
        pfDeduction: 7200,
        profTax: 200,
        netPay: 88600,
        status: "Paid",
        paidOn: "2026-09-25"
      },
      {
        id: "PAY-2026-0902",
        employeeId: "EMP-1002",
        name: "Rohan Varma",
        designation: "Frontend Engineer (React)",
        department: "Engineering",
        month: "September 2026",
        basic: 52000,
        hra: 20800,
        allowances: 10200,
        gross: 83000,
        pfDeduction: 6240,
        profTax: 200,
        netPay: 76560,
        status: "Paid",
        paidOn: "2026-09-25"
      },
      {
        id: "PAY-2026-0903",
        employeeId: "EMP-1003",
        name: "Meera Nair",
        designation: "Product Designer (UI/UX)",
        department: "Product & Design",
        month: "September 2026",
        basic: 58000,
        hra: 23200,
        allowances: 11800,
        gross: 93000,
        pfDeduction: 6960,
        profTax: 200,
        netPay: 85840,
        status: "Paid",
        paidOn: "2026-09-25"
      },
      {
        id: "PAY-2026-0904",
        employeeId: "EMP-1004",
        name: "Siddharth Jain",
        designation: "Cloud DevOps Specialist",
        department: "Engineering",
        month: "September 2026",
        basic: 64000,
        hra: 25600,
        allowances: 13400,
        gross: 103000,
        pfDeduction: 7680,
        profTax: 200,
        netPay: 95120,
        status: "Processing",
        paidOn: "--"
      }
    ]
  },

  // Performance Reviews & OKRs
  performance: [
    {
      id: "REV-2026-Q3-01",
      employeeId: "EMP-1001",
      name: "Aarav Mukherjee",
      department: "Engineering",
      reviewer: "Vikram Sengupta",
      period: "Q3 2026",
      rating: 4.8,
      okrSummary: "Delivered asynchronous API rewrite; reduced p99 latency to 32ms.",
      feedback: "Exceptional architecture ownership and code review diligence. Recommended for Tech Lead track.",
      badge: "Outstanding Performer"
    },
    {
      id: "REV-2026-Q3-02",
      employeeId: "EMP-1002",
      name: "Rohan Varma",
      department: "Engineering",
      reviewer: "Vikram Sengupta",
      period: "Q3 2026",
      rating: 4.5,
      okrSummary: "Built accessible React design tokens with 99.8% test coverage.",
      feedback: "Consistent component velocity and proactive collaboration with UX design team.",
      badge: "Exceeds Expectations"
    },
    {
      id: "REV-2026-Q3-03",
      employeeId: "EMP-1003",
      name: "Meera Nair",
      department: "Product & Design",
      reviewer: "Ananya Roy",
      period: "Q3 2026",
      rating: 4.9,
      okrSummary: "Spearheaded user research with 45 enterprise customers for v2 redesign.",
      feedback: "Top tier design vision and cross-functional empathy. Crucial driver for product retention.",
      badge: "Top Contributor"
    }
  ],

  // Document Vault & Verification Records
  documents: [
    {
      id: "DOC-881",
      employeeName: "Aarav Mukherjee",
      title: "Signed Employment Master Contract (Permanent)",
      type: "Legal Agreement",
      fileSize: "2.4 MB PDF",
      uploadedAt: "2026-09-10",
      status: "Verified",
      cdnUrl: "https://res.cloudinary.com/pulsehr/raw/upload/v1/contracts/emp-1001-agreement.pdf"
    },
    {
      id: "DOC-882",
      employeeName: "Aarav Mukherjee",
      title: "Form 16 & Tax Deduction Certificate (FY 25-26)",
      type: "Tax Compliance",
      fileSize: "1.1 MB PDF",
      uploadedAt: "2026-08-15",
      status: "Verified",
      cdnUrl: "https://res.cloudinary.com/pulsehr/raw/upload/v1/tax/emp-1001-form16.pdf"
    },
    {
      id: "DOC-883",
      employeeName: "Meera Nair",
      title: "Proprietary IP & Mutual Non-Disclosure Agreement",
      type: "Compliance",
      fileSize: "850 KB PDF",
      uploadedAt: "2026-09-18",
      status: "Verified",
      cdnUrl: "https://res.cloudinary.com/pulsehr/raw/upload/v1/nda/emp-1003-nda.pdf"
    },
    {
      id: "DOC-884",
      employeeName: "Rohan Varma",
      title: "Group Comprehensive Health Insurance Card",
      type: "Benefits",
      fileSize: "620 KB PDF",
      uploadedAt: "2026-09-01",
      status: "Verified",
      cdnUrl: "https://res.cloudinary.com/pulsehr/raw/upload/v1/insurance/emp-1002-health.pdf"
    }
  ],

  // Real-time Notification Feed
  notifications: [
    { id: 1, title: "Leave Request Submitted", desc: "Meera Nair applied for Casual Leave (3 Days)", time: "10m ago", read: false },
    { id: 2, title: "September Payroll Disbursed", desc: "218 active accounts credited via automated NEFT", time: "1h ago", read: false },
    { id: 3, title: "Q3 Review Submitted", desc: "Vikram Sengupta completed review for Aarav Mukherjee", time: "3h ago", read: true },
    { id: 4, title: "New Employee Provisioned", desc: "EMP-1008 (Devika Patel) onboarded to Engineering", time: "1d ago", read: true }
  ]
};

// Global Browser Attachment
window.PULSEHR_DATA = PULSEHR_DATA;

