import { SVGProps } from 'react'

/**
 *
 * Render a brain
 * @returns jsx
 */
export const RenderBrainSvg = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 931.843 931.843"
      {...props}
    >
      <g>
        <path d="M926.932,305.137c12.301-38.3,1.4-86.6-32-124c-14.5-16.2-31.4-28.5-49.199-36.5c-5.1-8.4-11.201-16.6-18.1-24.4   c-29.9-33.5-69.4-51.5-105.701-51.7c-25.4-19.5-59.699-34.3-98.699-40.4c-30.7-4.8-60.3-3.6-86.2,2.4c-22.5-9.8-49-13.8-76.8-10.3   c-28.899,3.7-54.5,14.9-74.1,31c-31-14-70.9-14.8-108.9,0.9c-32.7,13.5-57.8,36.5-72,63c-25.4,5.6-51.1,19.1-73,40.1   c-31.1,29.8-47.5,68-47.4,102.8c-37.8,21-61.8,57.1-60.1,95.6c-10.1,15.4-17.7,33.5-21.7,53.4c-6.9,34.5-1.7,67.899,12.3,94.3   c-1,58.3,31.7,108.6,80.9,118.4c3.2,0.6,6.4,1.1,9.6,1.399c-1.7,12.101-1.5,24.4,1,36.7c14.1,71.1,95.7,114.8,182.3,97.6   c3.899-0.8,7.8-1.699,11.6-2.699l0,0c12.9,20.699,39.7,11.8,39.7,11.8v76.6c0,8.2,3.1,16,8.8,22l42.4,44.7   c9.899,10.5,27.5,3.4,27.5-11v-86.6c2.6-78.101,31.3-116.7,55.8-131.4c33-19.9,32.5-61.3,32.3-76.4   c26,13.7,67.101,21.5,101.5,17.601c155.199-17.9,163.299-122.3,168.4-139.4c45.299,3.4,86.898-15.8,104.898-52.7   c2.5-5.199,4.5-10.6,5.9-16c15-8.899,27.301-21.6,35.1-37.6C933.633,352.737,934.332,328.337,926.932,305.137z" />
      </g>
    </svg>
  )
}

/**
 *
 * Render a thumb icon
 * @returns jsx
 */
export const RenderThumbIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 169 158">
      <switch>
        <g>
          <path d="M8.5 133.7V72.9c0-1.6.6-3.1 1.8-4.3 1.2-1.2 2.6-1.8 4.3-1.8H42c1.6 0 3.1.6 4.3 1.8 1.2 1.2 1.8 2.6 1.8 4.3v60.8c0 1.6-.6 3.1-1.8 4.3-1.2 1.2-2.6 1.8-4.3 1.8H14.6c-1.6 0-3.1-.6-4.3-1.8-1.2-1.2-1.8-2.6-1.8-4.3zm12.2-12.1c0 1.7.6 3.2 1.8 4.3 1.2 1.2 2.6 1.8 4.3 1.8 1.6 0 3.1-.6 4.3-1.8 1.2-1.2 1.8-2.6 1.8-4.3 0-1.6-.6-3.1-1.8-4.3-1.2-1.2-2.6-1.8-4.3-1.8-1.7 0-3.2.6-4.3 1.8-1.2 1.2-1.8 2.6-1.8 4.3zm33.4 12.1V72.8c0-1.6.6-3 1.7-4.1 1.1-1.2 2.5-1.8 4.1-1.9 1.5-.1 3.9-2 7.2-5.6 3.3-3.6 6.5-7.4 9.6-11.5 4.3-5.5 7.5-9.3 9.6-11.4 1.1-1.1 2.1-2.7 2.9-4.6.8-1.9 1.4-3.4 1.7-4.6.3-1.2.7-3.1 1.3-5.7.4-2.5.8-4.4 1.2-5.8.3-1.4 1-3 1.9-4.9.9-1.9 2-3.5 3.2-4.7 1.2-1.2 2.6-1.8 4.3-1.8 2.9 0 5.5.3 7.8 1s4.2 1.5 5.7 2.5 2.8 2.3 3.8 3.8c1 1.6 1.8 3 2.3 4.3.5 1.3.9 2.8 1.1 4.7.3 1.9.4 3.3.5 4.3v3.7c0 2.4-.3 4.8-.9 7.2-.6 2.4-1.2 4.3-1.8 5.7-.6 1.4-1.5 3.2-2.6 5.3-.2.4-.5.9-.9 1.7-.4.8-.8 1.5-1 2.1-.3.6-.5 1.4-.8 2.3h26.3c4.9 0 9.2 1.8 12.8 5.4s5.4 7.9 5.4 12.8c0 5.4-1.7 10.2-5.2 14.2.9 2.8 1.4 5.2 1.4 7.2.2 4.8-1.2 9.2-4.1 13 1.1 3.5 1.1 7.3 0 11.1-.9 3.6-2.7 6.6-5.1 8.9.6 7.1-1 12.8-4.7 17.2-4.1 4.8-10.3 7.3-18.7 7.4h-12.2c-4.2 0-8.7-.5-13.7-1.5-4.9-1-8.8-1.9-11.5-2.8-2.8-.9-6.6-2.1-11.4-3.8-7.8-2.7-12.8-4.1-15-4.2-1.6-.1-3.1-.7-4.3-1.9-1.3-1-1.9-2.4-1.9-4.1z" />
        </g>
      </switch>
    </svg>
  )
}

