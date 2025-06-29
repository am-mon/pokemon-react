import ScrollToTop from "./ScrollToTop";

export default function Footer() {
  return (
    <>
      {" "}
      <div className="bg-yellow-50 border-b-10 border-b-yellow-400 py-8">
        <div className="container mx-auto px-4 text-gray-500">
          <p className="text-center">© 2025 Mon. Learned React.</p>
        </div>
      </div>
      <ScrollToTop />
    </>
  );
}
