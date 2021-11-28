// Импортируем схему и модель из пакета mongoose
const { Schema, model, ObjectId } = require("mongoose");

// Создаём схему в которой будет хранится информация о полях сущности

const User = new Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  diskSpace: { type: Number, default: 1024 ** 3 * 10 },
  usedSpace: { type: Number, default: 0 },

  // Теперь связываем сущность пользователя и сущность файлов
  avatar: { type: String },
  files: [{ type: ObjectId, ref: "File" }],
});

module.exports = model("User", User);