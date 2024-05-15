import Image from "next/image"

export default function RenderHero() {
    return (<section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 pt-24 md:flex-row flex-col items-center">
            <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                {/* TODO make title component. fixes light dark additions all the time*/}
                <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                
                BreakdanceDB
                </h1>
                <br className="hidden lg:inline-block" />
                <p className="mb-8 leading-relaxed"> Ditch the scrapbook.  Record your footworks, practice systematically, flow in the cypher.  Remember sets.  Welcome to your new breakdance database for footwork.
                </p>
                <div className="flex justify-center">
                    <button className="text-xs inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                        Add Footworks
                    </button>
                    <button className="text-xs ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
                        RNG Flows
                    </button>
                </div>
            </div>
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                <Image
                    className="object-cover object-center rounded"
                    alt="hero"
                    width={720}
                    height={600}
                    src="https://dummyimage.com/720x600" />
            </div>
        </div>
    </section>)
}