'use client'
/**
 * renders an add button. used for each position render.
 * @param param onclick
 * @returns
 */
export const RenderAddButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<SVGSVGElement>
}) => (
  <svg
    onClick={onClick}
    className="stroke-indigo-400"
    height="20px"
    width="20px"
    viewBox="0 0 122.88 122.88"
  >
    <path d="M61.44,0A61.46,61.46,0,1,1,18,18,61.25,61.25,0,0,1,61.44,0ZM88.6,56.82v9.24a4,4,0,0,1-4,4H70V84.62a4,4,0,0,1-4,4H56.82a4,4,0,0,1-4-4V70H38.26a4,4,0,0,1-4-4V56.82a4,4,0,0,1,4-4H52.84V38.26a4,4,0,0,1,4-4h9.24a4,4,0,0,1,4,4V52.84H84.62a4,4,0,0,1,4,4Zm8.83-31.37a50.92,50.92,0,1,0,14.9,36,50.78,50.78,0,0,0-14.9-36Z" />
  </svg>

)
