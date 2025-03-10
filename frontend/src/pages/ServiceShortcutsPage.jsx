import ServiceShortcuts from "../components/ServiceShortcuts";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";

const ServiceShortcutsPage = () => {
  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <ServiceShortcuts />
      <Footer />
    </div>
  );
};

export default ServiceShortcutsPage;
