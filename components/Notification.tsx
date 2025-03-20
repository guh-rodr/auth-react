const styles = {
  'error': 'bg-red-800 text-red-300',
  'success': 'bg-green-800 text-green-300'
}

interface Props {
  type: keyof typeof styles;
  children: React.ReactNode;
}

export function Notification({ type, children }: Props) {
  const style = styles[type]

  return (
    <div className={`w-full p-3 mb-2 text-sm text-center bg-opacity-30 rounded-xl ${style}`}>
      {children}
    </div>
  )
}