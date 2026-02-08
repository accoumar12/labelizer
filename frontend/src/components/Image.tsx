import { format } from "../utils/format";
import { Skeleton } from "./ui/skeleton";

type TImage = {
  id?: string;
  length?: number;
  dataset?: string;
  canonical?: boolean;
  isValidation?: boolean;
  version?: string;
};
export const Image = ({
  id,
  length,
  dataset,
  canonical,
  isValidation,
  version,
}: TImage) => {
  return (
    <div className="relative flex flex-col size-full rounded overflow-hidden border border-slate-400 shadow-xl">
      <div className="relative aspect-[4/3] pointer-events-none">
        <Skeleton className="absolute top-0 left-0 size-full" />
        <Img id={id} canonical={canonical} key={`${id}_${canonical}`} />
      </div>
      <div className="bg-blue-50 flex-shrink-0 text-center whitespace-nowrap truncate border-t flex-1">
        <LengthBar length={length} />
        <DatasetBar dataset={dataset} />
        <VersionBar version={version} show={isValidation} />
      </div>
    </div>
  );
};

type TLengthBar = { length?: number };
const LengthBar = ({ length }: TLengthBar) => {
  if (length === undefined) return <Skeleton className="h-6" />;
  return (
    <div className="h-6 truncate contain-inline-size">
      Length: {format(length)}mm
    </div>
  );
};

type TDatasetBar = { dataset?: string };
const DatasetBar = ({ dataset }: TDatasetBar) => {
  if (dataset === undefined) return <Skeleton className="h-6" />;
  return <div className="h-6 truncate contain-inline-size">Dataset: {dataset}</div>;
};

type TVersionBar = { version?: string; show?: boolean };
const VersionBar = ({ version, show }: TVersionBar) => {
  if (!show) return null;
  if (version === undefined) return <Skeleton className="h-6" />;
  return (
    <div className="h-6 truncate contain-inline-size">Version: {version}</div>
  );
};

type TImg = { id?: string; canonical?: boolean };
const Img = ({ id, canonical }: TImg) => {
  if (!id) return null;
  const canonArg = canonical ? "?canonical=true" : "";
  const url = `/api/labelizer/v1/images/${id}${canonArg}`;
  return (
    <img
      className="relative size-full object- opacity-0 transition-opacity"
      onLoad={(e) => (e.currentTarget.style.opacity = "1")}
      src={url}
    />
  );
};
