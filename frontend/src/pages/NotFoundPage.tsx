import { Link } from "react-router-dom";
import { buttonVariants } from "../components/ui/button";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center flex-1 text-3xl gap-2">
      Page not found
      <Link className={buttonVariants()} to="/">
        Go back to menu
      </Link>
    </div>
  );
};
