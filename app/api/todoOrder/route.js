import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/db";
export async function POST(request) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const todoOrderCollection = db.collection("todo_order");
    const { columns } = await request.json();
    const columnPromises = Object.keys(columns).map(async (status) => {
      await todoOrderCollection.updateOne(
        { status },
        { $set: { order: columns[status] } }
      );
    });

    await Promise.all(columnPromises);
    return NextResponse.json(
      { message: "Successful" },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
}

// import connectToDatabase from "../../../lib/db";

// export default async function handler(req, res) {
//   const { method } = req;
//   const dbConnection = await connectToDatabase();
//   const db = dbConnection.db;
//   const todoOrderCollection = db.collection("todo_order");

//   switch (method) {
//     case "POST":
//       const { columns } = req.body;
//       const columnPromises = Object.keys(columns).map(async (status) => {
//         await todoOrderCollection.updateOne(
//           { status },
//           { $set: { order: columns[status] } }
//         );
//       });
//       await Promise.all(columnPromises);
//       res.status(200).end();
//       break;

//     default:
//       res.setHeader("Allow", ["POST"]);
//       res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }
