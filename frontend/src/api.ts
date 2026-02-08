/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** AllTripletsUploadStatus */
export interface AllTripletsUploadStatus {
  /** Id */
  id: number;
  /**
   * To Upload Count
   * @default 0
   */
  to_upload_count?: number;
  /** Uploaded Count */
  uploaded_count: number;
}

/** Body_upload_data_in_the_background_api_labelizer_v1_upload_post */
export interface BodyUploadDataInTheBackgroundApiLabelizerV1UploadPost {
  /**
   * File
   * @format binary
   */
  file: File;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** SelectedItemType */
export enum SelectedItemType {
  Left = "left",
  Right = "right",
  DontKnow = "dont_know",
}

/** TripletResponse */
export interface TripletResponse {
  /** Reference Id */
  reference_id: string;
  /** Left Id */
  left_id: string;
  /** Right Id */
  right_id: string;
  /** Id */
  id: number;
  /** Reference Length */
  reference_length: number;
  /** Reference Dataset */
  reference_dataset: string;
  /** Left Length */
  left_length: number;
  /** Left Dataset */
  left_dataset: string;
  /** Right Length */
  right_length: number;
  /** Right Dataset */
  right_dataset: string;
}

/** TripletStats */
export interface TripletStats {
  /** Labeled */
  labeled: number;
  /** Unlabeled */
  unlabeled: number;
  /** Validation Labeled */
  validation_labeled: number;
  /** Validation Unlabeled */
  validation_unlabeled: number;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

/** ValidationTripletResponse */
export interface ValidationTripletResponse {
  /** Reference Id */
  reference_id: string;
  /** Left Id */
  left_id: string;
  /** Right Id */
  right_id: string;
  /** Id */
  id: number;
  /** Reference Length */
  reference_length: number;
  /** Reference Dataset */
  reference_dataset: string;
  /** Left Length */
  left_length: number;
  /** Left Dataset */
  left_dataset: string;
  /** Right Length */
  right_length: number;
  /** Right Dataset */
  right_dataset: string;
  /** Left Encoder Id */
  left_encoder_id: string;
  /** Right Encoder Id */
  right_encoder_id: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title backend API
 * @version 0.0.1
 *
 *
 * backend API.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name RootGet
   * @summary Root
   * @request GET:/
   */
  rootGet = (params: RequestParams = {}) =>
    this.request<object, any>({
      path: `/`,
      method: "GET",
      format: "json",
      ...params,
    });

  api = {
    /**
     * No description
     *
     * @tags Config
     * @name GetConfigApiLabelizerV1ConfigGet
     * @summary Get some configuration variables of the app.
     * @request GET:/api/labelizer/v1/config
     */
    getConfigApiLabelizerV1ConfigGet: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/api/labelizer/v1/config`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload
     * @name GetUploadStatusApiLabelizerV1UploadGet
     * @summary Get the status of the last triplets data upload.
     * @request GET:/api/labelizer/v1/upload
     */
    getUploadStatusApiLabelizerV1UploadGet: (params: RequestParams = {}) =>
      this.request<AllTripletsUploadStatus, any>({
        path: `/api/labelizer/v1/upload`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload
     * @name UploadDataInTheBackgroundApiLabelizerV1UploadPost
     * @summary Upload new data, including images and triplets. The data has to be a zipped folder containing a csv file named triplets, a csv file named validation_triplets and a folder named images containing the images. Needs to be authorized as an admin user. If you do not want to include triplets, you can provide a csv file with no line but still the header.
     * @request POST:/api/labelizer/v1/upload
     */
    uploadDataInTheBackgroundApiLabelizerV1UploadPost: (
      data: BodyUploadDataInTheBackgroundApiLabelizerV1UploadPost,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/labelizer/v1/upload`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Triplets
     * @name GetTripletApiLabelizerV1TripletGet
     * @summary Get the triplet for the user of the app.
     * @request GET:/api/labelizer/v1/triplet
     */
    getTripletApiLabelizerV1TripletGet: (
      query?: {
        /**
         * Validation
         * @default false
         */
        validation?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<TripletResponse | ValidationTripletResponse, HTTPValidationError>({
        path: `/api/labelizer/v1/triplet`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Triplets
     * @name SetTripletLabelApiLabelizerV1TripletPost
     * @summary Set the label of a triplet according to the user's choice.
     * @request POST:/api/labelizer/v1/triplet
     */
    setTripletLabelApiLabelizerV1TripletPost: (
      query: {
        /** Triplet Id */
        triplet_id: string;
        label: SelectedItemType;
        /**
         * Validation
         * @default false
         */
        validation?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/labelizer/v1/triplet`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Triplets
     * @name GetTripletStatsEndpointApiLabelizerV1TripletStatsGet
     * @summary Get the number of labeled and unlabeled triplets.
     * @request GET:/api/labelizer/v1/triplet/stats
     */
    getTripletStatsEndpointApiLabelizerV1TripletStatsGet: (params: RequestParams = {}) =>
      this.request<TripletStats, any>({
        path: `/api/labelizer/v1/triplet/stats`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Triplets
     * @name DownloadDbApiLabelizerV1DownloadGet
     * @summary Download triplets data in the csv format.
     * @request GET:/api/labelizer/v1/download
     */
    downloadDbApiLabelizerV1DownloadGet: (
      query?: {
        /**
         * Validation
         * @default false
         */
        validation?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/labelizer/v1/download`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Triplets
     * @name DeleteDbApiLabelizerV1DeleteDelete
     * @summary Delete triplets data inside the database.
     * @request DELETE:/api/labelizer/v1/delete
     */
    deleteDbApiLabelizerV1DeleteDelete: (
      query?: {
        /**
         * Validation
         * @default false
         */
        validation?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/labelizer/v1/delete`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Similarity
     * @name ComputeSimilarityScoreEndpointApiLabelizerV1SimilarityItem1IdItem2IdGet
     * @summary Compute a cosine similarity score between two items.
     * @request GET:/api/labelizer/v1/similarity/{item1_id}/{item2_id}
     */
    computeSimilarityScoreEndpointApiLabelizerV1SimilarityItem1IdItem2IdGet: (
      item1Id: string,
      item2Id: string,
      params: RequestParams = {},
    ) =>
      this.request<object, HTTPValidationError>({
        path: `/api/labelizer/v1/similarity/${item1Id}/${item2Id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Similarity
     * @name GetNearestNeighborsEndpointApiLabelizerV1NeighborsItemIdGet
     * @summary Get the nearest neighbors of an item.
     * @request GET:/api/labelizer/v1/neighbors/{item_id}
     */
    getNearestNeighborsEndpointApiLabelizerV1NeighborsItemIdGet: (
      itemId: string,
      query: {
        /** Nearest Neighbors Count */
        nearest_neighbors_count: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<object, HTTPValidationError>({
        path: `/api/labelizer/v1/neighbors/${itemId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Images
     * @name GetImageApiLabelizerV1ImagesImageIdGet
     * @summary Retrieve an image by its id. Does not need the extension. If you need the canonical image, provide 'canonical=true' as a query parameter.
     * @request GET:/api/labelizer/v1/images/{image_id}
     */
    getImageApiLabelizerV1ImagesImageIdGet: (
      imageId: string,
      query?: {
        /**
         * Canonical
         * @default false
         */
        canonical?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/labelizer/v1/images/${imageId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
