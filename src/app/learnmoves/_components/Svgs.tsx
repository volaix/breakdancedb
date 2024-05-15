/**
 *
 * Render a delete button
 * @returns jsx
 */
export const RenderRedDeleteButton = ({
  onClick,
  id,
}: {
  onClick?: React.MouseEventHandler<SVGSVGElement>
  id?: string
}) => {
  return (
    <svg
      id={id}
      className="dark:fill-gray-500"
      onClick={onClick}
      height="100%"
      width="100%"
      viewBox="0 0 496.158 496.158"
    >
      <path
        pointerEvents={'none'}
        fill="#E04F5F"
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
 * renders an add button. used for each position render.
 * @param param onclick
 * @returns
 */
export const RenderAddButton = ({
  onClick,
  id,
}: {
  onClick?: React.MouseEventHandler<SVGSVGElement>
  id?: string
}) => (
  <svg
    onClick={onClick}
    id={id}
    className="dark:fill-gray-500"
    height="100%"
    width="100%"
    viewBox="0 0 122.88 122.88"
  >
    <path
      pointerEvents={'none'}
      d="M61.44,0A61.46,61.46,0,1,1,18,18,61.25,61.25,0,0,1,61.44,0ZM88.6,56.82v9.24a4,4,0,0,1-4,4H70V84.62a4,4,0,0,1-4,4H56.82a4,4,0,0,1-4-4V70H38.26a4,4,0,0,1-4-4V56.82a4,4,0,0,1,4-4H52.84V38.26a4,4,0,0,1,4-4h9.24a4,4,0,0,1,4,4V52.84H84.62a4,4,0,0,1,4,4Zm8.83-31.37a50.92,50.92,0,1,0,14.9,36,50.78,50.78,0,0,0-14.9-36Z"
    />
  </svg>
)

/**
 * renders an edit button.
 * @param param onclick
 * @returns
 */
export const RenderEditButton = ({
  onClick,
}: {
  onClick?: React.MouseEventHandler<SVGSVGElement>
}) => {
  return (
    <svg
      className="dark:fill-gray-500"
      onClick={onClick}
      width="100%"
      height="100%"
      viewBox="0 0 122.88 121.51"
    >
      <path
        pointerEvents={'none'}
        d="M28.66,1.64H58.88L44.46,16.71H28.66a13.52,13.52,0,0,0-9.59,4l0,0a13.52,13.52,0,0,0-4,9.59v76.14H91.21a13.5,13.5,0,0,0,9.59-4l0,0a13.5,13.5,0,0,0,4-9.59V77.3l15.07-15.74V92.85a28.6,28.6,0,0,1-8.41,20.22l0,.05a28.58,28.58,0,0,1-20.2,8.39H11.5a11.47,11.47,0,0,1-8.1-3.37l0,0A11.52,11.52,0,0,1,0,110V30.3A28.58,28.58,0,0,1,8.41,10.09L8.46,10a28.58,28.58,0,0,1,20.2-8.4ZM73,76.47l-29.42,6,4.25-31.31L73,76.47ZM57.13,41.68,96.3.91A2.74,2.74,0,0,1,99.69.38l22.48,21.76a2.39,2.39,0,0,1-.19,3.57L82.28,67,57.13,41.68Z"
      />
    </svg>
  )
}
