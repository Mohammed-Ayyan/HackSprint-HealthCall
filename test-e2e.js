/**
 * Comprehensive End-to-End Test for Self-Registration and MongoDB Persistence
 * 
 * Tests:
 * 1. Patient Self-Registration -> MongoDB User & Patient record -> Dashboard /me API
 * 2. Doctor Self-Registration -> MongoDB User & Doctor record -> Dashboard /me API
 * 3. Admin User Directory Query -> Live Users in MongoDB
 * 4. Reception Patient Directory Query -> Live Patients in MongoDB
 */

const mongoose = require("./backend/node_modules/mongoose");

const BASE_URL = "http://localhost:5000/api/v1";
const DB_URI = "mongodb://127.0.0.1:27017/careops";

async function runTest() {
  console.log("===============================================================");
  console.log("  CareOps AI - Autonomous End-to-End Registration Test Suite  ");
  console.log("===============================================================\n");

  const results = [];

  // Connect to MongoDB directly to verify database records
  await mongoose.connect(DB_URI);
  console.log("[DB] Connected directly to MongoDB at 127.0.0.1:27017/careops\n");

  // -------------------------------------------------------------
  // TEST 1: Register New Patient (Sarah Connor)
  // -------------------------------------------------------------
  console.log("--- TEST 1: Patient Self-Registration ---");
  const uniquePatientEmail = `sarah.connor.${Date.now()}@test.com`;
  const patientPayload = {
    name: "Sarah Connor",
    email: uniquePatientEmail,
    password: "password123",
    role: "Patient",
    department: "Cardiology",
    phone: "+1 (555) 777-8899",
  };

  const patRegRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patientPayload),
  });
  const patRegData = await patRegRes.json();

  if (patRegData.success && patRegData.token) {
    console.log("  [+] POST /api/v1/auth/register succeeded for Patient");
    console.log(`      User ID: ${patRegData.user.id}, Token issued`);
  } else {
    throw new Error(`Patient registration failed: ${JSON.stringify(patRegData)}`);
  }

  // Simulate Patient Dashboard accessing /patients/me
  const patMeRes = await fetch(`${BASE_URL}/patients/me`, {
    headers: { Authorization: `Bearer ${patRegData.token}` },
  });
  const patMeData = await patMeRes.json();

  if (patMeData.success && patMeData.patient) {
    console.log("  [+] GET /api/v1/patients/me auto-provisioned Patient profile");
    console.log(`      Name: ${patMeData.patient.name}`);
    console.log(`      MRN:  ${patMeData.patient.mrn}`);
    console.log(`      Dept: ${patMeData.patient.department}`);
    console.log(`      Phone: ${patMeData.patient.phone}`);
  } else {
    throw new Error(`GET /patients/me failed: ${JSON.stringify(patMeData)}`);
  }

  // Verify directly in MongoDB
  const dbPatientUser = await mongoose.connection.db
    .collection("users")
    .findOne({ email: uniquePatientEmail });
  const dbPatient = await mongoose.connection.db
    .collection("patients")
    .findOne({ email: uniquePatientEmail });

  const patientPassed =
    dbPatientUser &&
    dbPatientUser.name === "Sarah Connor" &&
    dbPatient &&
    dbPatient.name === "Sarah Connor" &&
    dbPatient.mrn.startsWith("MRN-");

  console.log(`  [+] MongoDB Verification: User in DB? ${!!dbPatientUser} | Patient Profile in DB? ${!!dbPatient}`);
  console.log(`  => TEST 1 STATUS: ${patientPassed ? "PASSED (Stored & Verified)" : "FAILED"}\n`);
  results.push({ test: "Patient Registration & MongoDB Storage", status: patientPassed });

  // -------------------------------------------------------------
  // TEST 2: Register New Doctor (Dr. Vikram Patel, MD)
  // -------------------------------------------------------------
  console.log("--- TEST 2: Doctor Self-Registration ---");
  const uniqueDoctorEmail = `vikram.patel.${Date.now()}@metrohealth.eco`;
  const doctorPayload = {
    name: "Dr. Vikram Patel, MD",
    email: uniqueDoctorEmail,
    password: "password123",
    role: "Doctor",
    department: "Clinical Team",
    phone: "+1 (555) 888-9900",
  };

  const docRegRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doctorPayload),
  });
  const docRegData = await docRegRes.json();

  if (docRegData.success && docRegData.token) {
    console.log("  [+] POST /api/v1/auth/register succeeded for Doctor");
    console.log(`      User ID: ${docRegData.user.id}, Token issued`);
  } else {
    throw new Error(`Doctor registration failed: ${JSON.stringify(docRegData)}`);
  }

  // Simulate Doctor Dashboard accessing /doctors/me
  const docMeRes = await fetch(`${BASE_URL}/doctors/me`, {
    headers: { Authorization: `Bearer ${docRegData.token}` },
  });
  const docMeData = await docMeRes.json();

  if (docMeData.success && docMeData.doctor) {
    console.log("  [+] GET /api/v1/doctors/me auto-provisioned Doctor profile");
    console.log(`      Name:        ${docMeData.doctor.name}`);
    console.log(`      Employee ID: ${docMeData.doctor.employeeId}`);
    console.log(`      Specialty:   ${docMeData.doctor.specialization}`);
    console.log(`      Dept:        ${docMeData.doctor.department}`);
  } else {
    throw new Error(`GET /doctors/me failed: ${JSON.stringify(docMeData)}`);
  }

  // Verify directly in MongoDB
  const dbDoctorUser = await mongoose.connection.db
    .collection("users")
    .findOne({ email: uniqueDoctorEmail });
  const dbDoctor = await mongoose.connection.db
    .collection("doctors")
    .findOne({ email: uniqueDoctorEmail });

  const doctorPassed =
    dbDoctorUser &&
    dbDoctorUser.name === "Dr. Vikram Patel, MD" &&
    dbDoctor &&
    dbDoctor.name === "Dr. Vikram Patel, MD" &&
    dbDoctor.employeeId.startsWith("DOC-");

  console.log(`  [+] MongoDB Verification: User in DB? ${!!dbDoctorUser} | Doctor Profile in DB? ${!!dbDoctor}`);
  console.log(`  => TEST 2 STATUS: ${doctorPassed ? "PASSED (Stored & Verified)" : "FAILED"}\n`);
  results.push({ test: "Doctor Registration & MongoDB Storage", status: doctorPassed });

  // -------------------------------------------------------------
  // TEST 3: Admin View All Users (Live Directory)
  // -------------------------------------------------------------
  console.log("--- TEST 3: Admin User Directory Live Inspection ---");
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@metrohealth.eco", password: "password123" }),
  });
  const adminLoginData = await adminLoginRes.json();

  const usersListRes = await fetch(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${adminLoginData.token}` },
  });
  const usersListData = await usersListRes.json();

  const foundSarahInAdmin = usersListData.users.some((u) => u.email === uniquePatientEmail);
  const foundVikramInAdmin = usersListData.users.some((u) => u.email === uniqueDoctorEmail);

  console.log(`  [+] Total users in MongoDB: ${usersListData.users.length}`);
  console.log(`  [+] Sarah Connor visible in Admin directory? ${foundSarahInAdmin}`);
  console.log(`  [+] Dr. Vikram Patel visible in Admin directory? ${foundVikramInAdmin}`);
  const adminPassed = foundSarahInAdmin && foundVikramInAdmin;
  console.log(`  => TEST 3 STATUS: ${adminPassed ? "PASSED (Visible in Admin Portal)" : "FAILED"}\n`);
  results.push({ test: "Admin Directory Live Visibility", status: adminPassed });

  // -------------------------------------------------------------
  // TEST 4: Receptionist Patient Directory Live Inspection
  // -------------------------------------------------------------
  console.log("--- TEST 4: Receptionist Patient Directory Live Inspection ---");
  const recLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "clara.o@metrohealth.eco", password: "password123" }),
  });
  const recLoginData = await recLoginRes.json();

  const patientsListRes = await fetch(`${BASE_URL}/patients`, {
    headers: { Authorization: `Bearer ${recLoginData.token}` },
  });
  const patientsListData = await patientsListRes.json();

  const foundSarahInReception = patientsListData.patients.some((p) => p.email === uniquePatientEmail);

  console.log(`  [+] Total patients in MongoDB: ${patientsListData.patients.length}`);
  console.log(`  [+] Sarah Connor visible in Reception patient directory? ${foundSarahInReception}`);
  const recPassed = foundSarahInReception;
  console.log(`  => TEST 4 STATUS: ${recPassed ? "PASSED (Visible in Reception Portal)" : "FAILED"}\n`);
  results.push({ test: "Reception Patient Directory Visibility", status: recPassed });

  await mongoose.disconnect();

  console.log("===============================================================");
  console.log("                     SUMMARY OF RESULTS                        ");
  console.log("===============================================================");
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. [${r.status ? "PASS" : "FAIL"}] ${r.test}`);
  });
  console.log("===============================================================\n");
}

runTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
