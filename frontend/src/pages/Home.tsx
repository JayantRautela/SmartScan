import CTABanner from "@/components/CTABanner"
import Hero from "@/components/Hero"
import HowItWorks from "@/components/HowItWorks"
import Secondary from "@/components/Secondary"
import Footer from "@/components/shared/Footer"
import Navbar from "@/components/shared/Navbar"


const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Secondary />
      <HowItWorks />
      <CTABanner />
      <Footer />
    </div>
  )
}

export default Home
