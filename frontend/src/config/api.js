let baseURL = "/";

/* eslint-disable-next-line no-undef */
if (process.env.NODE_ENV === "development") {
  baseURL = "http://127.0.0.1:9000/";
}

export { baseURL };
