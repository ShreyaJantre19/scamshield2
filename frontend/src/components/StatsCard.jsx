function StatsCard({ value, label, color }) {
  return (
    <div
      className="bg-white rounded-3xl shadow-lg p-8 text-center
                 hover:shadow-2xl hover:-translate-y-2
                 transition-all duration-300"
    >
      <div
        className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center text-white text-2xl"
        style={{ background: color }}
      >
        🛡️
      </div>

      <h2 className="text-4xl font-bold text-gray-900">
        {value}
      </h2>

      <p className="text-xl font-semibold mt-2">
        {label}
      </p>

      <p className="text-gray-500 mt-2">
        AI Security Statistics
      </p>
    </div>
  );
}

export default StatsCard;