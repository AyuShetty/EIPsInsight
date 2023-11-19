import { Request, Response } from "express";
import { Octokit } from "@octokit/rest";

const mongoose = require("mongoose");

const accessToken = process.env.ACCESS_TOKEN;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error: any) => {
    console.error("Error connecting to the database:", error.message);
  });

// Define the StatusChange schema
const statusChangeSchema = new mongoose.Schema({
  eip: {
    type: String,
    required: true,
  },
  fromStatus: {
    type: String,
    required: true,
  },
  toStatus: {
    type: String,
    required: true,
  },
  changeDate: {
    type: Date,
    required: true,
  },
  changedDay: {
    type: Number,
    required: true,
  },
  changedMonth: {
    type: Number,
    required: true,
  },
  changedYear: {
    type: Number,
    required: true,
  },
});
const EipStatusChange =
  mongoose.models.EipStatusChange ||
  mongoose.model("EipStatusChange", statusChangeSchema, "eipstatuschanges");

const ErcStatusChange =
  mongoose.models.ErcStatusChange ||
  mongoose.model("ErcStatusChange", statusChangeSchema, "ercstatuschanges");

export default async (req: Request, res: Response) => {
  const parts = req.url.split("/");
  const year = parseInt(parts[4]);
  const month = parseInt(parts[5]);
  try {
    // Convert year and month to numbers
    const yearNum = year;
    const monthNum = month;

    // Get the start and end dates of the specified month and year
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0);

    // Query the database for status changes within the specified date range
    const EipstatusChanges = await EipStatusChange.aggregate([
      { $match: { changeDate: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: "$toStatus",
          count: { $sum: 1 },
          statusChanges: { $push: "$$ROOT" },
        },
      },
    ]);

    const ErcstatusChanges = await ErcStatusChange.aggregate([
      { $match: { changeDate: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: "$toStatus",
          count: { $sum: 1 },
          statusChanges: { $push: "$$ROOT" },
        },
      },
    ]);

    res.json({ eip: EipstatusChanges, erc: ErcstatusChanges });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
    console.log(error);
  }
};
