import Link from 'next/link';
import { LogoIcon, LogoWords } from '../icons/Logo';

export const LogoMark = () => {
  return (
    <Link href="/">
      <div className="flex items-end gap-x-1 text-link">
        <LogoIcon size={28} />
        <LogoWords size={70} />
      </div>
    </Link>
  );
};
