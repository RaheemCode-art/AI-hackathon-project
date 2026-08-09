import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected for Seeding");

    const adminExists = await User.findOne({ email: 'admin@aifitness.com' });
    if (adminExists) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Super Admin',
      email: 'admin@aifitness.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log("Admin user created successfully! Email: admin@aifitness.com, Pass: admin123");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();