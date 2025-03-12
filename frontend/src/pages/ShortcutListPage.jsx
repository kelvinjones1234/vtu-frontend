import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";
import ShortcutList from "../components/ShortcutList";

const ShortcutListPage = () => {
  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <ShortcutList />
      <Footer />
    </div>
  );
};

export default ShortcutListPage;
