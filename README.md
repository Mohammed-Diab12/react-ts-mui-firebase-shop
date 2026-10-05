# CAMARO — React E-Commerce Store

A full-featured e-commerce storefront built as a training project, implementing product browsing, cart management, wishlist/compare, reviews, authentication, and an admin product-creation flow — all backed by Firebase.

**🔗 Live demo:** [camaro-ecommerce.surge.sh](https://camaro-ecommerce.surge.sh/)

![Homepage in light mode](./src/assets/HomePage.PNG)
_Homepage — category carousels, promo banner, and brand strip (light mode)._

![Homepage in dark mode](./src/assets/HomePageDark.PNG)
_The same homepage in dark mode — theme toggle persists across sessions._

![Laptop section, two-row grid carousel](./src/assets/Laptop.PNG)
_The Laptop section uses a 2-row grid carousel instead of a single scrolling row._

## Features

- 🛍️ **Product browsing** — homepage category carousels (Swiper, scroll-snap, multi-row grid for Laptops), a dedicated Shop page with category filters, sorting, pagination, and search
- 🔍 **Search** — header search bar driving `/shop?q=...`, so results are bookmarkable and shareable
- 🛒 **Cart** — persisted per-user in Firestore, debounced quantity updates, automatic re-sync on login/logout with no page refresh needed
- ⭐ **Reviews & ratings** — one review per user per product, product `rating`/`ratingCount` recalculated atomically via Firestore transactions whenever a review is added, edited, or deleted
- ❤️ **Wishlist** & 🔀 **Compare** — per-user, stored in Firestore (`users/{uid}/wishlist`, `users/{uid}/compare`), with a side-by-side comparison table page
- 🔐 **Authentication** — Google and GitHub sign-in via Firebase Auth, with anonymous sessions for guest carts
- 👤 **Profile page** — signed-in user's info and sign-out
- 🛠️ **Admin product creation** — a gated form to add new products, restricted to accounts listed in a Firestore `admins` collection and enforced server-side via Firestore Security Rules
- 🌗 **Dark / light mode** — theme toggle with persisted preference; even the brand logo assets (Swatch, Yody) swap per theme
- 📱 **Fully responsive** — mobile sidebar drawer navigation, sticky header, scroll-snap carousels, responsive grids throughout

![Shop page in light mode](./src/assets/ProductsPage.PNG)
_The Shop page — category chips, sort dropdown, and paginated results._

![Shop page in dark mode](./src/assets/ProductsDarkMode.PNG)
_The same Shop page in dark mode._

![Searching for a product](./src/assets/searchFun.PNG)
_Searching from the header navigates to `/shop?q=...`, filtering results by title._

![Product detail page](./src/assets/ProductDetails.PNG)
_Product detail page — gallery, price with discount badge, rating, quantity selector, and wishlist/compare actions._

![The Reviews tab on a product page](./src/assets/Rating.PNG)
_The Reviews tab — submit a rating and comment; the product's average rating updates automatically._

![Wishlist page](./src/assets/WishlistPage.PNG)
_Saved products on the Wishlist page._

![Compare page](./src/assets/ComparePage.PNG)
_Side-by-side product comparison across category, price, stock, SKU, and description._

![Shopping cart page](./src/assets/Cart.PNG)
_Cart page — quantity steppers and the order summary box._

## Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Framework  | React 19 + TypeScript (Vite)                            |
| UI         | Material UI (MUI)                                       |
| Carousels  | Swiper                                                  |
| State      | React Context API (Cart, Auth, Theme, Product Features) |
| Backend    | Firebase (Firestore + Authentication)                   |
| Routing    | React Router                                            |
| Deployment | Surge                                                   |

See `package.json` for exact dependency versions.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A Firebase project with **Firestore** and **Authentication** enabled (Google + GitHub providers turned on)

### Installation

```bash
git clone https://github.com/Mohammed-Diab12/react-ts-mui-firebase-shop.git
cd react-ts-mui-firebase-shop
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Firestore Setup

1. Create a `products` collection — see the `Product` type in `src/types.ts` for the expected shape (includes `rating`/`ratingCount`, maintained automatically by the review functions in `productService.ts`).
2. Create an `admins` collection — add a document whose **ID is a user's Firebase Auth UID** to grant that account access to the product-creation page (`/products/new`).
3. Deploy Firestore Security Rules enforcing:
   - `products` writes require the requester's UID to exist in `admins`
   - `admins` is readable only by its own UID and not writable from the client at all
   - `carts/{cartId}` and `carts/{cartId}/items/{itemId}` readable/writable only by the matching UID
   - `users/{uid}/wishlist` and `users/{uid}/compare` readable/writable only by the matching UID, and only for non-anonymous accounts

### Run locally

```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── cart/              # CartTable, QuantityStepper, CartSummaryBox (mock checkout), CartEmpty
│   ├── footer/             # Footer, newsletter signup form, social links, payment icons
│   ├── Header/             # Header, Navbar, Sidebar (mobile drawer), UserMenu
│   ├── headerAction/       # Wishlist / Compare / Cart header icons with live counts
│   ├── Home/                # ProductCard, category carousels (Swiper), promo banner, brand strip
│   ├── product/             # Gallery, info, tabs, reviews, review form, add-to-cart, secondary actions
│   ├── shop/                 # ProductGrid, ShopFilters, ShopPagination, ShopHeader
│   ├── themeToggleButton/
│   └── SearchBar.tsx
├── context/        # CartContext, AuthContext, ThemeContext, ProductFeaturesContext (wishlist/compare)
├── mainlayout/     # Layout.tsx (ScrollToTop + Header + Outlet + Footer)
├── pages/          # Home, Shop, Product, Cart, Wishlist, Compare, Login, Profile, Create Product
├── routes/         # Router.tsx — route definitions
├── services/       # Firebase-backed data access: product, cart, auth, admin, reviews, product features
├── theme/          # Light/dark MUI theme definitions + ThemeProvider (theme-aware brand logo assets)
├── mui.d.ts        # Module augmentation for custom palette keys (content, brand) and brandLogos
└── types.ts        # Shared TypeScript interfaces
```

![Login page](./src/assets/login.PNG)
_Login page — Google and GitHub sign-in._

![Profile page](./src/assets/ProfilePage.PNG)
_Profile page — shows the signed-in user's name, email, and sign-in provider._

## Authentication & Cart Behavior

- Every visitor gets an **anonymous Firebase Auth session** automatically the first time they touch the cart, so guests can shop without creating an account.
- Cart state is synced in real time to the signed-in user's `uid` — switching accounts updates the cart immediately, no refresh required.

## Admin Access

Product creation (`/products/new`) is gated in two layers:

1. **UI** — the page only shows the creation form to accounts found in the `admins` Firestore collection; anonymous and non-admin signed-in users see an appropriate blocked/sign-in message instead.
2. **Firestore Security Rules** — writes to `products` are rejected server-side unless the requesting user's UID has a matching document in `admins`, so the restriction can't be bypassed by calling Firestore directly.

![Access gate for non-admins](./src/assets/CreateProductAccess.PNG)
_An authenticated but non-admin user sees a blocked message instead of the form._

![Create product form](./src/assets/CreateProductForm.PNG)
_Admins see the product-creation form after confirming they want to add a listing._

## Deployment

The live demo is deployed via [Surge](https://surge.sh/):

```bash
npm run build
surge dist
```

## Team

- Mohammed Diab — [GitHub](https://github.com/Mohammed-Diab12)
- Salsabeel Shomali — [GitHub](https://github.com/salsabeelshomali)
