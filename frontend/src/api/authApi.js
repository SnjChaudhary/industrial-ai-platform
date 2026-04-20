import { loginUser } from "../api/authApi";

const handleLogin = async () => {
  try {
    setLoading(true);

    const data = await loginUser({ email, password });

    login({
      token: data.token,
      role: data.role,
    });

    navigate("/");
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};