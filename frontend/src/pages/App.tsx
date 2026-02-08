import { useMutation, useQuery } from "@tanstack/react-query";
import {
  MotionValue,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import { Rotate3D, SquareArrowDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SelectedItemType } from "../api";
import { Image } from "../components/Image";
import { Button } from "../components/ui/button";
import { Toggle } from "../components/ui/toggle";
import { queryClient } from "../main";
import { canonicalAtom } from "../utils/atoms";
import { backend } from "../utils/backend";

// Drag sensibilities
const DRAG_BOTTOM = 50;
const DRAG_RIGHT = 20;
const DRAG_LEFT = -20;

const useButtonScale = ({
  x,
  y,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
}) => {
  const [scaleBottom, setBottomScale] = useState(1);
  const [scaleLeft, setLeftScale] = useState(1);
  const [scaleRight, setRightScale] = useState(1);

  useEffect(() => {
    const onDragMove = () => {
      if (y.get() > DRAG_BOTTOM) {
        setBottomScale(1.1);
        setLeftScale(1);
        setRightScale(1);
      } else if (x.get() < DRAG_LEFT) {
        setBottomScale(1);
        setLeftScale(1.1);
        setRightScale(1);
      } else if (x.get() > DRAG_RIGHT) {
        setBottomScale(1);
        setLeftScale(1);
        setRightScale(1.1);
      } else {
        setBottomScale(1);
        setLeftScale(1);
        setRightScale(1);
      }
    };

    const unsubX = x.on("change", onDragMove);
    const unsubY = y.on("change", onDragMove);

    return () => {
      unsubX();
      unsubY();
    };
  }, [x, y]);

  return { scaleBottom, scaleLeft, scaleRight };
};

const useKeyDown = ({
  onMove,
}: {
  onMove: (label: SelectedItemType) => void;
}) => {
  const setCanonical = useSetAtom(canonicalAtom);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "ArrowUp") setCanonical((s) => !s);
      else if (e.code === "ArrowDown") onMove(SelectedItemType.DontKnow);
      else if (e.code === "ArrowLeft") onMove(SelectedItemType.Left);
      else if (e.code === "ArrowRight") onMove(SelectedItemType.Right);
    },
    [onMove, setCanonical],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);
};

