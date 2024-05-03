import Header from '@/app/Header' 
const Completed = () => {
 //get flows from localstorage
 return (
  <div className='mt-20 bg-white dark:bg-slate-800	'>
  <h1>Flows</h1>
  <div>test</div>
  <h1>Transitions</h1>
  <h1>Summary</h1>
  <h1>Combos</h1>
 </div>
 )
}
const Page = () => {
 return <div>
  <Header/>
  <Completed/>
 </div>
}
export default Page
