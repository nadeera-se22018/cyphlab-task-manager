import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-6 border-t border-amber-500/10 text-center text-xs text-slate-500">
      <p>
        <Link
          href="https://kasun-nadeera.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-slate-300 hover:text-amber-400 hover:underline transition-colors"
        >
          Kasun Nadeera
        </Link>{' '}
        @ 2026 All Right Reserved
      </p>
    </footer>
  );
}
