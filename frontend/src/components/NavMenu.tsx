import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatedDogLogo } from "./AnimatedDogLogo";
import { Button } from "./ui/button";
import { Toggle } from "./ui/toggle";

export const NavMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="relative z-10">
      <div className="flex items-center relative z-10">
        <Toggle
          variant="outline"
          pressed={showMenu}
          onPressedChange={() => setShowMenu((s) => !s)}
        >
          {showMenu ? <X /> : <Menu />}
        </Toggle>

        <Link to="/" className="ml-4">
          <AnimatedDogLogo />
        </Link>
      </div>

      <AnimatePresence initial={false}>
        {showMenu && (
          <>
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              exit={{ x: 0 }}
              className="fixed h-screen w-full sm:w-[400px] top-0 right-full bg-[Canvas] pt-20 pb-4 px-4 sm:border-r"
              transition={{ type: "just" }}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-2xl">Navigation</div>
                  <Link
                    to="/"
                    className={
                      "block text-xl ml-2 mt-4 " +
                      (pathname === "/" ? "underline" : "")
                    }
                  >
                    Labelling
                  </Link>
                  <Link
                    to="/validation"
                    className={
                      "block text-xl ml-2 mt-4 " +
                      (pathname === "/validation" ? "underline" : "")
                    }
                  >
                    Validation
                  </Link>
                </div>

                <div className="flex items-end gap-4">
                  <Button disabled>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-black/5 -z-10 fixed top-0 left-0 w-screen h-screen cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
