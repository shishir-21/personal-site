"use client";

import { useState, FormEvent } from "react";
import { m } from "framer-motion";
import { GridWrapper } from "./GridWrapper";

interface NewsletterSignUpProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

interface FormState {
  email: string;
  message: string;
  isSuccess: boolean;
  isLoading: boolean;
  website: string; // Honeypot field - should remain empty for real users
}

// react-doctor-disable-next-line react-doctor/no-giant-component
export function NewsletterSignUp({
  title = "Subscribe to my newsletter",
  description = "A periodic update about my life, recent blog posts, how-tos, and discoveries.",
  buttonText = "Subscribe",
}: NewsletterSignUpProps) {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    message: "",
    isSuccess: false,
    isLoading: false,
    website: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState((prev) => ({
      ...prev,
      message: "",
      isSuccess: false,
      isLoading: true,
    }));

    if (!formState.email) {
      setFormState((prev) => ({
        ...prev,
        message: "Please provide an email address.",
        isLoading: false,
      }));
      return;
    }

    // Newsletter backend not yet configured
    setFormState((prev) => ({
      ...prev,
      message: "Newsletter coming soon!",
      isSuccess: true,
      email: "",
      isLoading: false,
    }));
  };

  return (
    <div className="relative pb-16">
      <GridWrapper>
        <div className="relative overflow-x-clip">
          <div className="drama-shadow rounded-2xl bg-dark-primary p-14 md:p-[100px]">
            {/* Lines */}
            <div className="absolute left-0 right-0 top-[34px] z-10 h-px w-full bg-zinc-600 md:top-[48px]"></div>
            <div className="absolute bottom-0 right-[34px] top-0 z-10 h-full w-px bg-zinc-600 md:right-[48px]"></div>
            <div className="absolute bottom-[34px] left-0 right-0 z-10 h-px w-full bg-zinc-600 md:bottom-[48px]"></div>
            <div className="absolute bottom-0 left-[34px] top-0 z-10 h-full w-px bg-zinc-600 md:left-[48px]"></div>

            {/* Top Right Cross */}
            <div className="absolute right-[44.5px] top-[48px] z-20 hidden h-px w-2 bg-zinc-300 md:block"></div>
            <div className="absolute right-[48px] top-[44.5px] z-20 hidden h-2 w-px bg-zinc-300 md:block"></div>
            {/* Top Left Cross */}
            <div className="absolute left-[44.5px] right-0 top-[48px] z-20 hidden h-px w-2 bg-zinc-300 md:block"></div>
            <div className="absolute left-[48px] right-0 top-[44.5px] z-20 hidden h-2 w-px bg-zinc-300 md:block"></div>
            {/* Bottom Left Cross */}
            <div className="absolute bottom-[48px] left-[44.5px] right-0 z-20 hidden h-px w-2 bg-zinc-300 md:block"></div>
            <div className="absolute bottom-[44.5px] left-[48px] right-0 z-20 hidden h-2 w-px bg-zinc-300 md:block"></div>
            {/* Bottom Right Cross */}
            <div className="absolute bottom-[48px] right-[44.5px] z-20 hidden h-px w-2 bg-zinc-300 md:block"></div>
            <div className="absolute bottom-[44.5px] right-[48px] z-20 hidden h-2 w-px bg-zinc-300 md:block"></div>

            <h2 className="mb-4 text-3xl font-medium text-slate-50">{title}</h2>
            <p className="z-50 mb-8 max-w-[336px] text-base leading-8 text-gray-300 md:mb-12">
              {description}
            </p>
            <div className="z-50 mb-4 space-y-4">
              <form
                onSubmit={handleSubmit}
                className="relative md:inline-block"
              >
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="bobloblaw@gmail.com"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-full border border-gray-400 bg-transparent px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:ring-offset-2 focus:ring-offset-dark-primary md:w-[425px]"
                  disabled={formState.isLoading}
                />
                {/* Honeypot field - hidden from real users, bots will fill this */}
                <div
                  aria-hidden="true"
                  className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
                >
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formState.website}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="group absolute right-1 top-1 isolate inline-flex h-[42px] items-center justify-center overflow-hidden rounded-full bg-slate-100 px-4 py-2.5 text-left text-sm font-medium text-slate-900 shadow-[0_1px_theme(colors.white/0.07)_inset,0_1px_3px_theme(colors.gray.900/0.2)] ring-1 ring-white transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-b before:from-white/20 before:opacity-50 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-full after:bg-gradient-to-b after:from-white/10 after:from-[46%] after:to-[54%] after:mix-blend-overlay hover:before:opacity-100"
                  disabled={formState.isLoading}
                >
                  {formState.isLoading ? "Loading..." : buttonText}
                </button>
              </form>
              {/* Set minimum height to prevent layout shift */}
              <div className="min-h-[15px] md:min-h-[30px]">
                {formState.message && (
                  <p
                    className={`text-sm ${
                      formState.isSuccess ? "text-indigo-300" : "text-rose-400"
                    }`}
                  >
                    {formState.message}
                  </p>
                )}
              </div>
            </div>
            <p className="text-base text-gray-300">
              <span className="font-bold text-white">NO SPAM.</span> I never
              send spam. You can unsubscribe at any time!
            </p>
            <svg
              className="absolute -top-8 right-0 z-10 hidden lg:block"
              width="453"
              height="501"
              viewBox="0 0 453 501"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_i_185_3161)">
                <path
                  d="M297.18 327.45C262.78 292.29 227.45 258.05 192.52 223.41C190.94 221.84 189.3 220.27 187.71 218.66C178.01 208.64 177.2 195.88 185.72 187.85C193.91 180.09 206.38 181.02 215.92 190.48C252.02 226.08 287.8 261.97 324.08 297.42C372.2 344.41 450.62 334.75 485.99 277.79C511.05 237.43 504.4 186.06 468.55 150.22C434.44 116.08 400.14 82.13 325.61 8.37C320.93 3.74 313.39 3.73 308.71 8.36L296.24 20.7C291.48 25.41 291.51 33.12 296.28 37.81C371.95 112.24 407.14 147.22 442.21 182.31C471.02 211.18 463.41 259.38 427.43 279C402.4 292.61 373.58 288.53 351.67 267.18C315.02 231.48 279 195.31 242.57 159.51C237 153.96 230.35 149.54 223.01 146.51C215.67 143.49 207.78 141.92 199.81 141.88C191.84 141.85 183.94 143.37 176.58 146.34C169.22 149.31 162.53 153.67 156.91 159.18C145.25 170.49 138.65 185.83 138.57 201.87C138.49 217.9 144.92 233.31 156.46 244.73C191.96 280.38 227.94 315.58 263.35 351.31C269.34 357.33 274.96 364.35 278.6 371.94C292 400.04 283 431.48 257.32 449.37C233.28 466.12 200.59 463.26 178.62 441.71C151.25 414.83 124.13 387.72 38.19 302.52C33.52 297.88 25.98 297.88 21.3 302.51L8.6 315.1C3.86 319.79 3.86 327.44 8.59 332.14C95.01 417.88 122.89 445.32 151.2 472.38C170.05 490.51 195.39 500.77 221.86 501C248.33 501.22 273.85 491.4 293.01 473.6C334.84 434.92 337.11 368.31 297.18 327.45Z"
                  fill="url(#paint0_linear_185_3161)"
                />
                <path
                  d="M215.22 416.71C215.71 416.91 216.16 417.11 216.64 417.28C225.72 419.82 234.04 417.48 239.18 409.04C245.05 399.43 243.26 390.48 235.35 382.6C198.79 346.38 162.11 310.28 125.72 273.92C92.95 241.1 87.29 190.59 111.34 149.73C133.95 111.34 181.64 92.08 225.64 103.59C243.54 108.28 259.06 116.78 272.24 129.88C307.89 165.4 343.51 200.96 379.85 235.76C385.07 240.77 394.53 244.16 401.66 243.6C407 243.2 413.44 236.13 416.38 230.48C420.58 222.37 416.21 214.77 409.82 208.43C373.21 172.3 336.75 135.97 300.1 99.83C282.05 81.99 260.25 70.73 235.67 64.23C178.41 49.09 113.29 72.78 80.97 120.67C46.53 171.74 46.45 240.24 83.99 286.46C88.3 291.8 92.87 296.93 97.6 301.94C112.44 319.86 159.14 364.3 189.21 392.56L211.06 414.2C211.59 414.73 212.16 415.18 212.77 415.54C213.5 415.95 214.23 416.3 214.98 416.59"
                  fill="url(#paint1_linear_185_3161)"
                />
              </g>
              <defs>
                <filter
                  id="filter0_i_185_3161"
                  x="0"
                  y="0"
                  width="501"
                  height="503"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="2" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="shape"
                    result="effect1_innerShadow_185_3161"
                  />
                </filter>
                <m.linearGradient
                  id="paint0_linear_185_3161"
                  x1="250.5"
                  y1="119.84"
                  x2="250.5"
                  y2="501"
                  gradientUnits="userSpaceOnUse"
                >
                  <m.stop
                    animate={{
                      stopColor: formState.isSuccess ? "#4f46e5" : "#4B4B4F",
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <m.stop
                    offset="1"
                    animate={{
                      stopColor: formState.isSuccess ? "#818cf8" : "#3C3C3F",
                      stopOpacity: formState.isSuccess ? 1 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </m.linearGradient>
                <m.linearGradient
                  id="paint1_linear_185_3161"
                  x1="236.76"
                  y1="59.69"
                  x2="236.76"
                  y2="418.25"
                  gradientUnits="userSpaceOnUse"
                >
                  <m.stop
                    animate={{
                      stopColor: formState.isSuccess ? "#4f46e5" : "#4B4B4F",
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <m.stop
                    offset="1"
                    animate={{
                      stopColor: formState.isSuccess ? "#818cf8" : "#3C3C3F",
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </m.linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </GridWrapper>
      <span className="absolute bottom-6 left-8">
        <svg
          width="24"
          height="14"
          viewBox="0 0 24 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.24"
            d="M0.83 6.88V6.01C1.39 6.01 1.78 5.9 2.01 5.67C2.23 5.44 2.34 5.06 2.34 4.54V3.27C2.34 2.71 2.41 2.25 2.55 1.9C2.7 1.54 2.9 1.26 3.17 1.06C3.45 0.86 3.78 0.73 4.17 0.65C4.56 0.57 5 0.53 5.5 0.53V1.91C5.11 1.91 4.81 1.97 4.6 2.08C4.39 2.18 4.25 2.35 4.17 2.57C4.09 2.79 4.05 3.07 4.05 3.42V5.05C4.05 5.3 4.01 5.54 3.92 5.76C3.84 5.99 3.68 6.18 3.45 6.35C3.22 6.52 2.9 6.65 2.47 6.74C2.05 6.84 1.5 6.88 0.83 6.88ZM5.5 13.16C5 13.16 4.56 13.12 4.17 13.04C3.78 12.97 3.45 12.83 3.17 12.63C2.9 12.43 2.7 12.15 2.55 11.8C2.41 11.44 2.34 10.98 2.34 10.42V9.16C2.34 8.64 2.23 8.26 2.01 8.03C1.78 7.8 1.39 7.68 0.83 7.68V6.81C1.5 6.81 2.05 6.86 2.47 6.96C2.9 7.05 3.22 7.18 3.45 7.35C3.68 7.52 3.84 7.71 3.92 7.93C4.01 8.15 4.05 8.39 4.05 8.64V10.27C4.05 10.62 4.09 10.9 4.17 11.12C4.25 11.35 4.39 11.51 4.6 11.62C4.81 11.73 5.11 11.79 5.5 11.79V13.16ZM0.83 7.68V6.01H2.4V7.68H0.83ZM14.43 0.34L11.15 12.53H9.57L12.85 0.34H14.43ZM23.17 6.81V7.68C22.61 7.68 22.21 7.8 21.99 8.03C21.77 8.26 21.65 8.64 21.65 9.16V10.42C21.65 10.98 21.58 11.44 21.44 11.8C21.3 12.15 21.1 12.43 20.82 12.63C20.55 12.83 20.22 12.97 19.83 13.04C19.44 13.12 19 13.16 18.5 13.16V11.79C18.89 11.79 19.19 11.73 19.4 11.62C19.61 11.51 19.75 11.35 19.83 11.12C19.9 10.9 19.94 10.62 19.94 10.27V8.64C19.94 8.39 19.99 8.15 20.07 7.93C20.16 7.71 20.32 7.52 20.55 7.35C20.77 7.18 21.1 7.05 21.52 6.96C21.94 6.86 22.5 6.81 23.17 6.81ZM18.5 0.53C19 0.53 19.44 0.57 19.83 0.65C20.22 0.73 20.55 0.86 20.82 1.06C21.1 1.26 21.3 1.54 21.44 1.9C21.58 2.25 21.65 2.71 21.65 3.27V4.54C21.65 5.06 21.77 5.44 21.99 5.67C22.21 5.9 22.61 6.01 23.17 6.01V6.88C22.5 6.88 21.94 6.84 21.52 6.74C21.1 6.65 20.77 6.52 20.55 6.35C20.32 6.18 20.16 5.99 20.07 5.76C19.99 5.54 19.94 5.3 19.94 5.05V3.42C19.94 3.07 19.9 2.79 19.83 2.57C19.75 2.35 19.61 2.18 19.4 2.08C19.19 1.97 18.89 1.91 18.5 1.91V0.53ZM23.17 6.01V7.68H21.6V6.01H23.17Z"
            fill="#A5AEB8"
          />
        </svg>
      </span>
      <span className="absolute bottom-6 right-8">
        <svg
          width="24"
          height="8"
          viewBox="0 0 24 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_i_185_3210)">
            <rect width="24" height="8" rx="1" fill="#EDEEF2" />
          </g>
          <defs>
            <filter
              id="filter0_i_185_3210"
              x="0"
              y="0"
              width="24"
              height="9.5"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="0.75" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.65 0 0 0 0 0.68 0 0 0 0 0.72 0 0 0 0.32 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_185_3210"
              />
            </filter>
          </defs>
        </svg>
      </span>
    </div>
  );
}
