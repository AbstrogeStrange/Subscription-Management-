import { Request, Response } from "express";
import { registerSchema, loginSchema, billingAddressSchema } from "../utils/validators";
import { authService } from "../services/auth.service";
import { ZodError } from "zod";

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await authService.register(validatedData);

      return res.status(201).json({
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues,
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);

      return res.status(200).json({
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues,
        });
      }

      if (error instanceof Error) {
        return res.status(401).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const user = await authService.getUserById(userId);

      return res.status(200).json({
        message: "Profile fetched successfully",
        data: user,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  async addBillingAddress(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const validatedData = billingAddressSchema.parse(req.body);
      const billingAddress = await authService.addBillingAddress(userId, validatedData);

      return res.status(201).json({
        message: "Billing address added/updated successfully",
        data: billingAddress,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues,
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  async getBillingAddress(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const billingAddress = await authService.getBillingAddress(userId);

      return res.status(200).json({
        message: "Billing address fetched successfully",
        data: billingAddress,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};