function App({ isValidation }: { isValidation?: boolean }) {
  const [canonical, setCanonical] = useAtom(canonicalAtom);

  const [movedTo, moveTo] = useState<SelectedItemType | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateZ = useTransform(() => Math.min(Math.max(x.get() / 4, -40), 40));

  const { scaleBottom, scaleLeft, scaleRight } = useButtonScale({ x, y });

  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: () =>
      backend.api.getConfigApiLabelizerV1ConfigGet().then((r) => r.data),
    staleTime: Infinity,
  });

  const {
    data: triplet,
    isStale,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["triplet", isValidation],
    queryFn: () =>
      backend.api
        .getTripletApiLabelizerV1TripletGet({ validation: isValidation })
        .then((r) => r.data)
        .catch(() => null),
    staleTime: config?.lock_timeout_in_seconds * 1000,
    refetchInterval: config?.lock_timeout_in_seconds * 1000,
  });

  useEffect(() => {
    if (config && !isFetching && isStale) refetch();
  }, [isFetching, config, isStale, refetch]);

  const { mutate: setTriplet } = useMutation({
    mutationFn: (args: { triplet_id: string; label: SelectedItemType }) =>
      backend.api.setTripletLabelApiLabelizerV1TripletPost({
        ...args,
        validation: isValidation,
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["triplet"] }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stats"] }),
  });

  const onMove = useCallback(
    (label: SelectedItemType) => triplet && moveTo(label),
    [triplet],
  );

  useKeyDown({ onMove });

  const resetCardState = useCallback(() => {
    setCanonical(false);
    moveTo(null);
    x.jump(0);
  }, [setCanonical, x]);

  useEffect(() => {
    resetCardState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triplet]);

  const onAnimationComplete = useCallback(() => {
    if (triplet && movedTo)
      setTriplet({ triplet_id: `${triplet.id}`, label: movedTo });
  }, [movedTo, setTriplet, triplet]);

  const onDragEnd = () => {
    if (y.get() > DRAG_BOTTOM) onMove(SelectedItemType.DontKnow);
    else if (x.get() < DRAG_LEFT) onMove(SelectedItemType.Left);
    else if (x.get() > DRAG_RIGHT) onMove(SelectedItemType.Right);
  };

  const leftImageProps = {
    id: triplet?.left_id,
    length: triplet?.left_length,
    dataset: triplet?.left_dataset,
    canonical,
    isValidation,
    version:
      triplet && "left_encoder_id" in triplet
        ? triplet?.left_encoder_id
        : undefined,
  };

  const rightImageProps = {
    id: triplet?.right_id,
    length: triplet?.right_length,
    dataset: triplet?.right_dataset,
    canonical,
    isValidation,
    version:
      triplet && "right_encoder_id" in triplet
        ? triplet?.right_encoder_id
        : undefined,
  };

  const middleImageProps = {
    id: triplet?.reference_id,
    length: triplet?.reference_length,
    dataset: triplet?.reference_dataset,
    canonical,
  };

  return (
    <>
      <div className="flex flex-wrap">
        <div
          className={`flex justify-evenly gap-4 p-4 w-full shrink min-h-0 ${
            isValidation ? "" : "mb-6"
          }`}
        >
          {/* Left image */}
          <motion.button
            className="relative size-full"
            onClick={() => onMove(SelectedItemType.Left)}
            animate={{ scale: scaleLeft }}
          >
            <Image {...leftImageProps} key={`${isValidation}_left`} />
          </motion.button>

          {/* Large screen middle image */}
          <div className="relative flex-col size-full hidden sm:flex">
            <motion.div
              key={triplet?.reference_id}
              initial={{ opacity: movedTo ? 0 : 1 }}
              animate={{
                opacity: movedTo ? 0 : 1,
                scale: movedTo ? 0.8 : 1,
                x:
                  movedTo === SelectedItemType.Right
                    ? "100%"
                    : movedTo === SelectedItemType.Left
                    ? "-100%"
                    : 0,
                y: movedTo === SelectedItemType.DontKnow ? "100%" : 0,
              }}
              transition={{ duration: 0.2 }}
              onAnimationComplete={onAnimationComplete}
              className="absolute top-0 left-0 flex flex-col size-full z-[1]"
            >
              <Image
                {...middleImageProps}
                key={`${isValidation}_middle_large`}
              />
            </motion.div>
          </div>

          {/* Right image */}
          <motion.button
            className="size-full"
            onClick={() => onMove(SelectedItemType.Right)}
            animate={{ scale: scaleRight }}
          >
            <Image {...rightImageProps} key={`${isValidation}_right`} />
          </motion.button>
        </div>

        {/* Small screen middle image */}
        <div className="relative w-1/2 m-auto block sm:hidden">
          <motion.div
            style={{ x, rotateZ, y }}
            animate={{
              opacity: movedTo ? 0 : 1,
              x: movedTo ? x.get() * 2 : x.get(),
            }}
            drag
            onDragEnd={onDragEnd}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <Image {...middleImageProps} key={`${isValidation}_middle_small`} />
          </motion.div>
        </div>
      </div>

      <div className="px-4 w-full h-12 flex items-center justify-center">
        {/* Small screen cannonical view button */}
        <Toggle
          className="items-center space-x-2 flex sm:hidden mr-4"
          variant={"outline"}
          pressed={canonical}
          onPressedChange={() => setCanonical((s) => !s)}
        >
          <Rotate3D />
        </Toggle>
        {/* Skip button */}
        <motion.div
          className="h-full flex justify-center items-center max-w-64 w-full"
          animate={{ scale: scaleBottom }}
        >
          <Button
            className="w-full max-w-64"
            onClick={() => onMove(SelectedItemType.DontKnow)}
          >
            Skip
            <SquareArrowDown className="ml-1 hidden sm:inline-flex items-center size-4" />
          </Button>
        </motion.div>
      </div>
    </>
  );
}

export default App;
