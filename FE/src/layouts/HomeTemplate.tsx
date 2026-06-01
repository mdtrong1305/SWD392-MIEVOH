import { Outlet } from "react-router-dom";
import Header from "../components/header_user/Header.tsx";
import Footer from "../components/footer.user/Footer.tsx";
import BackToTop from "../components/BackToTop/BackToTop.tsx";
import ScrollReveal from "../components/ScrollReveal/ScrollReveal.tsx";

export default function HomeTemplate() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <ScrollReveal animationClass="animate__fadeInUp">
        <Footer />
      </ScrollReveal>
      <BackToTop />
    </div>
  );
}
