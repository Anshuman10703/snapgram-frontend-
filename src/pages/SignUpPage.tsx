// ~/snapgram-amplify-original/frontend/src/pages/SignUpPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { StyledButton } from '../components/common/StyledButton.tsx';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signUp(name, email, password, username);
    if (success) {
      navigate('/sign-in');
    }
  };

  return (
   <div className="flex w-screen h-screen justify-center items-center bg-gradient-to-br from-dark-2 to-dark-1 px-4 sm:px-0">
  {/* Sign-Up Card */}
  <div className="w-full max-w-md bg-dark-3 rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col items-center animate-fade-in">
    <h2 className="text-3xl sm:text-4xl font-extrabold text-light-1 mb-6 text-center">
      Create Your Account
    </h2>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="shad-input focus:ring-2 focus:ring-primary-500 transition-all duration-200"
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="shad-input focus:ring-2 focus:ring-primary-500 transition-all duration-200"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="shad-input focus:ring-2 focus:ring-primary-500 transition-all duration-200"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="shad-input focus:ring-2 focus:ring-primary-500 transition-all duration-200"
      />

      <StyledButton
        type="submit"
        disabled={isLoading}
        className="shad-button-primary w-full mt-2 hover:scale-[1.02] transition-transform duration-200"
      >
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </StyledButton>
    </form>

    <p className="text-sm text-light-3 text-center mt-5">
      Already have an account?{' '}
      <Link
        to="/sign-in"
        className="text-primary-500 font-semibold hover:underline"
      >
        Sign In
      </Link>
    </p>
  </div>


      {/* Right side for side image (hidden on small screens) */}
      <img
        src="/assets/images/side-img.svg" // Path to your side image
        alt="Side Image"
        className="auth-side-image" // CSS class for responsiveness
      />
    </div>
  );
};

export default SignUpPage;