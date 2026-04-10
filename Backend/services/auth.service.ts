import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { RegisterInput, LoginInput, BillingAddressInput } from "../utils/validators";
import prisma from "../utils/prisma";

export const authService = {
  async register(data: RegisterInput) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        passwordHash,
        plan: data.plan,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        plan: user.plan,
      },
      token,
    };
  },

  async login(data: LoginInput) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(
      data.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        plan: user.plan,
      },
      token,
    };
  },

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        billingAddress: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      plan: user.plan,
      billingAddress: user.billingAddress,
    };
  },

  async addBillingAddress(userId: string, data: BillingAddressInput) {
    // Check if billing address already exists
    const existingAddress = await prisma.billingAddress.findUnique({
      where: { userId },
    });

    if (existingAddress) {
      // Update existing address
      return await prisma.billingAddress.update({
        where: { userId },
        data: {
          streetAddress: data.streetAddress,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        },
      });
    }

    // Create new billing address
    return await prisma.billingAddress.create({
      data: {
        userId,
        streetAddress: data.streetAddress,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
      },
    });
  },

  async getBillingAddress(userId: string) {
    const billingAddress = await prisma.billingAddress.findUnique({
      where: { userId },
    });

    if (!billingAddress) {
      throw new Error("Billing address not found");
    }

    return billingAddress;
  },
};