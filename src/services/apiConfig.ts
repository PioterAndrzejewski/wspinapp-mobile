// export const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// export const apiUrl = "http://localhost:1337";
// export const apiUrl = "http://192.168.50.153:1337";
// export const apiUrl = "https://strapi-70c7.onrender.com";
export const apiUrl = "https://dev.wspinapp.pl";

export const apiConfig = {
  auth: {
    login: `${apiUrl}/api/auth/local/`,
    loginWGoogleIntent: `${apiUrl}/api/connect/google`,
    loginGoogle: (params: string) =>
      `${apiUrl}/api/auth/google/callback?${params}`,
    register: `${apiUrl}/api/auth/local/register/`,
    resendVerification: `${apiUrl}/api/auth/send-email-confirmation/`,
    forgotPassword: `${apiUrl}/api/auth/forgot-password/`,
    refreshToken: `${apiUrl}/api/token/refresh/`,
    changePass: `${apiUrl}/api/auth/change-password`,
  },
  user: {
    me: `${apiUrl}/api/users/me`,
  },
  topo: {
    areas: (qs: string) => `${apiUrl}/api/map-areas?${qs}`,
    regions: (qs: string) => `${apiUrl}/api/map-regions?${qs}`,
    sectors: (qs: string) => `${apiUrl}/api/map-sectors?${qs}`,
    rocks: (qs: string) => `${apiUrl}/api/rocks?${qs}`,
  },
  ratings: {
    create: `${apiUrl}/api/ratings`,
    update: (id: number) => `${apiUrl}/api/ratings/${id}`,
    get: (qs: string) => `${apiUrl}/api/ratings?${qs}`,
  },
  comments: {
    create: `${apiUrl}/api/comments`,
    update: (id: number | undefined) => `${apiUrl}/api/comments/${id}`,
    get: (qs: string) => `${apiUrl}/api/comments?${qs}`,
  },
  product: {
    get: (qs: string) => `${apiUrl}/api/products?${qs}`,
  },
  subscription: {
    get: `${apiUrl}/api/subscription-product`,
  },
  productTransaction: {
    get: (qs: string) => `${apiUrl}/api/product-transactions?${qs}`,
  },
  payments: {
    intent: `${apiUrl}/api/payments`,
    confirm: `${apiUrl}/api/payments/confirm`,
  },
};
