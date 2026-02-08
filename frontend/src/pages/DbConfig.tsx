import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery } from "@tanstack/react-query";
import download from "downloadjs";
import { motion } from "framer-motion";
import { Download, Loader2, Trash } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { queryClient } from "../main";
import { backend } from "../utils/backend";

const onDbUpdate = () => {
  queryClient.invalidateQueries({ queryKey: ["triplet"] });
  queryClient.invalidateQueries({ queryKey: ["stats"] });
  queryClient.invalidateQueries({ queryKey: ["uploadDbStatus"] });
};

export const DbConfig = () => {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: () =>
      backend.api
        .getTripletStatsEndpointApiLabelizerV1TripletStatsGet()
        .then((r) => r.data),
  });

  const { mutate: uploadDb, isPending: isUpdating } = useMutation({
    mutationFn: ({ file }: { file: File }) =>
      backend.api.uploadDataInTheBackgroundApiLabelizerV1UploadPost({
        file,
      }),
    onSettled: onDbUpdate,
    onSuccess: () =>
      toast("Database has been successfully uploaded", { dismissible: true }),
  });

  const {
    data: uploadDbStatus,
    refetch: refreshUploadDbStatus,
    isFetching: isFetchingStatus,
  } = useQuery({
    queryKey: ["uploadDbStatus"],
    queryFn: () =>
      backend.api
        .getUploadStatusApiLabelizerV1UploadGet()
        .then((r) => r.data),
  });

  const toUploadT = uploadDbStatus?.to_upload_count;
  const uploadedT = uploadDbStatus?.uploaded_count;
  const uploadProgress =
    (uploadedT ?? 0) === 0 && (toUploadT ?? 0) === 0
      ? 1
      : (uploadedT ?? 0) / (toUploadT ?? 0);

  useEffect(() => {
    if (toUploadT !== uploadedT)
      setTimeout(() => refreshUploadDbStatus(), 2000);
  }, [refreshUploadDbStatus, toUploadT, uploadedT]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  }, [uploadDbStatus]);

  const { mutate: downloadLabelDb, isPending: isDownloadingLabelDb } =
    useMutation({
      mutationFn: () =>
        backend.api
          .downloadDbApiLabelizerV1DownloadGet({}, { format: "blob" })
          .then((r) => ({
            file: r.data,
            name: r.headers
              .get("content-disposition")
              ?.match(/filename="?(.*)"?/)?.[1]
              ?.replace(/['"]/g, ""),
          }))
          .then(({ file, name }) => download(file, name)),
      onSuccess: () =>
        toast("Database has been successfully downloaded", {
          dismissible: true,
        }),
    });

  const { mutate: deleteLabelDb, isPending: isDeletingLabelDb } = useMutation({
    mutationFn: () => backend.api.deleteDbApiLabelizerV1DeleteDelete(),
    onSettled: onDbUpdate,
    onSuccess: () =>
      toast("Database has been successfully deleted", { dismissible: true }),
  });

  const { mutate: downloadValidDb, isPending: isDownloadingValidDb } =
    useMutation({
      mutationFn: () =>
        backend.api
          .downloadDbApiLabelizerV1DownloadGet(
            { validation: true },
            { format: "blob" },
          )
          .then((r) => ({
            file: r.data,
            name: r.headers
              .get("content-disposition")
              ?.match(/filename="?(.*)"?/)?.[1]
              ?.replace(/['"]/g, ""),
          }))
          .then(({ file, name }) => download(file, name)),
      onSuccess: () =>
        toast("Database has been successfully downloaded", {
          dismissible: true,
        }),
    });

  const { mutate: deleteValidDb, isPending: isDeletingValidDb } = useMutation({
    mutationFn: () =>
      backend.api.deleteDbApiLabelizerV1DeleteDelete({ validation: true }),
    onSettled: onDbUpdate,
    onSuccess: () =>
      toast("Database has been successfully deleted", { dismissible: true }),
  });

  const onUploadDb: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0];
    file && uploadDb({ file });
    e.currentTarget.value = ""; // Clear current file
  };

  return (
    <div className="max-w-lg px-4 pt-8 mx-auto w-full flex-1">
      <div className="text-2xl">Database configuration</div>

      <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
        <Label htmlFor="db">Upload Database</Label>
        {isUpdating || isFetchingStatus || uploadProgress !== 1 ? (
          <div className="flex items-center justify-center h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <Input
            id="db"
            type="file"
            onChange={onUploadDb}
            accept=".zip"
            className="cursor-pointer"
          />
        )}
        <motion.div
          className="overflow-hidden"
          initial={{ height: 0 }}
          animate={{
            height: uploadDbStatus && uploadProgress !== 1 ? "auto" : 0,
          }}
        >
          <Progress value={uploadProgress * 100} />
          Loaded {uploadedT ?? 0} out of {toUploadT ?? 0}
        </motion.div>
      </div>

      <div className="text-xl mt-4">Labelling database</div>
      <div className="mt-4 flex gap-4 flex-wrap">
        <Button className="w-full max-w-48" onClick={() => downloadLabelDb()}>
          {isDownloadingLabelDb ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download
            </>
          )}
        </Button>

        <Button className="w-full max-w-48" onClick={() => deleteLabelDb()}>
          {isDeletingLabelDb ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </>
          )}
        </Button>
      </div>

      <div className="text-xl mt-4">Validation database</div>
      <div className="mt-4 flex gap-4 flex-wrap">
        <Button className="w-full max-w-48" onClick={() => downloadValidDb()}>
          {isDownloadingValidDb ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download
            </>
          )}
        </Button>

        <Button className="w-full max-w-48" onClick={() => deleteValidDb()}>
          {isDeletingValidDb ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </>
          )}
        </Button>
      </div>

      <div>
        <div className="text-2xl mt-8">Triplets statistics</div>

        <div className="mt-4">
          Labelling: {stats?.labeled ?? 0}/
          {(stats?.labeled ?? 0) + (stats?.unlabeled ?? 0)}
        </div>

        <div className="mt-4">
          Validation: {stats?.validation_labeled ?? 0}/
          {(stats?.validation_labeled ?? 0) +
            (stats?.validation_unlabeled ?? 0)}
        </div>
      </div>
    </div>
  );
};
