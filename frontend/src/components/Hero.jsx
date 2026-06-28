import { FaShieldAlt, FaPlay } from "react-icons/fa";
import ShieldLogo from "./ShieldLogo";
import "./Hero.css";

export default function Hero() {
    const cards = [
        {
            title: "URL Protection",
            status: "Safe ✓",
            className: "card-one",
        },
        {
            title: "QR Scanner",
            status: "Secure ✓",
            className: "card-two",
        },
        {
            title: "File Scanner",
            status: "No Threats ✓",
            className: "card-three",
        },
        {
            title: "Email Analyzer",
            status: "Protected ✓",
            className: "card-four",
        },
    ];

    return (
        <section className="hero">

            <div className="hero-container">

                {/* Left Side */}

                <div className="hero-left">

                    <span className="hero-badge">
                        AI POWERED PROTECTION
                    </span>

                    <h1>
                        Stay Safe from
                        <br />
                        Scams,
                        <br />
                        Phishing &
                        <br />
                        <span>Malicious Threats</span>
                    </h1>

                    <p>
                        ScamShield uses advanced AI technology to detect phishing
                        websites, malicious QR codes, dangerous files and
                        fraudulent emails before they can harm you.
                    </p>

                    <div className="hero-buttons">

                        <button className="secondary-btn">

                            <FaPlay />

                            Learn More

                        </button>

                    </div>

                </div>

                {/* Right Side */}

                <div className="hero-right">

                    <div className="shield-circle">

                        <ShieldLogo size={220} />

                    </div>

                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className={`floating-card ${card.className}`}
                        >
                            <h4>{card.title}</h4>

                            <span>{card.status}</span>

                        </div>
                    ))}
                </div>

            </div>

        </section>
    );
}