import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

interface MenuSectionProps {
  title: string;
  expanded: boolean;
  toggleExpanded: () => void;
  children: React.ReactNode;
  isCollapsed: boolean;
}

const MenuSection = ({ title, expanded, toggleExpanded, children, isCollapsed }: MenuSectionProps) => {
  if (isCollapsed) return <>{children}</>;

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between px-4 py-2 cursor-pointer" onClick={toggleExpanded}>
        <h3 className="text-gray-700 font-medium text-sm uppercase tracking-wider">{title}</h3>
        {expanded ? <IoChevronUpOutline className="w-4 h-4 text-gray-500" /> : <IoChevronDownOutline className="w-4 h-4 text-gray-500" />}
      </div>
      {expanded && <div className="mt-1">{children}</div>}
    </div>
  );
};

export default MenuSection;
