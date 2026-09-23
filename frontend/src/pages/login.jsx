import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "That email address looks incomplete.";
    if (!password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    setMessage(
      Object.keys(nextErrors).length === 0
        ? `Welcome back. ${rememberMe ? "We will remember this device." : "You will be signed out when you close the browser."}`
        : "",
    );
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
    if (errors.email) setErrors((current) => ({ ...current, email: "" }));
    setMessage("");
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    if (errors.password) setErrors((current) => ({ ...current, password: "" }));
    setMessage("");
  }

  const inputClass = (field) =>
    `h-14 w-full rounded-2xl border bg-white/70 px-4 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 ${errors[field] ? "border-rose-400 ring-4 ring-rose-500/10" : "border-slate-200"}`;

  return (
    <main className="min-h-screen bg-[#f6f7f3] text-slate-900 lg:p-5">
      <div className="mx-auto flex min-h-screen max-w-[1440px] overflow-hidden bg-[#f6f7f3] lg:min-h-[calc(100vh-2.5rem)] lg:rounded-[2rem] lg:shadow-[0_24px_80px_rgba(22,45,43,0.12)]">
        <section
          className="relative hidden w-[47%] overflow-hidden bg-[#123d3a] p-12 text-[#f4f3e9] lg:flex lg:flex-col lg:justify-between xl:p-16"
          aria-label="Northstar introduction"
        >
          <div className="absolute -right-28 -top-32 h-[34rem] w-[34rem] rounded-full border border-white/10" />
          <div className="absolute -bottom-60 -left-40 h-[34rem] w-[34rem] rounded-full border border-[#e2a66d]/25" />
          <div className="relative z-10 flex items-center gap-3 text-sm font-bold tracking-[0.2em]">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e2a66d] text-lg text-[#123d3a]">
              +
            </span>{" "}
            NORTHSTAR
          </div>
          <div className="relative z-10 max-w-xl">
            <p className="mb-5 text-xs font-bold tracking-[0.28em] text-[#e2a66d]">
              WORK WITH CLARITY
            </p>
            <h1 className="font-serif text-6xl leading-[0.98] tracking-[-0.04em] xl:text-7xl">
              Make room for{" "}
              <em className="font-normal text-[#e2a66d]">good work.</em>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-[#d0dfd9]">
              A calm, focused place for teams to think clearly, move quickly,
              and build what matters.
            </p>
            <div className="mt-12 flex max-w-md items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm">
              <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#e2a66d]/60">
                <div className="h-3 w-3 rounded-full bg-[#e2a66d] shadow-[0_0_0_8px_rgba(226,166,109,0.15)]" />
              </div>
              <div>
                <strong className="block text-sm">Everything in orbit.</strong>
                <span className="mt-1 block text-sm text-[#a9c4bc]">
                  Projects, people, and progress.
                </span>
              </div>
              <span className="ml-auto text-xl text-[#e2a66d]">-&gt;</span>
            </div>
          </div>
          <p className="relative z-10 text-xs tracking-wide text-[#a9c4bc]">
            (c) 2026 Northstar Labs
          </p>
        </section>

        <section className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3 text-sm font-bold tracking-[0.2em] text-[#123d3a]">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e2a66d]">
                  +
                </span>{" "}
                NORTHSTAR
              </div>
            </div>
            <div className="mb-9">
              <p className="mb-3 text-xs font-bold tracking-[0.25em] text-[#b0713e]">
                WELCOME BACK
              </p>
              <h2 className="font-serif text-5xl leading-none tracking-[-0.04em] text-[#123d3a]">
                Sign in to your{" "}
                <span className="text-[#b0713e]">workspace.</span>
              </h2>
              <p className="mt-4 text-[15px] text-slate-500">
                Pick up right where you left off.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-slate-700"
                  htmlFor="email"
                >
                  Email address
                </label>
                <input
                  className={inputClass("email")}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={handleEmailChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    className="mt-2 text-xs font-medium text-rose-600"
                    id="email-error"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <button
                    className="text-xs font-bold text-[#b0713e] transition hover:text-[#123d3a]"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  className={inputClass("password")}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                {errors.password && (
                  <p
                    className="mt-2 text-xs font-medium text-rose-600"
                    id="password-error"
                  >
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between gap-4 pt-1 text-xs text-slate-500">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    className="h-4 w-4 accent-[#123d3a]"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />{" "}
                  Remember me
                </label>
                <button
                  className="font-bold text-[#b0713e] transition hover:text-[#123d3a]"
                  type="button"
                  onClick={() =>
                    setMessage("Password reset instructions are on their way.")
                  }
                >
                  Forgot password?
                </button>
              </div>
              <button
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#123d3a] text-sm font-bold text-white shadow-lg shadow-[#123d3a]/20 transition hover:-translate-y-0.5 hover:bg-[#0d302e] focus:outline-none focus:ring-4 focus:ring-[#123d3a]/20"
                type="submit"
              >
                Continue{" "}
                <span
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  -&gt;
                </span>
              </button>
              {message && (
                <p
                  className="rounded-xl bg-[#e5f1eb] px-4 py-3 text-center text-sm font-medium text-[#24634e]"
                  role="status"
                >
                  {message}
                </p>
              )}
            </form>

            <div className="my-8 flex items-center gap-4 text-xs text-slate-400">
              <span className="h-px flex-1 bg-slate-200" /> or continue with{" "}
              <span className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold transition hover:border-slate-400 hover:shadow-sm"
                type="button"
                onClick={() =>
                  setMessage("Google sign-in is ready to connect.")
                }
              >
                <b className="text-base">G</b> Google
              </button>
              <button
                className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold transition hover:border-slate-400 hover:shadow-sm"
                type="button"
                onClick={() => setMessage("Apple sign-in is ready to connect.")}
              >
                <b className="text-base">A</b> Apple
              </button>
            </div>
            <p className="mt-8 text-center text-sm text-slate-500">
              New to Northstar?{" "}
              <button
                className="font-bold text-[#b0713e] hover:text-[#123d3a]"
                type="button"
                onClick={() =>
                  setMessage("Your workspace is just a few details away.")
                }
              >
                Create an account -&gt;
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
