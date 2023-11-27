import { Request, Response } from "express";
import { Octokit } from "@octokit/rest";

const mongoose = require("mongoose");

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

const mdFilesSchema = new mongoose.Schema({
  eip: { type: String, unique: true },
  title: { type: String },
  author: { type: String },
  status: { type: String },
  type: { type: String },
  category: { type: String },
  created: { type: String },
});

const EIPMdFiles =
  mongoose.models.EipMdFiles || mongoose.model("EipMdFiles", mdFilesSchema);
const ERCMdFiles =
  mongoose.models.ErcMdFiles || mongoose.model("ErcMdFiles", mdFilesSchema);

// export default async (req: Request, res: Response) => {
// const EIPResult = await EIPMdFiles.aggregate([
//   {
//     $sort: {
//       _id: 1, // Sort by status in ascending order
//     },
//   },
// ]).catch((error: any) => {
//   console.error("Error retrieving EIPs:", error);
//   res.status(500).json({ error: "Internal server error" });
// });

//   const ERCResult = await ERCMdFiles.aggregate([
//     {
//       $sort: {
//         _id: 1, // Sort by status in ascending order
//       },
//     },
//   ]).catch((error: any) => {
//     console.error("Error retrieving EIPs:", error);
//     res.status(500).json({ error: "Internal server error" });
//   });

//   res.json({ eip: EIPResult, erc: ERCResult });
// };

export default async (req: Request, res: Response) => {
  try {
    const eipResult = await EIPMdFiles.aggregate([
      {
        $match: {
          category: { $nin: ["ERC", "ERCs"] },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const ercResult = await ERCMdFiles.aggregate([
      {
        $sort: {
          _id: 1, // Sort by status in ascending order
        },
      },
    ]);

    res.json({ eip: eipResult, erc: ercResult });
  } catch (error: any) {
    console.error("Error retrieving EIPs:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
