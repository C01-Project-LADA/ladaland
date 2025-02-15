export default function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-[20px]">
      <div className="flex-1 h-[2px] bg-gray-300" />
      <div>
        <h2 className="text-gray-500 font-semibold text-lg text-center">
          {title}
        </h2>
        <h3 className="text-gray-500 text-xs text-center">{subtitle}</h3>
      </div>
      <div className="flex-1 h-[2px] bg-gray-300" />
    </div>
  );
}
