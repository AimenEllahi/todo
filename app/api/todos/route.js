import connectToDatabase from "../../../lib/db";
import { NextResponse } from "next/server";
import { URL } from "url";

async function updateTodoOrder(todoOrderCollection, status, order) {
  await todoOrderCollection.updateOne({ status }, { $set: { order } });
}
async function createInitialTodoOrder(todoOrderCollection) {
  const initialStatusOrder = [
      { status: 'Todo', order: [] },
      { status: 'In Progress', order: [] },
      { status: 'Done', order: [] },
  ];

  for (const statusOrder of initialStatusOrder) {
      const existingOrder = await todoOrderCollection.findOne({ status: statusOrder.status });
      if (!existingOrder) {
          await todoOrderCollection.insertOne(statusOrder);
      }
  }
}
export async function GET(request) {
  const dbConnection = await connectToDatabase();
  const db = dbConnection.db;
  const todosCollection = db.collection("todos");
  const todoOrderCollection = db.collection("todo_order");

  const todos = await todosCollection.find({}).toArray();
  const todoOrder = await todoOrderCollection.find({}).toArray();
  const sortedTodos = [];

  for (const orderItem of todoOrder) {
    const orderedTodos = orderItem.order.map((id) =>
      todos.find((todo) => todo.id === id)
    );
    sortedTodos.push(...orderedTodos);
  }
  return NextResponse.json(sortedTodos, { status: 200 });
}

export async function POST(request) {
  const dbConnection = await connectToDatabase();
  const db = dbConnection.db;
  const todosCollection = db.collection("todos");
  const todoOrderCollection = db.collection("todo_order");

  const todosCount = await todosCollection.countDocuments();
  if (todosCount === 0) {
    await createInitialTodoOrder(todoOrderCollection);
  }
  const newTodo = await request.json();
  const result = await todosCollection.insertOne(newTodo);

  return NextResponse.json(newTodo, { status: 201 });
}

export async function PUT(request) {
  const dbConnection = await connectToDatabase();
  const db = dbConnection.db;
  const todosCollection = db.collection("todos");

  const { id, _id, ...updatedTodo } = await request.json();
  await todosCollection.updateOne({ id }, { $set: updatedTodo });

  return NextResponse.json(updatedTodo, { status: 200 });
}

export async function DELETE(request, context) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const todosCollection = db.collection("todos");
    const parsedUrl = new URL(request.url);
    const searchParams = parsedUrl.searchParams;
    const todoId = searchParams.get("todoId");

    await todosCollection.deleteOne({ id: todoId });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// export default function handler(req, res) {
//   const { method } = req;

//   console.log("Method is", method);

//   switch (method) {
//     case "GET":
//       return getHandler(req, res);
//     case "POST":
//       return postHandler(req, res);
//     case "PUT":
//       return putHandler(req, res);
//     case "DELETE":
//       return deleteHandler(req, res);
//     default:
//       res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
//       res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }

// export default async function handler(req, res) {
//   const { method } = req;
//   const dbConnection = await connectToDatabase();
//   const db = dbConnection.db;
//   const todosCollection = db.collection("todos");
//   const todoOrderCollection = db.collection("todo_order");
//   async function createInitialTodoOrder(todoOrderCollection) {
//     const initialStatusOrder = [
//       { status: "Todo", order: [] },
//       { status: "In Progress", order: [] },
//       { status: "Done", order: [] },
//     ];

//     for (const statusOrder of initialStatusOrder) {
//       const existingOrder = await todoOrderCollection.findOne({
//         status: statusOrder.status,
//       });
//       if (!existingOrder) {
//         await todoOrderCollection.insertOne(statusOrder);
//       }
//     }
//   }

//   switch (method) {
//     case "GET":
//       const todos = await todosCollection.find({}).toArray();
//       const todoOrder = await todoOrderCollection.find({}).toArray();
//       const sortedTodos = [];

//       for (const orderItem of todoOrder) {
//         const orderedTodos = orderItem.order.map((id) =>
//           todos.find((todo) => todo.id === id)
//         );
//         sortedTodos.push(...orderedTodos);
//       }

//       res.status(200).json(sortedTodos);
//       break;

//     case "POST":
//       const todosCount = await todosCollection.countDocuments();
//       if (todosCount === 0) {
//         await createInitialTodoOrder(todoOrderCollection);
//       }
//       const newTodo = req.body;
//       const result = await todosCollection.insertOne(newTodo);

//       res.status(201).json(newTodo);
//       break;

//     case "PUT":
//       const { id, _id, ...updatedTodo } = req.body;
//       await todosCollection.updateOne({ id }, { $set: updatedTodo });
//       res.status(200).json(updatedTodo);
//       break;

//     case "DELETE":
//       const { todoId } = req.query;
//       await todosCollection.deleteOne({ id: todoId });
//       res.status(204).end();
//       break;

//     default:
//       res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
//       res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }
