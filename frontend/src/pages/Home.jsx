import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Tools from "../components/Tools";
import Statistics from "../components/Statistics";
import WhyChoose from "../components/WhyChoose";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Tools />
      <Statistics />
      <WhyChoose />
      <Footer />
    </>
  );
}

export default Home;