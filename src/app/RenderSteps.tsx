import Link from 'next/link'
import React from 'react'

const steps = [
  {
    stepNumber: 1,
    stepTitle: 'STEP 1',
    stepDescription: 'Learn to dance with your moves.',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-5 w-5"
        viewBox="0 0 24 24"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
  },
  {
    stepNumber: 2,
    stepTitle: 'STEP 2',
    stepDescription: 'Transitions',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-5 w-5"
        viewBox="0 0 24 24"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
      </svg>
    ),
  },
  {
    stepNumber: 3,
    stepTitle: 'STEP 3',
    stepDescription: 'Flows: make entry key moves exit moves',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-5 w-5"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="5" r="3"></circle>
        <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
      </svg>
    ),
  },
  {
    stepNumber: 4,
    stepTitle: 'STEP 4',
    stepDescription:
      'Using the previous flow ratings, make combos and routines.',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-5 w-5"
        viewBox="0 0 24 24"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
  },
  {
    stepNumber: 5,
    stepTitle: 'STEP 5',
    stepDescription:
      'Time out your performance using your combos. Organise the rounds for your next battle!',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-5 w-5"
        viewBox="0 0 24 24"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
      </svg>
    ),
  },
  {
    stepNumber: 'FINISH',
    stepTitle: 'FINISH',
    stepDescription:
      'Enter the cypher and think of dancing with your move. Dancing with your transition. Dancing with the flow. Or dancing with the combo. You will likely find yourself dancing.',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-5 w-5"
        viewBox="0 0 24 24"
      >
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
        <path d="M22 4L12 14.01l-3-3"></path>
      </svg>
    ),
  },
]
export default function RenderSteps() {
  return (
    <section className="body-font text-gray-600">
      <div className="container flex flex-wrap px-5 pb-24 pt-5">
        <div className="flex w-full flex-col flex-wrap content-center justify-center">
          <div className="text-xs md:w-1/2 md:py-6 md:pr-10 lg:w-2/5">
            {steps.map((step) => {
              return (
                <div className="relative flex pb-12" key={step.stepNumber}>
                  <div className="absolute inset-0 flex h-full w-10 items-center justify-center">
                    <div className="pointer-events-none h-full w-1 bg-gray-200"></div>
                  </div>
                  <div className="relative inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                    {step.icon}
                  </div>
                  <div className="flex-grow pl-4">
                    <h2 className="title-font mb-1 text-sm font-medium tracking-wider text-gray-900">
                      {step.stepTitle}
                    </h2>
                    <p className="leading-relaxed">{step.stepDescription}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <Link href={{ pathname: '/learnmoves' }}>
            <button
              className="rounded border-0 
            bg-indigo-500 px-6 py-2 text-xs 
            text-white hover:bg-indigo-600 focus:outline-none"
            >
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
