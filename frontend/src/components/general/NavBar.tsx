import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const NavBar = () => {
  return (
    <div className="w-full h-[60px]  flex items-center px-5 bg-black">
      {/* Logo Section */}
      <div className="w-[600px] font-bold text-3xl text-green-500">
        CricEasy
      </div>

      {/* Navigation Links Section */}
      <div className="flex-1 flex justify-between items-center gap-5">
        <Link to="/" className="text-white hover:text-green-500">Home</Link>
        <Link to="/feature" className="text-white hover:text-green-500">Feature</Link>
        <Link to="/live" className="text-white hover:text-green-500">Live Score</Link>
        <Link to="/tournament" className="text-white hover:text-green-500">Tournament</Link>
        <Link to="/guide" className="text-white hover:text-green-500">How-to-start</Link>
        <Link to="/testimonial" className="text-white hover:text-green-500">Testimonial</Link>
        <Link to="/pricing" className="text-white hover:text-green-500">Pricing</Link>
        <Button className="px-3 py-2 bg-green-500 rounded-md"> <Link to="/contact" className="text-white hover:text-green-500">Contact</Link></Button>
       
      </div>
    </div>
  );
}

export default NavBar;

