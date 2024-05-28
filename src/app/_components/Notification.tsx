'use client'
interface NotificationProps {
  message: string
  visible: boolean
}
export const Notification: React.FC<NotificationProps> = ({
  message,
  visible,
}) => {
  return (
    <div
      className={`transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {visible && (
        <div className="rounded bg-blue-500 p-4 text-white">{message}</div>
      )}
    </div>
  )
}
