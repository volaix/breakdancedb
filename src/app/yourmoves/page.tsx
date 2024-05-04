'use client'
import Header from '@/app/Header'

const YourMoves = () => {
 //TODO Load localstorage and populate
 const onClickSave = () => {
  //TODO Update localstorage
  //TODO Change text to save
 }
 const onClickExport = () => {
  //TODO Export localstorage
  //TODO Change text to exported
 }
  return (
    <div >
      <section class="text-gray-600 body-font relative">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-col text-center w-full mb-6">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
             Your Moves
            </h1>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
             Add and view everything here. One per line.
            </p>
          </div>
          <div class="lg:w-1/2 md:w-2/3 mx-auto">
            <div class="flex flex-wrap -m-2">
              
              
              <div class="p-2 w-full">
                <div class="relative">
                  <label for="message" class="leading-7 text-sm text-gray-600">
                   Your Moves
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    jf-ext-cache-id="35"></textarea>
                   <div className="text-xs">New move created for each line. No spaces please.</div>
                </div>
              </div>
              <div class="p-2 w-full flex">
                <button
                 onClick={onClickSave}
                  class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  jf-ext-button-ct="button">
                  Save
                </button>
                <button
                 onClick={onClickExport}
                  class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  jf-ext-button-ct="button">
                  Export
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
const Page = () => {
  return (
    <>
      <Header />
      <YourMoves />
    </>
  )
}
export default Page
