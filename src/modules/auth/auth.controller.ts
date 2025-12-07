import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // console.log(email, password);

  try {
    const result = await authServices.signinUser(email, password);
    if (result === null) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // console.log(result.rows[0]);
    res.status(200).json({
      success: true,
      message: "login successful",
      data: result,
      // console.log({result}),
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  signinUser,
};