import Link from 'next/link';
// import { LogoIcon, LogoWords } from '../icons/Logo';

export const LogoMark = () => {
  return (
    <Link href="/">
      <div className="flex items-end gap-x-1 text-link font-semibold text-2xl">
        {/* <LogoIcon size={28} />
        <LogoWords size={70} /> */}
        Leadmark
      </div>
    </Link>
  );
};
