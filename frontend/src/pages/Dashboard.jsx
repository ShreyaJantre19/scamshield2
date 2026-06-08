import Navbar from "../components/navbar";

function Dashboard() {
  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "1000px",
          margin: "40px auto",
          padding: "20px",
        }}
      >
        <h1>Dashboard</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              background: "#dcfce7",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h2>120</h2>
            <p>Total Scans</p>
          </div>

          <div
            style={{
              background: "#dbeafe",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h2>15</h2>
            <p>Threats Found</p>
          </div>

          <div
            style={{
              background: "#f3e8ff",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h2>105</h2>
            <p>Safe Results</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;