import RenderButtonTest from './RenderButtonTest'
import RenderHero from './RenderHero'
import RenderTree from './RenderTree'
import { connectedToMongo } from './_utils/actions'

const RenderHome = ({ isConnected }: { isConnected: boolean }) => {
  // const isConnected = serverConnected.then((res) => res.props.isConnected)
  return (
    <div className="flex flex-col items-center">
      <RenderHero />
      {isConnected ? (
        <div>Connected to MongoDB</div>
      ) : (
        <div>Not Connected to MongoDB</div>
      )}
      <RenderButtonTest />
      <RenderTree />
    </div>
  )
}

export default async function RenderHomePage() {
  //todo have loading state
  const isConnected = await connectedToMongo().then(
    (res) => res.props.isConnected,
  )
  return <RenderHome isConnected={isConnected} />
}
