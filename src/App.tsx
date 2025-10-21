import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import WhatsAppButton from './components/WhatsAppButton';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Booking from './pages/Booking';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSlots from './pages/admin/AdminSlots';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminArticles from './pages/admin/AdminArticles';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="slots" element={<AdminSlots />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route
            path="/*"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pb-20 md:pb-0">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/articles/:slug" element={<ArticleDetail />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </main>
                <BottomNav />
                <Footer />
                <WhatsAppButton />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
