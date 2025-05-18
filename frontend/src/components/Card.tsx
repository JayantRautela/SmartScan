interface Props {
  heading: string;
  content: string;
  backgroundColor: string;
  fontColor: string;
  height: string;
  width: string;
  padding: string;
}

const Card = (props: Props) => {
  return (
    <div className={`${props.width} ${props.padding} ${props.height} ${props.backgroundColor} rounded-2xl transition-all duration-300 hover:scale-105`}>
      <div className="rounded-full bg-white h-12 w-12 sm:h-14 sm:w-14 mx-auto"></div>
      <h1 className={`my-4 sm:my-6 text-base sm:text-lg md:text-xl font-semibold ${props.fontColor} text-center`}>
        {props.heading}
      </h1>
      <p className={`text-sm sm:text-base mt-6 sm:mt-10 md:mt-16 text-center ${props.fontColor}`}>
        {props.content}
      </p>
    </div>
  )
}

export default Card