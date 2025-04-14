import { Link } from "react-router-dom";

function OverviewCard({ cardLink = null, linkText = null, children }) {
  return (
    <div className="flex w-full flex-col justify-between rounded-lg bg-[#ffffff] p-4 shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      {/* Card Content */}
      {children}

      {/* Link Section */}
      {cardLink && linkText && (
        <Link
          to={cardLink}
          className="text-sm tracking-wide text-[#00aab3a1] underline transition-colors duration-300 ease-in-out hover:text-[#00ABB3]"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}

export default OverviewCard;
