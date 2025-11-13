export default function Apostrophe({ className = "" }: { className?: string }) {
  return <span className={"font-['Montserrat'] " + className}>&apos;</span>;
}
