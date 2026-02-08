import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { SquareArrowUp } from "lucide-react";
import { Outlet, Route, Routes } from "react-router-dom";
import { canonicalAtom } from "../utils/atoms";
import { backend } from "../utils/backend";
import { NavMenu } from "./NavMenu";
import { Toggle } from "./ui/toggle";

export type TCanon = boolean;
export type TSetCanon = (value: React.SetStateAction<boolean>) => void;

export const LayoutWrapper = () => (
  <div className="flex flex-col justify-between gap-4 h-screen overflow-hidden py-4">
    <div className="flex justify-between items-center px-4 w-full h-12 gap-2">
      <NavMenu />
      <Routes>
        <Route path="/">
          <Route path="/" element={<AppMenuItems />} />
          <Route
            path="/validation"
            element={<AppMenuItems isValidation={true} />}
          />
        </Route>
      </Routes>
    </div>
    <Outlet />
  </div>
);

const AppMenuItems = ({ isValidation }: { isValidation?: boolean }) => {
  const [canonical, setCanonical] = useAtom(canonicalAtom);

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: () =>
      backend.api
        .getTripletStatsEndpointApiLabelizerV1TripletStatsGet()
        .then((r) => r.data),
  });

  const tripletsStats = `${
    isValidation
      ? `${stats?.validation_labeled ?? 0}/${
          (stats?.validation_labeled ?? 0) + (stats?.validation_unlabeled ?? 0)
        }`
      : `${stats?.labeled ?? 0}/${
          (stats?.labeled ?? 0) + (stats?.unlabeled ?? 0)
        }`
  } triplets completed`;

  return (
    <div className="flex gap-4 items-center h-full">
      <div className="flex items-center text-end">{tripletsStats}</div>

      <Toggle
        className="hidden sm:flex items-center space-x-2"
        variant={"outline"}
        pressed={canonical}
        onPressedChange={() => setCanonical((s) => !s)}
      >
        Canonical
        <SquareArrowUp className="ml-1 hidden sm:inline-flex items-center size-4" />
      </Toggle>
    </div>
  );
};