/**
 *
 * Render a info svg
 * @returns jsx
 */
export const RenderInfoSVG = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg height="160" width="160" viewBox="0 0 160 160" {...props}>
      <g fill="currentColor">
        <path d="m80 15c-35.88 0-65 29.12-65 65s29.12 65 65 65 65-29.12 65-65-29.12-65-65-65zm0 10c30.36 0 55 24.64 55 55s-24.64 55-55 55-55-24.64-55-55 24.64-55 55-55z" />
        <path
          d="m57.373 18.231a9.3834 9.1153 0 1 1 -18.767 0 9.3834 9.1153 0 1 1 18.767 0z"
          transform="matrix(1.1989 0 0 1.2342 21.214 28.75)"
        />
        <path d="m90.665 110.96c-0.069 2.73 1.211 3.5 4.327 3.82l5.008 0.1v5.12h-39.073v-5.12l5.503-0.1c3.291-0.1 4.082-1.38 4.327-3.82v-30.813c0.035-4.879-6.296-4.113-10.757-3.968v-5.074l30.665-1.105" />
      </g>
    </svg>
  )
}

/**
 *
 * Render a delete button
 * @returns jsx
 */
export const RenderRedHoldButton = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className="dark:fill-gray-500"
      height="100%"
      width="100%"
      {...props}
      viewBox="0 0 496.158 496.158"
    >
      <path
        pointerEvents={'none'}
        className="fill-red-400"
        d="M0,248.085C0,111.063,111.069,0.003,248.075,0.003c137.013,0,248.083,111.061,248.083,248.082
	c0,137.002-111.07,248.07-248.083,248.07C111.069,496.155,0,385.087,0,248.085z"
      />
      <path
        pointerEvents={'none'}
        fill="#FFFFFF"
        d="M383.546,206.286H112.612c-3.976,0-7.199,3.225-7.199,7.2v69.187c0,3.976,3.224,7.199,7.199,7.199
	h270.934c3.976,0,7.199-3.224,7.199-7.199v-69.187C390.745,209.511,387.521,206.286,383.546,206.286z"
      />
    </svg>
  )
}

/**
 * renders a grey tick
 * @returns jsx
 */
export const RenderGreyTick = ({ ...props }: SVGProps<SVGSVGElement>) => (
  <>
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      className="h-3 w-3"
      viewBox="0 0 24 24"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  </>
)
/**
 * renders svg icon for upload to cloud
 * @returns jsx
 */
