/**
 * UI_STRINGS
 * Centralized source of truth for all static text in the application.
 * Use 'as const' to ensure deep immutability and perfect TypeScript types.
 */
export const UI_STRINGS = {
  NAV: {
    BRAND: "DotMarket",
    TAGLINE: "Fresh groceries delivered to your door.",
    HOME: "Supermarket",
    SUPPORT: "Support",
    PROFILE: "My Account",
    ORDERS: "Orders & Lists",
    CART: "Shopping Basket",
  },
  
  COMMON: {
    SAVE: "Save",
    CANCEL: "Cancel",
    DELETE: "Remove",
    CLOSE: "Close",
    BACK: "Go Back",
    SEARCH_PLACEHOLDER: "Search for groceries...",
    LOADING: "Loading, please wait...",
    ERROR_DEFAULT: "Something went wrong. Please try again.",
    SUPPORT:"Support",
    SEARCH_GENERIC: "Search bla bla...",
    
  },

  HOME: {
    HERO: {
      HEADLINE: "Everyday shopping, made simple",
      CTA: "Shop now",
    },
    TRUST_STRIP: {
      ARIA_LABEL: "Why shop with DotMarket",
      ITEMS: {
        RANGE: {
          LABEL: "Fresh food & everyday essentials",
          SUBTEXT: "Browse produce, dairy, bakery, pantry and household categories.",
        },
        STOCK: {
          LABEL: "Stock checked at checkout",
          SUBTEXT: "Items are confirmed available before your order is placed.",
        },
        ORDERS: {
          LABEL: "Check your order status",
          SUBTEXT: "See every order and its status in My Orders.",
        },
        ACCOUNT: {
          LABEL: "Password-protected accounts",
          SUBTEXT: "Sign in to check out and view your own orders.",
        },
      },
    },
    NEW_ARRIVALS: {
      TITLE: "New arrivals",
      SUBTEXT: "The latest products added to the store.",
    },
    ALMOST_GONE: {
      TITLE: "Almost gone",
      SUBTEXT: "Only a few left of these products.",
    },
  },

  CART: {
    TITLE: "Your Cart",
    EMPTY_MESSAGE: "Your basket is empty. Start adding some fresh items!",
    CHECKOUT: "Proceed to Checkout",
    SUBTOTAL: "Subtotal",
    SHIPPING: "Delivery Fee",
    TOTAL: "Total Amount",
  },
  PRODUCT: {
    ADD_TO_CART: "Add to Cart",
    OUT_OF_STOCK: "Out of Stock",
    SALE: "Sale!",
    UNIT_KG: "per kg",
    UNIT_PIECE: "per unit",
    PRICE_TAG: (price: number) => `$${price.toFixed(2)}`,
  },

  AUTH: {
    LOGIN: "Login",
    SIGNUP: "Create Account",
    LOGOUT: "Sign Out",
    WELCOME_BACK: "Welcome back to Seoncha!",
    FORGOT_PASSWORD: "Forgot password?",
  },

  FOOTER: {
    COPYRIGHT: (year: number) => `© ${year} Supermarket. All rights reserved.`,
    HELP_CENTER: "Help Center",
    PRIVACY_POLICY: "Privacy Policy",
    TERMS: "Terms of Service",
    COMPANY_SECTION: "Company",
    ABOUT_US: "About Us",
    STORES: "Our Stores",
    CONTACT: "Contact",
    DELIVERY_INFO: "Delivery Info",
    DOWNLOAD_APP: "Download our App",
    APP_STORE: "App Store",
    GOOGLE_PLAY: "Google Play",
  }
} as const;

// This type allows you to use UI_STRINGS in other parts of the app with full type safety
export type UiStrings = typeof UI_STRINGS;