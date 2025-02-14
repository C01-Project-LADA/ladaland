export default function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-[20px]">
      <div className="flex-1 h-[2px] bg-gray-300" />
      <h2 className="text-gray-500 font-semibold text-lg">{title}</h2>
      <div className="flex-1 h-[2px] bg-gray-300" />
    </div>
  );
}
