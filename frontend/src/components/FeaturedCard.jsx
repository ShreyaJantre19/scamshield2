import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function FeatureCard({ title, description, icon, link }) {
  return (
    <Link
      to={link}
      className="block bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8"
    >
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl mb-6">
        {icon}
      </div>

      <h2 className="text-2xl font-bold text-gray-800">
        {title}
      </h2>

      <p className="text-gray-500 mt-3 mb-6">
        {description}
      </p>

      <button className="flex items-center gap-2 border border-blue-500 text-blue-600 px-5 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition">
        Open Scanner
        <ArrowRight size={18} />
      </button>
    </Link>
  );
}

export default FeatureCard;