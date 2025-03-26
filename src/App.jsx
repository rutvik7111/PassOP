import { useState, useEffect } from "react";
import Footer from "./components/Footer"
import Main from "./components/Main"
import Navbar from "./components/Navbar"
import { FiLogIn } from "react-icons/fi";
import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/clerk-react";
import { ThemeContext } from "./themeContext";

function App() {
  const [theme, setTheme] = useState(null)
  const { getToken, isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      (async function () {
        const token = await getToken()
        const response = await fetch(`${process.env.BASE_URL}/api/get-theme`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const { theme } = await response.json()
        setTheme(theme)
      })();
    } else if (isLoaded && !isSignedIn) {
      setTheme("light")
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.remove("hidden")
      theme === "dark" ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");
    }
  }, [theme])

  useEffect(() => {
    if (theme && isLoaded && isSignedIn) {
      (async function () {
        const token = await getToken()
        const response = await fetch(`${process.env.BASE_URL}/api/set-theme`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ theme }),
        });
      })();
    }
  }, [theme, isLoaded, isSignedIn])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`flex flex-col justify-between min-h-screen relative`}>
        <div>
          <Navbar />

          <div>
            <SignedOut>
              <div className="mt-10 flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-xl max-w-sm mx-auto">
                <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>

                <p className="text-gray-600 text-sm mt-2 text-center">
                  Sign in to continue and access exclusive features.
                </p>

                <SignInButton>
                  <button className="relative flex items-center gap-2 px-7 py-2 mt-5 text-white font-semibold rounded-full bg-gradient-to-r from-[#00c951] to-[#00a843] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                    <FiLogIn size={20} />
                    Sign In
                    <span className="absolute inset-0 rounded-full bg-white opacity-10"></span>
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
            <SignedIn>
              <Main />
            </SignedIn>
          </div>

        </div>
        <div
          className={"absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] bg-green-50 dark:bg-slate-900"}>
        </div>
        <Footer />
      </div>
    </ThemeContext.Provider >
  )
}

export default App
