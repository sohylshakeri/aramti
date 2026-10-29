import { Navigate, Route, Routes } from 'react-router-dom'

import SiteLayout from '../components/layout/SiteLayout.jsx'

import AboutPage from '../pages/about/AboutPage.jsx'
import ContactPage from '../pages/contact/ContactPage.jsx'
import HomePage from '../pages/home/HomePage.jsx'
import PortfolioPage from '../pages/portfolio/PortfolioPage.jsx'

import AuthLayout from '../pages/auth/components/AuthLayout.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import SignupPage from '../pages/auth/SignupPage.jsx'
import VerificationPage from '../pages/auth/VerificationPage.jsx'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx'
import AuthCallbackPage from '../pages/auth/AuthCallbackPage.jsx'
import ProfilePage from '../pages/profile/ProfilePage.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* صفحات اصلی سایت */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/projects" element={<PortfolioPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route
          path="/services"
          element={<Navigate to="/#services" replace />}
        />
      </Route>

      {/* صفحات احراز هویت */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerificationPage />} />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        <Route
          path="/auth/callback"
          element={<AuthCallbackPage />}
        />
      </Route>
    </Routes>
  )
}