export const RenderUploadCloudSVG = ({ ...props }: SVGProps<SVGSVGElement>) => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      shape-rendering="geometricPrecision"
      text-rendering="geometricPrecision"
      image-rendering="optimizeQuality"
      fill-rule="evenodd"
      clip-rule="evenodd"
      viewBox="0 0 512 386.883"
      {...props}
    >
      <path
        pointerEvents={'none'}
        fill-rule="nonzero"
        d="M377.763 115.7c-9.42 2.733-18.532 6.86-27.591 12.155-9.256 5.41-18.373 12.031-27.649 19.629l-19.849-22.742c16.721-15.527 33.187-26.464 49.108-33.514-13.06-22.39-31.538-38.532-52.418-48.549-21.339-10.238-45.242-14.171-68.507-11.922-23.123 2.234-45.56 10.619-64.123 25.025-21.451 16.646-37.775 41.521-44.034 74.469l-1.959 10.309-10.27 1.801c-27.993 4.909-49.283 18.793-62.859 36.776-7.186 9.518-12.228 20.161-14.969 31.19-2.728 10.979-3.193 22.399-1.243 33.525 3.291 18.766 13.592 36.737 31.669 50.382 5.467 4.128 11.376 7.709 17.886 10.48 6.215 2.647 13.017 4.612 20.558 5.686h78.258v30.246h-78.827l-1.891-.178c-11.099-1.413-20.982-4.186-29.914-7.99-8.994-3.829-16.989-8.65-24.264-14.142C20.256 299.753 6.183 275.02 1.628 249.05c-2.669-15.225-2.027-30.868 1.715-45.929 3.73-15.012 10.524-29.404 20.167-42.177 16.233-21.507 40.501-38.514 71.737-46.241 9.014-35.904 28.299-63.573 53.057-82.786C171.438 13.963 199.327 3.521 228.021.748c28.551-2.76 57.975 2.11 84.339 14.758 28.095 13.479 52.661 35.696 68.986 66.815 13.827-2.201 27.042-1.521 39.42 1.5 18.862 4.603 35.493 14.611 49.212 28.159 13.36 13.193 23.994 29.797 31.216 48.001 16.814 42.377 15.209 93.978-13.361 131.996-9.299 12.37-21.252 22.45-35.572 30.468-13.811 7.735-29.884 13.593-47.949 17.787l-3.368.414h-66.346V310.4h64.727c14.501-3.496 27.297-8.212 38.168-14.299 10.794-6.045 19.62-13.396 26.238-22.2 21.842-29.066 22.745-69.34 9.463-102.815-5.698-14.359-13.999-27.371-24.363-37.605-10.007-9.882-21.906-17.126-35.154-20.36-6.654-1.625-13.721-2.248-21.145-1.705l-14.769 4.284zM205.205 265.348c-5.288 6.391-14.756 7.285-21.148 1.997-6.391-5.288-7.285-14.757-1.997-21.148l59.645-72.019c5.288-6.392 14.757-7.285 21.148-1.998a15.053 15.053 0 012.707 2.921l60.072 72.279c5.287 6.359 4.42 15.802-1.939 21.09-6.359 5.287-15.801 4.42-21.089-1.939l-34.288-41.256.202 146.628c0 8.273-6.707 14.98-14.98 14.98-8.274 0-14.981-6.707-14.981-14.98l-.202-146.582-33.15 40.027z"
      />
    </svg>
  </>
)
/**
 * renders a grey tick
 * @returns jsx
 */
export const RenderUpArrow = ({ ...props }: SVGProps<SVGSVGElement>) => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="#000000"
      version="1.1"
      id="Layer_1"
      viewBox="0 0 330 330"
      xmlSpace="preserve"
      {...props}
    >
      <path
        id="XMLID_224_"
        d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394  l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393  C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
      />
    </svg>
  </>
)
/**
 * renders a grey tick
 * @returns jsx
 */
export const RenderDownArrow = ({ ...props }: SVGProps<SVGSVGElement>) => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="#000000"
      height="800px"
      width="800px"
      version="1.1"
      id="Layer_1"
      viewBox="0 0 330 330"
      xmlSpace="preserve"
      {...props}
    >
      <path
        id="XMLID_225_"
        d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393  c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393  s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
      />
    </svg>
  </>
)

/**
 * renders a grey tick
 * @returns jsx
 */
export const RenderRedoIcon = ({ ...props }: SVGProps<SVGSVGElement>) => (
  <>
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      <path
        d="M202.238 167.072c.974-1.973 3.388-2.796 5.372-1.847l7.893 3.775s-22.5 53.5-85.5 56c-60-1.5-96.627-48.626-97-96.5-.373-47.874 37-95.5 95.5-96 57.5-1 79.555 45.004 79.555 45.004 1.074 1.93 1.945 1.698 1.945-.501V51.997a4 4 0 0 1 4-3.997h6.5c2.209 0 4 1.8 4 4.008v48.984a3.998 3.998 0 0 1-3.998 4.008H170a3.995 3.995 0 0 1-3.998-3.993v-6.014c0-2.205 1.789-4.02 4.007-4.053l25.485-.38c2.213-.033 3.223-1.679 2.182-3.628 0 0-18.174-41.932-68.674-41.432-49 .5-82.751 41.929-82.5 83.242 3 55.258 45 82.258 83.5 81.258 54.5 0 72.235-42.928 72.235-42.928z"
        fillRule="evenodd"
      />
    </svg>
  </>
)

/**
 * renders an add SVG
 * @param param onclick
 * @returns
 */
