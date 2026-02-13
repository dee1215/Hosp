import { render, screen } from "@testing-library/react";

jest.mock(
  "react-router-dom",
  () => ({
    useNavigate: () => jest.fn()
  }),
  { virtual: true }
);

test("renders hospital system login", () => {
  const AuthProvider = require("./context/AuthContext").default;
  const Login = require("./pages/Login").default;

  render(
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
  expect(screen.getByText(/hospital system/i)).toBeInTheDocument();
});
