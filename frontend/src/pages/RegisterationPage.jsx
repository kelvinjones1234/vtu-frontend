import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthenticationContext";
import { Link } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import simag from "../assets/vtu3.png";
import logo from "../assets/4.svg";
import SubmitButton from "../components/SubmitButton";
import LeftSide from "../components/LeftSide";

const RegistrationPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser, registerErrors, setRegisterErrors } =
    useContext(AuthContext);
  const { setLoading } = useContext(GeneralContext);

  useEffect(() => {
    return () => setRegisterErrors({});
  }, []);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
    transaction_pin: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      username: formData.username.toLowerCase(),
    };
    if (validInputs()) {
      setLoading(true);
      registerUser(updatedFormData).finally(() => {
        setLoading(false);
      });
    }
  };

  const validInputs = () => {
    const newError = {};

    if (!formData.username) {
      newError.usernameError = "Please fill in your username";
    }

    if (!formData.password) {
      newError.passwordError = "Please fill in your password";
    } else if (formData.password.length < 8) {
      newError.passwordError = "Your password must be at least 8 characters";
    } else if (formData.password !== formData.confirm_password) {
      newError.passwordError = "Passwords do not match";
    }

    if (!formData.transaction_pin) {
      newError.transaction_pinError = "Please fill in your transaction pin";
    } else if (
      formData.transaction_pin.length !== 4 ||
      isNaN(formData.transaction_pin)
    ) {
      newError.transaction_pinError =
        "Transaction pin must be exactly four digits";
    }

    if (!formData.first_name) {
      newError.first_nameError = "Please fill in your first name";
    }

    if (!formData.last_name) {
      newError.last_nameError = "Please fill in your last name";
    }

    if (!formData.phone_number) {
      newError.phone_numberError = "Please fill in your phone number";
    } else if (
      formData.phone_number.length !== 11 ||
      isNaN(formData.phone_number)
    ) {
      newError.phone_numberError =
        "Phone number must be exactly 11 digits and numeric";
    }

    if (!formData.email) {
      newError.emailError = "Please fill in your email";
    }

    setErrorMessage(newError);
    return Object.keys(newError).length === 0;
  };

  useEffect(() => {
    if (registerErrors) {
      setErrorMessage((prev) => ({
        ...prev,
        ...registerErrors,
      }));
    }
  }, [registerErrors]);

  useEffect(() => {
    if (Object.values(errorMessage).some((error) => error)) {
      const errorContainer = document.querySelector(".error-container");
      if (errorContainer) {
        errorContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        window.scrollBy({ top: -190, behavior: "smooth" }); // Adjust the scroll position by -100 pixels
      }
    }
  }, [errorMessage]);

  return (
    <div className="min-h-screen bg-dark-custom-gradient font-body_two z-5 pb-[3rem]">
      <div className="fixed inset-0 bg-bg_one bg-contain md:bg-cover bg-center bg-no-repeat"></div>

      <header
        className={`fixed top-0 w-full px-4 py-[.6rem] md:px-24 flex justify-between items-center transition-colors duration-300 ${
          isScrolled ? "bg-gray-900 bg-opacity-95 z-[100]" : "bg-transparent"
        }`}
      >
        <div className="flex items-center">
          {/* <img src={logo} alt="" className="h-7 mb-1/2" /> */}
          <Link to={"/"}>
            <div className="logo font-heading_one text-transparent bg-clip-text pr-2 text-[.8rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 border-white">
              MaduConnect
            </div>
          </Link>
        </div>
        <div className="hidden sm:block text-gray-300">
          Already have an account?
          <Link
            to="/authentication/login"
            className="ml-1 text-link font-bold hover:text-sky-400 transition duration-300 ease-in-out"
          >
            Log in
          </Link>
        </div>
      </header>

      <main className="pt-[5.2rem] px-4 md:px-16 lg:px-32">
        <div className="max-w-6xl mx-auto sm:flex justify-between items-start">
          <LeftSide />
          <div className="sm:w-1/2 max-w-md mx-auto sm:mx-0">
            <div className="mb-8">
              <h1 className="font-bold text-4xl text-gray-300 font-heading_two mb-2">
                Sign up with{" "}
                <span className="bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 text-transparent bg-clip-text">
                  MaduConnect
                </span>
              </h1>
              <p className="text-gray-300 text-lg">
                Create a MaduConnect account for free
              </p>
            </div>

            {Object.values(errorMessage).some((error) => error) && (
              <div className="mb-4 p-4 rounded-lg shadow-md flex items-start bg-red-50 border-l-4 border-red-500 error-container">
                <div className="flex-shrink-0 mr-3 mt-0.5">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-red-800">Error</p>
                  <ul className="mt-1 text-sm text-red-700">
                    {Object.values(errorMessage).map(
                      (error, index) => error && <li key={index}>{error}</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    name: "first_name",
                    placeholder: "First Name",
                  },
                  {
                    name: "last_name",
                    placeholder: "Last Name",
                  },
                  {
                    name: "username",
                    placeholder: "Username",
                  },
                  {
                    name: "email",
                    placeholder: "Email address",
                    type: "email",
                  },
                  {
                    name: "phone_number",
                    placeholder: "Phone Number",
                    type: "tel",
                  },
                  {
                    name: "transaction_pin",
                    placeholder: "4-Digit Transaction PIN",
                  },
                  {
                    name: "password",
                    placeholder: "Password",
                    type: showPassword ? "text" : "password",
                    toggleShow: () => setShowPassword(!showPassword),
                    show: showPassword,
                  },
                  {
                    name: "confirm_password",
                    placeholder: "Confirm Password",
                    type: showPassword ? "text" : "password",
                  },
                ].map((field) => (
                  <div key={field.name} className="relative">
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full text-white py-3 px-4 bg-[#18202F] text-lg rounded-xl outline-none border border-gray-700 hover:border-gray-500 focus:border-link transition duration-300 ease-in-out"
                    />

                    {field.toggleShow && (
                      <button
                        type="button"
                        onClick={field.toggleShow}
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"
                      >
                        {field.show ? "Hide" : "Show"}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="relative">
                <p className="text-center text-gray-300 text-sm py-5">
                  By signing up, you agree to our{" "}
                  <Link
                    to="/terms-and-conditions"
                    className="underline text-link hover:text-sky-400"
                  >
                    terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-and-policy"
                    className="underline text-link hover:text-sky-400"
                  >
                    privacy policy
                  </Link>
                </p>

                <SubmitButton label="Create Account" />
              </div>
            </form>

            <p className="relative text-center text-gray-300 py-6 sm:hidden">
              Already have an account?{" "}
              <Link
                to="/authentication/login"
                className="text-link font-semibold hover:text-sky-400"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistrationPage;
