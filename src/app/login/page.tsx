import { login, signup } from "@/actions/login.action";

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login} type="button">
        Log in
      </button>
      <button formAction={signup} type="button">
        Sign up
      </button>
    </form>
  );
}