export const RenderAddButtonSVG = ({ ...props }: SVGProps<SVGSVGElement>) => (
  <svg height="100%" width="100%" viewBox="0 0 122.88 122.88" {...props}>
    <path
      pointerEvents={'none'}
      d="M61.44,0A61.46,61.46,0,1,1,18,18,61.25,61.25,0,0,1,61.44,0ZM88.6,56.82v9.24a4,4,0,0,1-4,4H70V84.62a4,4,0,0,1-4,4H56.82a4,4,0,0,1-4-4V70H38.26a4,4,0,0,1-4-4V56.82a4,4,0,0,1,4-4H52.84V38.26a4,4,0,0,1,4-4h9.24a4,4,0,0,1,4,4V52.84H84.62a4,4,0,0,1,4,4Zm8.83-31.37a50.92,50.92,0,1,0,14.9,36,50.78,50.78,0,0,0-14.9-36Z"
    />
  </svg>
)

export const RenderPenSvg = ({ ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-6 w-6"
    x-tooltip="tooltip"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
    />
  </svg>
)

export const RenderTrashButtonSvg = ({ ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-trash2 h-4 w-4"
    {...props}
  >
    <path pointerEvents="none" d="M3 6h18"></path>
    <path pointerEvents="none" d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path pointerEvents="none" d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
    <line x1="10" x2="10" y1="11" y2="17"></line>
    <line x1="14" x2="14" y1="11" y2="17"></line>
  </svg>
)

/**
 * renders a delete svg
 * @param param onclick
 * @returns
 */
export const RenderDeleteButtonSVG = ({
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg {...props} x="0px" y="0px" viewBox="0 0 595.275 841.891">
    <g>
      <path
        className="fill-white"
        d="M326.039,513.568h-69.557v-9.441c0-10.531,2.12-19.876,6.358-28.034   c4.239-8.156,13.165-18.527,26.783-31.117l12.33-11.176c7.322-6.678,12.684-12.973,16.09-18.882   c3.4-5.907,5.105-11.817,5.105-17.727c0-8.99-3.084-16.022-9.248-21.098c-6.166-5.073-14.773-7.611-25.819-7.611   c-10.405,0-21.646,2.152-33.719,6.455c-12.075,4.305-24.663,10.693-37.765,19.171v-60.5c15.541-5.395,29.735-9.375,42.582-11.946   c12.843-2.568,25.241-3.854,37.186-3.854c31.342,0,55.232,6.392,71.678,19.171c16.439,12.783,24.662,31.439,24.662,55.973   c0,12.591-2.506,23.862-7.516,33.815c-5.008,9.956-13.553,20.649-25.625,32.08l-12.332,10.983   c-8.736,7.966-14.451,14.354-17.148,19.171s-4.045,10.115-4.045,15.896V513.568z M256.482,542.085h69.557v68.593h-69.557V542.085z"
      />
    </g>
    <circle className="fill-red-500" cx="299.76" cy="439.067" r="218.516" />
    <g>
      <rect
        x="267.162"
        y="307.978"
        transform="matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)"
        style={{ fill: '#FFFFFF ' }}
        width="65.545"
        height="262.18"
      />

      <rect
        x="266.988"
        y="308.153"
        transform="matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)"
        style={{ fill: '#FFFFFF' }}
        width="65.544"
        height="262.179"
      />
    </g>
  </svg>
)

/**
 * renders an edit button.
 * @param param onclick
 * @returns
 */
export const RenderEditButton = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      {...props} //note className is overwriting width/height vals
      viewBox="0 0 122.88 121.51"
    >
      <path
        pointerEvents={'none'}
        d="M28.66,1.64H58.88L44.46,16.71H28.66a13.52,13.52,0,0,0-9.59,4l0,0a13.52,13.52,0,0,0-4,9.59v76.14H91.21a13.5,13.5,0,0,0,9.59-4l0,0a13.5,13.5,0,0,0,4-9.59V77.3l15.07-15.74V92.85a28.6,28.6,0,0,1-8.41,20.22l0,.05a28.58,28.58,0,0,1-20.2,8.39H11.5a11.47,11.47,0,0,1-8.1-3.37l0,0A11.52,11.52,0,0,1,0,110V30.3A28.58,28.58,0,0,1,8.41,10.09L8.46,10a28.58,28.58,0,0,1,20.2-8.4ZM73,76.47l-29.42,6,4.25-31.31L73,76.47ZM57.13,41.68,96.3.91A2.74,2.74,0,0,1,99.69.38l22.48,21.76a2.39,2.39,0,0,1-.19,3.57L82.28,67,57.13,41.68Z"
      />
    </svg>
  )
}
