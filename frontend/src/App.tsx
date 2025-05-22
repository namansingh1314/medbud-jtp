import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Predict from './pages/Predict';
import About from './pages/About';
import Profile from './pages/Profile';

function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <Router>
        <AuthProvider>
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <Navbar />
            <Box flex="1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/predict"
                  element={
                    <PrivateRoute>
                      <Predict />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
