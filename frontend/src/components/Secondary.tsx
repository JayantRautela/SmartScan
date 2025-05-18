import Card from "./Card"

const Secondary = () => {
  return (
    <div className="w-full min-h-screen px-4 py-10">
      <section className="max-w-5xl mx-auto text-center sm:text-left mt-10 sm:mt-20 px-4">
        <h1 className="text-2xl sm:text-4xl font-semibold leading-tight">
          Transform Your Resume To <br className="hidden sm:block" /> The Next Level
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground">
          Submitting your resume is the first step towards <br className="hidden sm:block" /> a strong career
        </p>
      </section>

      <section className="w-full flex flex-col sm:flex-row flex-wrap items-center justify-center mt-10 gap-6 px-4">
        <Card
          heading="Upload Your Resume"
          content="Simply upload your resume to get started"
          height="h-72 sm:h-80"
          width="w-full sm:w-72 md:w-80"
          padding="p-6"
          fontColor="text-white"
          backgroundColor="bg-black"
        />
        <Card
          heading="Receive Instant Skill Extraction and Feedback"
          content="Our AI analyzes your resume and offers suggestions"
          height="h-72 sm:h-80"
          width="w-full sm:w-72 md:w-80"
          padding="p-6"
          fontColor="text-black"
          backgroundColor="bg-[#b1b3c5]"
        />
        <Card
          heading="Track Progress"
          content="Keep improving with progress tracking and tips"
          height="h-72 sm:h-80"
          width="w-full sm:w-72 md:w-80"
          padding="p-6"
          fontColor="text-black"
          backgroundColor="bg-[#a7d4df]"
        />
      </section>
    </div>
  )
}

export default Secondary