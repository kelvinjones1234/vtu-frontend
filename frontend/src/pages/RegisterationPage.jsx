import { useContext, useState, useEffect, React } from "react";
import { AuthContext } from "../context/AuthenticationContext";
import { Link } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import simag from "../assets/vtu3.png";
import SubmitButton from "../components/SubmitButton";

const LeftSide = () => (
  <div className="left mt-4 leading-[3rem] relative hidden justify-center items-center sm:flex h-[364px] shadow-lg shadow-indigo-900/20 bg-opacity-50 rounded-2xl w-[20rem] bg-black text-white">
    <img src={simag} alt="" className="h-[365px]" />
  </div>
);

const inputStyle =
  "transition duration-450 ease-in-out my-2 w-full text-white py-1 px-4 h-[3.5rem] bg-[#18202F] text-[1.2rem] rounded-2xl outline-0 border border-gray-700 hover:border-black focus:border-link bg-opacity-80";

const RegisterationPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const { registerUser, registerErrors } = useContext(AuthContext);
  const { setLoading } = useContext(GeneralContext);

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
    if (validInputs()) {
      setLoading(true);
      registerUser(formData).finally(() => {
        setLoading(false);
      });
    }
  };

  const validInputs = () => {
    const newError = {};
    if (!formData.username) {
      newError.usernameError = "Please fill in your username";
    }
    if (formData.password.length < 8) {
      newError.passwordError = "Your password must be at least 8 characters";
    }
    if (formData.password !== formData.confirm_password) {
      newError.confirm_passwordError = "Passwords do not match";
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
    if (formData.phone_number.length !== 11 || isNaN(formData.phone_number)) {
      newError.phone_numberError =
        "Phone number must be exactly 11 digits and numeric";
    }
    if (!formData.email) {
      newError.emailError = "Please fill in your email";
    }
    setErrorMessage(newError);
    return Object.keys(newError).length === 0;
  };

  console.log(errorMessage);

  return (
    <div className="min-w-[150px] bg-opacity-[95%] z-[-1] font-body_two bg-dark-custom-gradient w-full z-[-2] min-w-[150px] absolute top-0 left-0 min-h-screen">
      <div className="authentication bg-bg_one bg-contain md:bg-cover bg-center w-full min-h-screen bg-no-repeat fixed z-[-1]"></div>
      <div>
        <div
          className={`authenticationnavbar flex justify-between p-4 md:px-[6rem] fixed top-0 w-full transition-colors duration-200 ${
            isScrolled ? "bg-opacity-100 bg-gray-900" : "bg-transparent"
          }`}
        >
          <div className="left flex items-center gap-1">
            <Link to={"/"}>
              <div className="logo font-heading_one text-green-500 border border-green-500 px-2 text-[.7rem] px-2 border-white rounded-[.5rem] font-bold">
                Atom
              </div>
            </Link>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="right hidden ss:block text-gray-300">
            Already have an account?
            <span className="text-link font-bold cursor-pointer hover:text-sky-500 transition duration-450 ease-in-out">
              <Link to="/authentication/login"> Login</Link>
            </span>
          </div>
        </div>

        <div className="signin-form pt-[15vh] sm:flex justify-between login mx-auto px-4 w-full md:px-[4rem] lg:px-[8rem]">
          <LeftSide />
          <div className="left right sm:w-[50%] max-w-[550px] mx-auto sm:mx-0">
            <div className="top-text pb-6">
              <h5 className="font-bold text-[2rem] text-gray-300 font-heading_two">
                Signup with <span className="text-gradient">Atom</span>
              </h5>
              <p className="text-gray-300 text-[1.2rem]">
                Create an Atom account for free
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-wrap justify-between">
                <div className="w-full sm:w-[48%]">
                  {errorMessage.first_nameError && (
                    <div className="text-white">
                      {errorMessage.first_nameError}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="First Name"
                    className={inputStyle}
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full sm:w-[48%]">
                  {errorMessage.last_nameError && (
                    <div className="text-white">
                      {errorMessage.last_nameError}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Last Name"
                    className={inputStyle}
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full sm:w-[48%]">
                  {errorMessage.usernameError ? (
                    <div className="text-white">
                      {errorMessage.usernameError}
                    </div>
                  ) : (
                    registerErrors.username && (
                      <div className="text-white">
                        {registerErrors.username[0]}
                      </div>
                    )
                  )}
                  <input
                    type="text"
                    placeholder="Username"
                    className={inputStyle}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full sm:w-[48%]">
                  {errorMessage.emailError && (
                    <div className="text-white">{errorMessage.emailError}</div>
                  )}
                  <input
                    type="text"
                    placeholder="Email address"
                    className={inputStyle}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="w-full sm:w-[48%]">
                  {errorMessage.phone_numberError && (
                    <div className="text-white">
                      {errorMessage.phone_numberError}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className={inputStyle}
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                </div>

                <div className="w-full sm:w-[48%]">
                  {errorMessage.transaction_pinError ? (
                    <div className="text-white">
                      {errorMessage.transaction_pinError}
                    </div>
                  ) : (
                    registerErrors.transaction_pin && (
                      <div className="text-white">
                        {registerErrors.transaction_pin[0]}
                      </div>
                    )
                  )}
                  <input
                    type="password"
                    placeholder="Enter a Four Digit Transaction Pin"
                    className={inputStyle}
                    name="transaction_pin"
                    autoComplete="current-password"
                    value={formData.transaction_pin}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full sm:w-[48%]">
                  {errorMessage.passwordError && (
                    <div className="text-white">
                      {errorMessage.passwordError}
                    </div>
                  )}
                  <input
                    type="password"
                    placeholder="Password"
                    className={inputStyle}
                    name="password"
                    value={formData.password}
                    autoComplete="current-password"
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full sm:w-[48%]">
                  {errorMessage.confirm_passwordError && (
                    <div className="text-white">
                      {errorMessage.confirm_passwordError}
                    </div>
                  )}
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className={inputStyle}
                    name="confirm_password"
                    autoComplete="current-password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <p className="text-center text-white">
                By signing in to Atom, you agree to our{" "}
                <span className="underline text-link">terms</span> and{" "}
                <span className="underline text-link">conditions</span>
              </p>
              <div className="ss:pb-16 my-4">
                <SubmitButton label="Register" />
              </div>
            </form>
            <div className="text-center text-[1rem] text-gray-300 pt-4 pb-[6rem] ss:hidden">
              <p>
                Already have an account?{" "}
                <span className="text-link font-semibold cursor-pointer hover:text-sky-500 transition duration-450 ease-in-out">
                  <Link to="/authentication/login">Login</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterationPage;
