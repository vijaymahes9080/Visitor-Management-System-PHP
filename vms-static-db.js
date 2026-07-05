/**
 * VMS Mock Database (localStorage wrapper)
 */

const VMS_DB_KEY = "vms_visitors";
const VMS_SESSION_KEY = "vms_session";

// Default seed data
const DEFAULT_VISITORS = [
  {
    Serial: 1,
    Name: "Sumit",
    Contact: "9841120696",
    Purpose: "Fun",
    meetingTo: "Hellp",
    day: "16",
    month: "01",
    year: "2019",
    Date: "2019-01-16",
    TimeIN: "18:28:06",
    TimeOUT: "18:59:04",
    ReceiptID: 145513,
    Status: "OFFLINE",
    Comment: "asd",
    registeredBy: "sumit",
    loggedOutBy: "sumit"
  },
  {
    Serial: 2,
    Name: "Vijay Mahes",
    Contact: "9841120696",
    Purpose: "Hello",
    meetingTo: "BAba",
    day: "16",
    month: "01",
    year: "2019",
    Date: "2019-01-16",
    TimeIN: "18:29:38",
    TimeOUT: "18:32:01",
    ReceiptID: 514571,
    Status: "OFFLINE",
    Comment: "hello",
    registeredBy: "sumit",
    loggedOutBy: "sumit"
  },
  {
    Serial: 3,
    Name: "Ursula",
    Contact: "9861549710",
    Purpose: "Etikai",
    meetingTo: "Sumit",
    day: "16",
    month: "01",
    year: "2019",
    Date: "2019-01-16",
    TimeIN: "21:39:59",
    TimeOUT: "21:41:46",
    ReceiptID: 658639,
    Status: "OFFLINE",
    Comment: "hello",
    registeredBy: "sumit",
    loggedOutBy: "sumit"
  },
  {
    Serial: 4,
    Name: "Krishna",
    Contact: "9865321458",
    Purpose: "meet",
    meetingTo: "job",
    day: "04",
    month: "07",
    year: "2020",
    Date: "2020-07-04",
    TimeIN: "15:18:04",
    TimeOUT: "00:00:00",
    ReceiptID: 617285,
    Status: "ONLINE",
    Comment: "new employee",
    registeredBy: "sumit",
    loggedOutBy: ""
  },
  {
    Serial: 5,
    Name: "kisan",
    Contact: "9865324512",
    Purpose: "new job",
    meetingTo: "for meeting",
    day: "05",
    month: "07",
    year: "2026",
    Date: "2026-07-05",
    TimeIN: "12:35:18",
    TimeOUT: "00:00:00",
    ReceiptID: 820264,
    Status: "ONLINE",
    Comment: "new customer",
    registeredBy: "Projectworlds",
    loggedOutBy: ""
  }
];

// Initialize DB if not present
function initDb() {
  if (!localStorage.getItem(VMS_DB_KEY)) {
    localStorage.setItem(VMS_DB_KEY, JSON.stringify(DEFAULT_VISITORS));
  }
}

// Get all visitors
function getVisitors() {
  initDb();
  return JSON.parse(localStorage.getItem(VMS_DB_KEY));
}

// Save all visitors
function saveVisitors(visitors) {
  localStorage.setItem(VMS_DB_KEY, JSON.stringify(visitors));
}

// Check session
function checkSession() {
  const session = localStorage.getItem(VMS_SESSION_KEY);
  if (!session) {
    window.location.href = "index.html";
    return null;
  }
  return session;
}

// Login
function loginUser(username, password) {
  if (username === "vijay" && password === "vijay") {
    localStorage.setItem(VMS_SESSION_KEY, username);
    return true;
  }
  return false;
}

// Logout
function logoutUser() {
  localStorage.removeItem(VMS_SESSION_KEY);
  window.location.href = "index.html";
}

// Check out a visitor
function checkoutVisitor(receiptId, loggedOutByUser) {
  const visitors = getVisitors();
  const visitor = visitors.find(v => v.ReceiptID === parseInt(receiptId) && v.Status === "ONLINE");
  if (visitor) {
    const now = new Date();
    const timeOut = now.toTimeString().split(" ")[0];
    visitor.Status = "OFFLINE";
    visitor.TimeOUT = timeOut;
    visitor.loggedOutBy = loggedOutByUser || "vijay";
    saveVisitors(visitors);
    return true;
  }
  return false;
}

// Get online/active visitors
function getOnlineVisitors() {
  return getVisitors().filter(v => v.Status === "ONLINE");
}

// Get offline/checked out visitors for today
function getOfflineVisitorsToday() {
  const today = getTodayFormatted();
  return getVisitors().filter(v => v.Status === "OFFLINE" && v.Date === today);
}

// Add visitor
function addVisitor(name, contact, purpose, meetingTo, comment, registeredByUser) {
  const visitors = getVisitors();
  const nextSerial = visitors.length > 0 ? Math.max(...visitors.map(v => v.Serial)) + 1 : 1;
  const rid = Math.floor(100000 + Math.random() * 900000);
  
  const now = new Date();
  const timeIn = now.toTimeString().split(" ")[0];
  const dateStr = getTodayFormatted();
  
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());

  const newVisitor = {
    Serial: nextSerial,
    Name: name,
    Contact: contact,
    Purpose: purpose,
    meetingTo: meetingTo,
    day: day,
    month: month,
    year: year,
    Date: dateStr,
    TimeIN: timeIn,
    TimeOUT: "00:00:00",
    ReceiptID: rid,
    Status: "ONLINE",
    Comment: comment || "",
    registeredBy: registeredByUser || "vijay",
    loggedOutBy: ""
  };
  
  visitors.push(newVisitor);
  saveVisitors(visitors);
  localStorage.setItem("vms_last_registered_rid", rid);
  return rid;
}

// Get today's date formatted as YYYY-MM-DD
function getTodayFormatted() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${year}-${month}-${day}`;
}

// Get standard date string from Date object
function formatDateString(dateObj) {
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${year}-${month}-${day}`;
}
