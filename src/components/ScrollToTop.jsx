import { useState, useEffect } from "react";
import { PiArrowCircleUpLight } from "react-icons/pi";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-4 md:right-8 text-4xl md:text-5xl cursor-pointer bg-yellow-400 p-1 rounded-full shadow-lg hover:bg-yellow-500 transition"
          aria-label="Scroll to top"
        >
          <PiArrowCircleUpLight />
        </button>
      )}
    </>
  );
}
