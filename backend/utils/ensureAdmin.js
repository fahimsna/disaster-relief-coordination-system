const bcrypt = require("bcryptjs");
const User = require("../models/User");

const ensureAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME?.trim() || "System Administrator";

    if (!adminEmail || !adminPassword) {
      console.warn(
        "ADMIN_EMAIL or ADMIN_PASSWORD is missing. Admin auto-creation skipped.",
      );
      return;
    }

    if (adminPassword.length < 6) {
      throw new Error("ADMIN_PASSWORD must contain at least 6 characters.");
    }

    let admin = await User.findOne({
      email: adminEmail,
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log(`Production admin created: ${adminEmail}`);
      return;
    }

    let changed = false;

    if (admin.role !== "admin") {
      admin.role = "admin";
      changed = true;
    }

    if (admin.name !== adminName) {
      admin.name = adminName;
      changed = true;
    }

    const passwordMatches = await bcrypt.compare(adminPassword, admin.password);

    if (!passwordMatches) {
      admin.password = adminPassword;
      changed = true;
    }

    if (changed) {
      await admin.save();
      console.log(`Production admin account synchronized: ${adminEmail}`);
    } else {
      console.log(`Production admin verified: ${adminEmail}`);
    }
  } catch (error) {
    console.error("Admin initialization failed:", error);
    throw error;
  }
};

module.exports = ensureAdmin;
