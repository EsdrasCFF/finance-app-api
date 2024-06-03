import fastify from "fastify";

const app = fastify();

app.get("/", async (req, res) => {
  return res.code(200).send({
    message: "Success",
  });
});

app.listen({ port: 3333 }, () => console.log("Server is running"));
