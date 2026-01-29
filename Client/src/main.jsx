import { StrictMode, lazy, Suspense } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PartnerProvider } from './context/partnerContext.jsx'
import { UserProvider } from './context/userContext.jsx'

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

// Lazy load all route components
const Home = lazy(() => import('./pages/Home.jsx'))
const Services = lazy(() => import('./pages/Services.jsx'))
const Pricing = lazy(() => import('./pages/Pricing.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const SignIn = lazy(() => import('./components/users/user/Login/SignIn.jsx'))
const SignUp = lazy(() => import('./components/users/user/Login/SignUp.jsx'))
const ForgotPassword = lazy(() => import('./components/users/user/Login/ForgotPassword.jsx'))
const TermsAndCondition = lazy(() => import('./components/TermsAndCondition/TermsAndCondition.jsx'))
const PrivacyPolicy = lazy(() => import('./components/TermsAndCondition/PrivacyPolicy.jsx'))
const Dashboard = lazy(() => import('./components/users/user/dashboard/Dashboard.jsx'))
const Profile = lazy(() => import('./components/users/user/dashboard/Profile.jsx'))
const Partner = lazy(() => import('./components/users/partners/Partner.jsx'))
const PartnerSignin = lazy(() => import('./components/users/partners/partnerLogin/Signin.jsx'))
const PartnerSignup = lazy(() => import('./components/users/partners/partnerLogin/Signup.jsx'))
const PartnerForgotPassword = lazy(() => import('./components/users/partners/partnerLogin/ForgotPassword.jsx'))
const AccommodationDashboard = lazy(() => import('./components/users/partners/accomodation/dashboard/PartnerDashboard.jsx'))
const FoodDeliveryDashboard = lazy(() => import('./components/users/partners/dailyLiving/FoodDelivery/dashboard/Dashboard.jsx'))
const WaterDeliveryDashboard = lazy(() => import('./components/users/partners/dailyLiving/WaterDelivery/dashboard/Dashboard.jsx'))
const WaterProfile = lazy(() => import('./components/users/partners/dailyLiving/WaterDelivery/dashboard/WaterProfile.jsx'))
const LaundryDashboard = lazy(() => import('./components/users/partners/dailyLiving/Laundry/dashboard/Dashboard.jsx'))
const LaundryProfile = lazy(() => import('./components/users/partners/dailyLiving/Laundry/dashboard/LaundryProfile.jsx'))
const RepairServicesDashboard = lazy(() => import('./components/users/partners/dailyLiving/RepairServices/dashboard/Dashboard.jsx'))
const RepairProfile = lazy(() => import('./components/users/partners/dailyLiving/RepairServices/dashboard/RepairProfile.jsx'))
const LocalStoreDashboard = lazy(() => import('./components/users/partners/dailyLiving/LocalStore/dashboard/Dashboard.jsx'))
const StoreProfile = lazy(() => import('./components/users/partners/dailyLiving/LocalStore/dashboard/StoreProfile.jsx'))
const PGSearchComponent = lazy(() => import('./components/users/user/PGSearchComponent.jsx'))
const User = lazy(() => import('./components/users/user/User.jsx'))
const Error = lazy(() => import('./pages/Error.jsx'))
const AccProfile = lazy(() => import('./components/users/partners/accomodation/dashboard/AccProfile.jsx'))
const FoodProfile = lazy(() => import('./components/users/partners/dailyLiving/FoodDelivery/dashboard/FoodProfile.jsx'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/services', element: <Services /> },
      { path: '/pricing', element: <Pricing /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/signin', element: <SignIn /> },
      { path: '/signup', element: <SignUp /> },
      { path: '/user', element: <User /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/user/dashboard', element: <Dashboard /> },
      { path: '/user/profile', element: <Profile /> },
      { path: '/partner', element: <Partner /> },
      { path: '/partner-signin', element: <PartnerSignin /> },
      { path: '/partner-signup', element: <PartnerSignup /> },
      { path: '/partner-forgot-password', element: <PartnerForgotPassword /> },

      // Accommodation routes
      { path: '/partner/accommodation/:serviceType/dashboard', element: <AccommodationDashboard /> },
      { path: '/partner/accommodation/:serviceType/profile', element: <AccProfile /> },

      // Daily Living routes-dashboards
      { path: '/partner/dailyLiving/food-tiffin-service/dashboard', element: <FoodDeliveryDashboard /> },
      { path: '/partner/dailyLiving/water-delivery/dashboard', element: <WaterDeliveryDashboard /> },
      { path: '/partner/dailyLiving/laundry-cleaning/dashboard', element: <LaundryDashboard /> },
      { path: '/partner/dailyLiving/repair-services/dashboard', element: <RepairServicesDashboard /> },
      { path: '/partner/dailyLiving/local-store-directory/dashboard', element: <LocalStoreDashboard /> },

      //Daily Living routes-profiles
      { path: '/partner/dailyLiving/food-tiffin-service/profile', element: <FoodProfile /> },
      {path: '/partner/dailyLiving/water-delivery/profile', element: <WaterProfile/> },
      {path: '/partner/dailyLiving/laundry-cleaning/profile', element: <LaundryProfile/> },
      {path: '/partner/dailyLiving/repair-services/profile', element: <RepairProfile/> },
      {path: '/partner/dailyLiving/local-store-directory/profile', element: <StoreProfile/> },

      { path: '/findpg', element: <PGSearchComponent /> },

      // ==========================================
      // Advertisement Routes (Currently Disabled)
      // ==========================================
      // { path: '/partner/accommodation/:serviceType/advertise', element: <Advertisement /> },
      // { path: '/partner/dailyLiving/food-tiffin-service/advertise', element: <Advertisement /> },
      // { path: '/partner/dailyLiving/water-delivery/advertise', element: <Advertisement /> },
      // { path: '/partner/dailyLiving/laundry-cleaning/advertise', element: <Advertisement /> },
      // { path: '/partner/dailyLiving/repair-services/advertise', element: <Advertisement /> },
      // { path: '/partner/dailyLiving/local-store-directory/advertise', element: <Advertisement /> },

      { path: '/term-and-condition', element: <TermsAndCondition /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '*', element: <Error /> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <UserProvider>
        <PartnerProvider>
          <Suspense fallback={<PageLoader />}>
            <RouterProvider router={router} />
          </Suspense>
        </PartnerProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
