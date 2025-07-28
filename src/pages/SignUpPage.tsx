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
    <div className="flex w-screen h-screen justify-center items-center bg-dark-1"> {/* Tailwind classes */}
      {/* Left side for form */}
      <div className="common-container flex-col items-center justify-center p-8 max-w-md bg-dark-3 rounded-xl shadow-lg flex-shrink-0"> {/* Tailwind classes */}
        <h2 className="h2-bold text-center mb-6 text-light-1">Create Your Account</h2> {/* Tailwind classes */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full"> {/* Tailwind classes */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="shad-input" // Tailwind class
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="shad-input" // Tailwind class
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shad-input" // Tailwind class
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shad-input" // Tailwind class
          />
          <StyledButton type="submit" disabled={isLoading} className="shad-button-primary w-full"> {/* Tailwind classes */}
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </StyledButton>
        </form>
        <p className="text-sm text-light-3 text-center mt-4"> {/* Tailwind classes */}
          Already have an account? <Link to="/sign-in" className="text-primary-500 font-semibold">Sign In</Link> {/* Tailwind classes */}
        </p>
      </div>

      {/* Right side for side image (hidden on small screens) */}
      <img
        src="/public/assets/images/side-img.svg" // Path to your side image
        alt="Side Image"
        className="auth-side-image" // CSS class for responsiveness
      />
    </div>
  );
};

export default SignUpPage;