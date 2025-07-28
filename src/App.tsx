import React from 'react';
// @ts-ignore
import { Routes, Route, Navigate } from 'react-router-dom';
// @ts-ignore
import { useAuth } from './context/AuthContext.tsx';

// Import pages
import SignInPage from './pages/SignInPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import HomePage from './pages/HomePage.tsx';
import CreatePostPage from './pages/CreatePostPage.tsx';
import PostDetailPage from './pages/PostDetailPage.tsx';
import EditPostPage from './pages/EditPostPage.tsx';

// Common layout components (using Tailwind classes directly)
const AppContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen w-full">
    {children}
  </div>
);

const ContentArea = ({ children }: { children: React.ReactNode }) => (
  <main className="flex flex-grow justify-center items-start p-5 md:p-10">
    {children}
  </main>
);

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <ContentArea><p className="text-light-3 text-center">Loading...</p></ContentArea>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/sign-in" />;
};


const App: React.FC = () => {
  return (
    <AppContainer>
      <ContentArea>
        <Routes>
          {/* Public Routes */}
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />

          {/* Private Routes */}
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/create-post" element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
          <Route path="/posts/:postId" element={<PrivateRoute><PostDetailPage /></PrivateRoute>} />
          <Route path="/posts/:postId/edit" element={<PrivateRoute><EditPostPage /></PrivateRoute>} />

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ContentArea>
    </AppContainer>
  );
};

export default App;