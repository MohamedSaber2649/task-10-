import express from "express";
import { createDB } from "./db.js";
const app = express();
const db = createDB();
app.use(express.json());
app.use((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});
app.get("/users", async (req, res) => {
  // get all users from db
  const users = await db.getAll("users");
  // send as json
  res.json({
    data: users,
  });
});
app.get("/users/:user_id", async (req, res) => {
  // get user by id from database
  const user = await db.getById("users", req.params.user_id);
  //send as json
  res.json({
    data: user,
  });
});
app.post("/users", async (req, res) => {
  // get data from req body
  const userData = req.body;
  // add to database
  await db.create("users", userData);

  // return response
  res.status(201).json({
    message: "user created successfully",
  });
});
app.patch("/users/:user_id", async (req, res) => {
  // get id from params
  const id = req.params.user_id;
  // check database
  const user = await db.getById("users", id);
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  // get data from body
  const updateData = req.body;
  // update in database
  await db.update("users", id, updateData);
  const newUser = await db.getById("users", id);
  // return res
  return res.status(200).json({
    message: "user updated successfully",
    data: newUser,
  });
});
app.delete("/users/:user_id", async (req, res) => {
  // get id from params
  const id = req.params.user_id;
  // check if in database
  const user = await db.getById("users", id);
  // if present delete -> return res
  if (user) {
    await db.delete("users", id);
    return res.status(204).json({
      message: "user deleted successfully",
    });
  } else {
    // if not present -> 404
    return res.status(404).json({
      message: "user not found",
    });
  }
});
app.get("/authors", async (req, res) => {
  // get all Author
  const authors = await db.getAll("authors")
  // searching authors by name
  // get the name from query
  const { search } = req.query
  if (search) {
    const filterData = authors.filter((author) =>
      author.name.toUpperCase().startsWith(search.toUpperCase())
    )
    return res.status(200).json({ data: filterData })
  }
  // response data to json
  res.status(200).json({ data: authors })
})
// get one author
app.get("/authors/:author_id", async (req, res) => {
  // get author id from params
  const { author_id } = req.params;
  const Author_data = await db.getById("authors", author_id)
  //check if id found or not
  if (!Author_data) {
    return res.status(404).json({ massage: "Can't found the Author_id" })
  }
  // response data to json
  return res.status(200).json({
    data: Author_data
  })
})
// create a New Author
app.post("/authors", async (req, res) => {
  // get data from body request
  const newAuthor = req.body;
  //add to database
  await db.create("authors", newAuthor)
  res.status(201).json("Author is add Successfully")
})
// Update a specific Author
app.put("/authors/:author_id", async (req, res) => {
  // get id from params
  const { author_id } = req.params
  // check if auhtor found or not
  const Find = await db.getById("authors", author_id)
  if (!Find) {
    return res.status(404).json({ massage: "Author not Found To Update it" })
  }
  // get Newdata from body
  const newData = req.body
  // Update in database
  await db.update("authors", author_id, newData)
  res.status(200).json({ massage: "Author is Update Successfully", data: newData })
})
// Delete a specific Author by id
app.delete("/authors/:Author_id", async (req, res) => {
  // get the id of author from the params
  const { Author_id } = req.params
  // check if id Found or not
  const CheckId = await db.getById("authors", Author_id);
  if (!CheckId) {
    return res.status(404).json({ massage: "Can't Found the Author To Delete it" })
  }
  // delete from database
  await db.delete("authors", Author_id);
  // return the response
  return res.status(204) // can't add .json({message:" "}) because status 204 can't response any thing in body
})
app.listen(3000, () => {
  console.log("listening on port 3000");
});
