import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from "./components/Header.jsx";
import Logo from "./components/Logo.jsx";
import Footer from "./components/Footer.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles
/*
This is the main layout just like the base file.
Outlet is every other page that will inherit from this main layout
since we want Navbar to be present in all the pages, we imported navbar and positioned it ontop
*/ 

function App() {
  
  return (
    <>
    <ToastContainer position="top-center" />
    <Logo />
    <Header />
    
    <main className='py-3'>
      <Container>
        <Outlet />
      </Container>
    </main>
    
    <Footer />
  </>
  )
}

export default App
