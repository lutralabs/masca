'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ToggleTheme = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      className={clsx(
        'animated-transition dark:hover:bg-navy-blue-800 p-1 dark:text-navy-blue-400 ml-2 flex h-[36px] w-[36px] items-center justify-center rounded-full hover:bg-orange-100 lg:h-[32px] lg:w-[32px]',
        'outline-none focus-visible:outline-none',
        resolvedTheme === 'dark' ? 'text-white/50' : 'text-black/50'
      )}
      onClick={toggleTheme}
    >
      {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default ToggleTheme;
