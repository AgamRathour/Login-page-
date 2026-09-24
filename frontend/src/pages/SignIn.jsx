import { useEffect, useRef, useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignIn({ onGoToLogin, onSignedIn, onGoogleSignIn }) {
  const [step, setStep] = useState("entry");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [codeMethod, setCodeMethod] = useState("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const codeInputs = useRef([]);

  useEffect(() => {
    if (step === "code") codeInputs.current[0]?.focus();
  }, [step]);

  const inputClass = (hasError = false) =>
    `h-14 w-full rounded-2xl border bg-white/70 px-4 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 ${hasError ? "border-rose-400 ring-4 ring-rose-500/10" : "border-slate-200"}`;

  function goBack() {
    setError("");
    setMessage("");
    if (step === "create-password") {
      setStep("code");
    } else if (step === "code") {
      setStep(codeMethod);
    } else {
      setStep("entry");
    }
  }

  function continueWithEmail(event) {
    event.preventDefault();
    if (!emailPattern.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setMessage("A 6-digit verification code was sent to your email.");
    setCodeMethod("email");
    setCode(["", "", "", "", "", ""]);
    setStep("code");
  }

  function handleCodeChange(index, value) {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setCode((current) =>
        current.map((digit, item) => (item === index ? "" : digit)),
      );
      return;
    }
    const nextCode = [...code];
    digits
      .slice(0, 6 - index)
      .split("")
      .forEach((digit, offset) => {
        nextCode[index + offset] = digit;
      });
    setCode(nextCode);
    codeInputs.current[Math.min(index + digits.length, 5)]?.focus();
  }

  function handleCodeKeyDown(index, event) {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  }

  function verifyCode(event) {
    event.preventDefault();
    if (code.some((digit) => !digit)) {
      setError("Enter all 6 digits to continue.");
      return;
    }
    setError("");
    setMessage("");
    setStep("create-password");
  }

  function continueWithGoogle() {
    if (onGoogleSignIn) {
      onGoogleSignIn();
      return;
    }
    setMessage("Google sign-in is ready to connect.");
  }

  function sendPhoneCode(event) {
    event.preventDefault();
    if (!phone.trim()) {
      setError("Enter your phone number.");
      return;
    }
    handlePhoneOtp(phone);
    setError("");
    setMessage("A 6-digit verification code was sent to your phone.");
    setCodeMethod("phone");
    setCode(["", "", "", "", "", ""]);
    setStep("code");
  }

  // TODO: wire up OTP when phone authentication is available.
  function handlePhoneOtp(phoneNumber) {
    void phoneNumber;
  }

  function createAccount(event) {
    event.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // TODO: connect to backend
    onSignedIn?.(
      codeMethod === "email"
        ? { method: "email", email, password }
        : { method: "phone", phone, password },
    );
  }

  function renderStep() {
    if (step === "entry") {
      return (
        <div className="space-y-3">
          <button
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#123d3a] text-sm font-bold text-white shadow-lg shadow-[#123d3a]/20 transition hover:-translate-y-0.5 hover:bg-[#0d302e] focus:outline-none focus:ring-4 focus:ring-[#123d3a]/20"
            type="button"
            onClick={() => setStep("email")}
          >
            Continue with email{" "}
            <span className="ml-3" aria-hidden="true">
              -&gt;
            </span>
          </button>
          <button
            className="flex h-14 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold transition hover:border-slate-400 hover:shadow-sm"
            type="button"
            onClick={() => setStep("phone")}
          >
            Continue with phone number
          </button>
        </div>
      );
    }

    if (step === "phone") {
      return (
        <form className="space-y-5" onSubmit={sendPhoneCode} noValidate>
          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="phone"
            >
              Phone number
            </label>
            <input
              className={inputClass(Boolean(error))}
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 555 123 4567"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
          <button
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#123d3a] text-sm font-bold text-white shadow-lg shadow-[#123d3a]/20 transition hover:-translate-y-0.5 hover:bg-[#0d302e] focus:outline-none focus:ring-4 focus:ring-[#123d3a]/20"
            type="submit"
          >
            Send code{" "}
            <span className="ml-3" aria-hidden="true">
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
      );
    }

    if (step === "email") {
      return (
        <form className="space-y-5" onSubmit={continueWithEmail} noValidate>
          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="sign-in-email"
            >
              Email address
            </label>
            <input
              className={inputClass(Boolean(error))}
              id="sign-in-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
                setMessage("");
              }}
              aria-invalid={Boolean(error)}
            />
            {error && (
              <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>
            )}
          </div>
          <button
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#123d3a] text-sm font-bold text-white shadow-lg shadow-[#123d3a]/20 transition hover:-translate-y-0.5 hover:bg-[#0d302e] focus:outline-none focus:ring-4 focus:ring-[#123d3a]/20"
            type="submit"
          >
            Email me a code{" "}
            <span className="ml-3" aria-hidden="true">
              -&gt;
            </span>
          </button>
          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold transition hover:border-slate-400 hover:shadow-sm"
            type="button"
            onClick={continueWithGoogle}
          >
            <b className="text-base">G</b> Continue with Google
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
      );
    }

    if (step === "create-password") {
      const identifier = codeMethod === "email" ? email : phone;
      return (
        <form className="space-y-5" onSubmit={createAccount} noValidate>
          <p className="text-[15px] text-slate-500">
            Create a password for{" "}
            <strong className="text-slate-700">{identifier}</strong>.
          </p>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                className="text-sm font-semibold text-slate-700"
                htmlFor="create-password"
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
              className={inputClass(Boolean(error))}
              id="create-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                className="text-sm font-semibold text-slate-700"
                htmlFor="confirm-password"
              >
                Confirm password
              </label>
              <button
                className="text-xs font-bold text-[#b0713e] transition hover:text-[#123d3a]"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              className={inputClass(Boolean(error))}
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setError("");
              }}
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500">
            <input
              className="h-4 w-4 accent-[#123d3a]"
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />{" "}
            Remember me
          </label>
          {error && (
            <p className="text-xs font-medium text-rose-600">{error}</p>
          )}
          <button
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#123d3a] text-sm font-bold text-white shadow-lg shadow-[#123d3a]/20 transition hover:-translate-y-0.5 hover:bg-[#0d302e] focus:outline-none focus:ring-4 focus:ring-[#123d3a]/20"
            type="submit"
          >
            Create account{" "}
            <span className="ml-3" aria-hidden="true">
              -&gt;
            </span>
          </button>
        </form>
      );
    }

    return (
      <form className="space-y-5" onSubmit={verifyCode} noValidate>
        <p className="text-[15px] text-slate-500">
          Enter the code we sent to{" "}
          <strong className="text-slate-700">
            {codeMethod === "email" ? email : phone}
          </strong>
          .
        </p>
        <div className="flex justify-between gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                codeInputs.current[index] = element;
              }}
              className={`${inputClass(Boolean(error))} w-12 px-0 text-center text-lg font-bold sm:w-14`}
              aria-label={`Verification digit ${index + 1}`}
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(event) => handleCodeChange(index, event.target.value)}
              onKeyDown={(event) => handleCodeKeyDown(index, event)}
              onPaste={(event) => {
                event.preventDefault();
                handleCodeChange(index, event.clipboardData.getData("text"));
              }}
            />
          ))}
        </div>
        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
        <button
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#123d3a] text-sm font-bold text-white shadow-lg shadow-[#123d3a]/20 transition hover:-translate-y-0.5 hover:bg-[#0d302e] focus:outline-none focus:ring-4 focus:ring-[#123d3a]/20"
          type="submit"
        >
          Verify {codeMethod === "email" ? "email" : "phone"}{" "}
          <span className="ml-3" aria-hidden="true">
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
    );
  }

  const heading =
    step === "entry"
      ? "Create your workspace."
      : step === "code"
        ? "Check your email."
        : step === "create-password"
          ? "Set your password."
          : "Create your account.";
  const subtitle =
    step === "entry"
      ? "Choose how you would like to get started."
      : step === "code"
        ? "One quick step and you are in."
        : step === "create-password"
          ? "Choose a password to finish creating your account."
          : "Use your email or phone number to continue.";

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
              {step !== "entry" && (
                <button
                  className="mb-6 text-sm font-bold text-[#b0713e] transition hover:text-[#123d3a]"
                  type="button"
                  onClick={goBack}
                >
                  &lt;- Back
                </button>
              )}
              <p className="mb-3 text-xs font-bold tracking-[0.25em] text-[#b0713e]">
                WELCOME TO NORTHSTAR
              </p>
              <h2 className="font-serif text-5xl leading-none tracking-[-0.04em] text-[#123d3a]">
                {heading}
              </h2>
              <p className="mt-4 text-[15px] text-slate-500">{subtitle}</p>
            </div>
            {renderStep()}
            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                className="font-bold text-[#b0713e] hover:text-[#123d3a]"
                type="button"
                onClick={onGoToLogin}
              >
                Sign in
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default SignIn;
