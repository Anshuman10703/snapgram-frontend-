// ~/snapgram-amplify-original/frontend/src/pages/SignInPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { StyledButton } from '../components/common/StyledButton.tsx';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signIn(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
   <div className="flex w-screen h-screen justify-center items-center bg-dark-1">
  {/* Left: Form Container */}
  <div
    className="common-container flex-col items-center justify-center p-8 max-w-md bg-dark-3 rounded-xl shadow-lg flex-shrink-0 transition-transform duration-300 ease-in-out hover:scale-[1.01]"
  >
    <h2 className="h2-bold text-center mb-6 text-light-1 animate-fade-in">Sign In</h2>

    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full animate-fade-in">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="shad-input focus:ring-2 focus:ring-primary-500 focus:outline-none transition duration-200"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="shad-input focus:ring-2 focus:ring-primary-500 focus:outline-none transition duration-200"
      />
      <StyledButton
        type="submit"
        disabled={isLoading}
        className="shad-button-primary w-full hover:brightness-110 transition-all duration-200"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </StyledButton>
    </form>

    <p className="text-sm text-light-3 text-center mt-4">
      Don't have an account?
      <Link to="/sign-up" className="text-primary-500 font-semibold ml-1 underline hover:text-primary-300 transition-colors duration-200">
        Sign Up
      </Link>
    </p>
  </div>

  {/* Right: Image (hidden on small screens) */}
  <img
    src="/assets/images/side-img.svg"
    alt="Welcome Illustration"
    className="auth-side-image hidden md:block animate-slide-in-left"
  />
</div>

  );
};

export default SignInPage;