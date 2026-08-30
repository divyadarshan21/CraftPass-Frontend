import PropTypes from "prop-types";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import "./ArtisanLayout.css";

function ArtisanLayout({ children }) {
    return (
        <div className="artisan-layout">
            <Sidebar />

            <div className="artisan-layout__main">
                <Navbar />

                <main className="artisan-layout__content">
                    {children}
                </main>
            </div>
        </div>
    );
}

ArtisanLayout.propTypes = {
    children: PropTypes.node.isRequired
};

export default ArtisanLayout;