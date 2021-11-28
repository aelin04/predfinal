// Тут будут содержатся маршруты которые обрабатывают регистрацю и автор.пользователя
const Route = require("express");
//Теперь вытащим модель пользователя
const User = require("../models/User");

//Создаём объект роутинга
const router = new Route();

const bcrypt = require("bcryptjs");

// Вытащим функции из express-validatora
const { check, validationResult } = require("express-validator");

// Тут мы создадим метод который будет делать пст запрос по url registration

router.post(
  "/registration",
  [
    check("email", "Uncorrect email").isEmail(),
    check(
      "password",
      "Password must be longer than 3 and shorter than 8"
    ).isLength({ min: 3, max: 8 }),
  ],
  async (req, res) => {
    try {
      // Теперь получаем результат валидации
      const errors = validationResult(req);
      //Проверим если есть ошибки в результате валидации
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Uncorrect request", errors });
      }
      const { email, password } = req.body;

      //Проверяем есть ли такой пользователь в базе данных
      //в функцию передадим емаил и пароль который пришёл с запроса

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: `User with email ${email} already exist` });
      }

      //Тут будем хэшировать пароль
      const hashPass = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashPass });

      await user.save();

      return res.json({ message: "User was created" });
    } catch (e) {
      console.log(e);
      res.send({ message: "Server Error" });
    }
  }
);

module.exports = router;