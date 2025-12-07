import { Request, Response } from "express";
import { userServices } from "./user.service";
import { ChildProcess } from "child_process";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUser(req.body);
    console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "Data Instered Successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      datails: err,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {

  const params = req.params.id;
  const userId = req.user?.id;
  const userRole = req.user?.role;
  // console.log(req.params.id);
  // console.log(req.user.id);
  try {
    const result = await userServices.getSingleuser(req.params.id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    else if (userId !== params && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't have access to this resource",
      });
    }
    else {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  // console.log(req.params.id);
  const { name, email } = req.body;
  try {
    const result = await userServices.updateUser(name, email, req.params.id!);

    const params = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    else if (userId !== params && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't have access to this resource",
      });
    }
    else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  // console.log(req.params.id);
  try {
    const result = await userServices.deleteUser(req.params.id!);
    const params = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    else if (userId !== params && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't have access to this resource",
      });
    }
    else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const userControllers = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};