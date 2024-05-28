import { ChangeEventHandler } from 'react'

export default function RenderThunder({
  checked,
  size,
  onChange,
  id,
}: {
  id?: string
  size?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  checked?: boolean
}) {
  return (
    <>
      <input
        onChange={onChange}
        checked={checked}
        type="radio"
        id={id}
        className="peer -ms-5 size-4 cursor-pointer
                     appearance-none border-0 bg-transparent
                      text-transparent checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
      />
      <label
        className="pointer-events-none text-gray-300 
            peer-checked:text-yellow-400"
      >
        <svg
          className={`
           ${size || 'size-4'}
           flex-shrink-0`}
          fill="currentColor"
          viewBox="0 0 560.317 560.316"
        >
          <g>
            <g>
              <path d="M207.523,560.316c0,0,194.42-421.925,194.444-421.986l10.79-23.997c-41.824,12.02-135.271,34.902-135.57,35.833    C286.96,122.816,329.017,0,330.829,0c-39.976,0-79.952,0-119.927,0l-12.167,57.938l-51.176,209.995l135.191-36.806    L207.523,560.316z" />
            </g>
          </g>
        </svg>
      </label>
    </>
  )
}
