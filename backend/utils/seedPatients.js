/**
 * CareOps AI - Development Database Seeder
 * Populates MongoDB with default users and patient profiles for browser verification.
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const User = require("../models/User");
const Patient = require("../models/Patient");
const { USER_ROLES } = require("../config/roles");

async function seed() {
  const uri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/careops";
  await mongoose.connect(uri);
  console.log("Connected to MongoDB for seeding...");

  // 1. Seed or update Users
  const usersToSeed = [
    {
      name: "Admin User",
      email: "admin@metrohealth.eco",
      password: "password123",
      role: USER_ROLES.ADMIN,
      department: "Administration",
    },
    {
      name: "Dr. Rahul",
      email: "dr.rahul@metrohealth.eco",
      password: "password123",
      role: USER_ROLES.DOCTOR,
      department: "Post-Surgical General & Acute Recovery",
    },
    {
      name: "Clara Oswald",
      email: "clara.o@metrohealth.eco",
      password: "password123",
      role: USER_ROLES.RECEPTIONIST,
      department: "Central Intake & Scheduling",
    },
    {
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      password: "password123",
      role: USER_ROLES.PATIENT,
      phone: "+1 (555) 349-8812",
      department: "Post-Surgical General",
    },
  ];

  const seededUsers = {};
  for (const u of usersToSeed) {
    let existing = await User.findOne({ email: u.email });
    if (!existing) {
      existing = new User(u);
      await existing.save();
      console.log(`Created user: ${u.email} (${u.role})`);
    } else {
      console.log(`User already exists: ${u.email}`);
    }
    seededUsers[u.role] = existing;
  }

  // 2. Seed Patient Profiles
  let rahulPatient = await Patient.findOne({ email: "rahul.sharma@email.com" });
  if (!rahulPatient) {
    rahulPatient = new Patient({
      userId: seededUsers[USER_ROLES.PATIENT]._id,
      mrn: "MRN-884920",
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+1 (555) 349-8812",
      dateOfBirth: "1984-06-12",
      gender: "Male",
      address: "124 Park Ave, Suite 410, New York, NY",
      bloodGroup: "O+",
      emergencyContact: "+1 (555) 349-8819",
      medicalSummary: "Post-op wound redness & low-grade fever after laparoscopic appendectomy",
      assignedDoctorId: seededUsers[USER_ROLES.DOCTOR]._id,
      assignedDoctorName: "Dr. Rahul",
      department: "Post-Surgical General & Acute Recovery",
      insuranceProvider: "BlueCross Premier PPO (#BC-992014)",
      insuranceStatus: "Active & Verified",
      status: "ACTIVE",
    });
    await rahulPatient.save();
    console.log("Created Patient profile: Rahul Sharma (MRN-884920)");
  } else {
    console.log("Patient profile already exists: Rahul Sharma");
  }

  // Seed second patient
  let ananyaPatient = await Patient.findOne({ email: "ananya.patel@email.com" });
  if (!ananyaPatient) {
    ananyaPatient = new Patient({
      mrn: "MRN-773194",
      name: "Ananya Patel",
      email: "ananya.patel@email.com",
      phone: "+1 (555) 672-9901",
      dateOfBirth: "1990-11-23",
      gender: "Female",
      address: "450 Lexington St, Boston, MA",
      bloodGroup: "O+",
      emergencyContact: "+1 (555) 672-9909",
      medicalSummary: "Post-cholecystectomy bile reflux evaluation and diet progression",
      assignedDoctorId: seededUsers[USER_ROLES.DOCTOR]._id,
      assignedDoctorName: "Dr. Rahul",
      department: "Post-Surgical General & Acute Recovery",
      insuranceProvider: "Aetna Choice POS II",
      insuranceStatus: "Active & Verified",
      status: "ACTIVE",
    });
    await ananyaPatient.save();
    console.log("Created Patient profile: Ananya Patel (MRN-773194)");
  }

  await mongoose.disconnect();
  console.log("Database seeded successfully!");
}

if (require.main === module) {
  seed().catch(console.error);
}

module.exports = seed;
