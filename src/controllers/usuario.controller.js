import { db } from "../database";
const tabla="usuario"

const getAll = async (req, res) => {
  await db.all(`SELECT * from ${tabla} WHERE eliminado = 0`, (error,rows)=>{
    if (error) {
      res.status(500);
      res.send(error.message);
      throw error;
    }
    return res.send(rows)
  });
};

const getById = async (req, res) => {
  await db.all(`SELECT * from ${tabla} WHERE (id= ? ) and (eliminado=0)`, (error,rows)=>{
    if (error) {
      res.status(500);
      res.send(error.message);
      throw error;
    }
    if (rows.length === 0) return res.json({ message: "Elemento inexistente" });
    return res.send(rows)
  });
};

const getByUsername = async (req, res) => {
  console.log(req.params.username)
  await db.get(`SELECT * from ${tabla} WHERE (username= ? ) and (eliminado=0)`,req.params.username, (error,row)=>{
    if (error) {
      res.status(500);
      res.send(error.message);
      throw error;
    }
    if (!row) return res.json({ message: "Elemento inexistente" });
    return res.send(row)
  });
};

const set = async (req, res) => {
  if (req.body.nombre === undefined) {
    return res.status(400).json({ message: "Por favor completar el nombre del producto" });
  }
  db.run(
    `INSERT into ${tabla} SET ?`,
    req.body,
    (error,row) => {
      if (error) {
        res.status(500);
        res.send(error.message);
        throw error;
      }
      return res.json({ message: "Ítem añadido con éxito", row });
    }
  );
}

const update = async (req, res) => {
    if (req.params.id === undefined) {
      //No se debería ejecutar nunca esta línea :/
      return res.status(400).json({ message: "El ID es necesario" });
    }
    db.run(
      `UPDATE ${tabla} SET ? WHERE id = ?`,[req.body,req.params.id], function (error){
        if(error){
          res.status(500);
          res.send(error.message);
          throw error;
        }
        res.json({ message: "Ítem modificado con éxito", id: this.lastID });
  })
};


export const methods = {
  getAll,
  getById,
  set,
  update,
  getByUsername,
};
