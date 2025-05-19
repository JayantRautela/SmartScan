import { Link } from "react-router-dom"

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <div className="w-full bg-white px-4 py-10">
      <section className="text-center">
        <h1 className="tracking-tighter text-lg font-semibold">SmartScan</h1>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-10 items-center justify-center mt-6 text-gray-700">
          <Link to="/" className="hover:underline transition delay-150 duration-300 ease-in-out">Home</Link>
          <Link to="/resume-analysis" className="hover:underline transition delay-150 duration-300 ease-in-out">Resume Analysis</Link>
          <Link to="/learning-path" className="hover:underline transition delay-150 duration-300 ease-in-out">Learning Path</Link>
          <Link to="/success-stories" className="hover:underline transition delay-150 duration-300 ease-in-out">Success Stories</Link>
        </div>
      </section>

      <div className="border-t border-gray-300 mt-10 w-full"></div>

      <section className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 underline items-center">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
          <Link to="/cookie-settings">Cookie Settings</Link>
        </div>
        <div className="text-center sm:text-right">
          <p>&copy; {year} SmartScan. All rights reserved.</p>
        </div>
      </section>
    </div>
  )
}

export default Footer