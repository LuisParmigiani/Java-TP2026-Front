interface Prop {
  miniTitle: string;
  title: string;
  description: string;
  svg?: React.ReactNode;
  cardColor: string;
  size: string;
  titleColor?: string;
  descriptionColor?: string;
}
const cardColors: Record<string, string> = {
  black: "bg-black text-white",
  white: "bg-white text-black",
  red: "bg-red-100 text-red-800",
  primary: "bg-primary text-primary",
  primaryLight: "bg-primary/90 text-primary",
  secondary: "bg-secondary text-secondary",
  gray: "bg-gray-100 text-gray-800",
  greenCard: "bg-emerald-500 text-white",
  yellowCard: "bg-tertiary text-white",
  redCard: "bg-red-500 text-white",
};

const titleColors = {
  black: "text-black",
  gray: "text-gray-800",
  white: "text-white",
  red: "text-red-800",
  primary: "text-primary",
  secondary: "text-secondary",
  green: "text-green-600",
};

const descriptionColors = {
  black: "text-gray-300",
  gray: "text-gray-600",
  white: "text-white/80",
  red: "text-red-600",
  primary: "text-primary/80",
  secondary: "text-secondary/80",
};

const size = {
  sm: "h-24",
  md: "h-32",
  lg: "h-48",
};
export default function InformationCard(prop: Prop) {
  return (
    <div
      className={`w-full h-full justify-center ${cardColors[prop.cardColor]}  flex flex-col gap-2 rounded-lg p-4 size-${size[prop.size]} border-1 border-${cardColors[prop.cardColor]} shadow-sm`}
    >
      <div className="flex flex-row  items-center justify-between">
        <p className={`text-md ${titleColors[prop.descriptionColor]}`}>
          {prop.miniTitle}
        </p>
        {prop.svg && (
          <div className="w-1/8 bg-primary/10 rounded-full p-2 flex items-center justify-center">
            {prop.svg}
          </div>
        )}
      </div>

      <h3 className={`text-4xl font-bold m-3 ${titleColors[prop.titleColor]}`}>
        {prop.title}
      </h3>
      <p className={`text-sm mt-2 ${descriptionColors[prop.descriptionColor]}`}>
        {prop.description}
      </p>
    </div>
  );
}
