import Hero from "./sections/Hero";
import About from "./sections/About";
import TechStack from "./sections/TechStack";
import Projects from "./sections/Project";
import Contact from "./sections/Contact";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

export default function App(){
  return(
    <>
     <Navbar/> 
    <Hero/>
    <About/>
    <TechStack/>
    <Projects/>
    <Contact/>
    <Footer/>
    </>
  )
}