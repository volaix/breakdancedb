export const Notification = ({
  message,
  visible,
  className,
}: {
  message: string
  visible: boolean
  className?: string
}) => {
  return (
    <section
      className={`transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {visible && (
        <div className="rounded bg-blue-500 p-4 text-white">{message}</div>
      )}
    </section>
  )
}
