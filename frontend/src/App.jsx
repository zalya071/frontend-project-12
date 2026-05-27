import { Routes, Route, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';

const HomePage = () => (
  <div>
    <h1>Hexlet Chat</h1>
    <p>Главная страница чата</p>
    <Link to="/login">Войти</Link>
  </div>
);

const LoginPage = () => (
  <div>
    <h1>Войти</h1>

    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <Form>
        <div>
          <label htmlFor="username">Ваш ник</label>
          <Field
            id="username"
            name="username"
            type="text"
            placeholder="Ваш ник"
          />
        </div>

        <div>
          <label htmlFor="password">Пароль</label>
          <Field
            id="password"
            name="password"
            type="password"
            placeholder="Пароль"
          />
        </div>

        <button type="submit">Войти</button>
      </Form>
    </Formik>
  </div>
);

const NotFoundPage = () => (
  <div>
    <h1>404</h1>
    <p>Страница не найдена</p>
    <Link to="/">На главную</Link>
  </div>
);

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
