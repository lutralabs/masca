'use client';

import { useState, useEffect } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Switch } from '@/components/ui/switch';

import Image from 'next/image';

import clsx from 'clsx';
import NetworkDropdownMenuItem from './NetworkDropdownMenuItem';
import { ChevronDownIcon } from 'lucide-react';

import type { Network } from '@/utils/networks';
import { useToastStore } from '@/stores';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

interface DropdownMenuProps {
  items: Network[];
  multiple?: boolean;
  selected: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'primary-active'
    | 'secondary-active'
    | 'gray'
    | 'method';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'method';
  rounded?: 'full' | '2xl' | 'xl' | 'lg' | 'none';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' | 'inner' | '';
  setSelected: (selected: string) => void;
}

const sizes: Record<string, string> = {
  xs: 'md:text-sm md:py-1 md:px-3 text-sm py-1 px-2 max-w-xs',
  sm: 'md:text-md md:py-1.5 md:px-3.5 text-md font-medium py-1 px-3 max-w-xs',
  md: 'lg:text-lg lg:py-2 lg:px-4 md:text-md font-medium md:py-1.5 md:px-3.5 text-sm py-1 px-3 max-w-xs',
  lg: 'lg:text-2xl lg:py-2.5 lg:px-5 md:text-lg md:py-2 font-medium md:px-4 text-md py-1.5 px-3.5 max-w-xs font-semibold max-w-xs',
  method:
    'text-h5 font-ubuntu animated-transition inline-flex w-full justify-center rounded-3xl px-4 py-2 font-thin focus:outline-none',
};

const variants: Record<string, string> = {
  primary:
    'bg-pink-500 dark:bg-orange-accent-dark hover:opacity-80 text-white dark:text-navy-blue-800 animated-transition ',
  secondary:
    'text-pink-500 border-[0.135rem] border-pink-500 dark:text-orange-accent-dark dark:border-orange-accent-dark animated-transition ',
  'primary-active':
    'text-pink-500 border-[0.135rem] border-pink-500 dark:text-orange-accent-dark dark:border-orange-accent-dark animated-transition ',
  'secondary-active':
    'text-navy-blue-500 border border-1 border-navy-blue-300 animated-transition ',
  gray: 'bg-gray-200 text-gray-800 btn hover:opacity-80 animated-transition ',
  method:
    'dark:text-navy-blue-400 text-gray-600 dark:hover:bg-navy-blue-800 hover:bg-orange-100/50',
};

const variantsHover: Record<string, string> = {
  primary: 'bg-pink-500 dark:bg-orange-accent-dark opacity-80',
  secondary: 'bg-navy-blue-500 text-white btn hover:opacity-80 ',
  'primary-active': ' ',
  'secondary-active': ' ',
  gray: 'opacity-80',
  method: 'dark:bg-navy-blue-800 bg-orange-100/50',
};

function isSelectedTestnet(selected: string, items: Network[]): boolean {
  return items.find((item) => item.name === selected)?.isTestnet === true;
}

export default function NetworkDropDownMenu({
  items,
  selected,
  setSelected,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  shadow = 'sm',
}: DropdownMenuProps) {
  const t = useTranslations('NavConnection');
  const { resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const [showTestNets, setShowTestNets] = useState(false);

  const filteredNetworks = items.filter(
    (item) => showTestNets || !item.isTestnet
  );

  const networkBackgroundColor =
    resolvedTheme === 'dark'
      ? '#ffffffbf'
      : items.find((item) => item.name === selected)?.backgroundColor;

  useEffect(() => {
    const isTestnet = isSelectedTestnet(selected, items);
    setShowTestNets(isTestnet);
  }, [selected]);

  return (
    <DropdownMenu onOpenChange={() => setOpen(!open)}>
      <DropdownMenuTrigger
        className={clsx(
          'animated-transition flex items-center justify-center focus:outline-none hover:bg-white/50',
          variants[variant],
          sizes[size],
          `rounded-${rounded}`,
          `shadow-${shadow}`,
          'ring-none outline-none',
          open ? variantsHover[variant] : ''
        )}
      >
        <div className="flex items-center justify-center">
          {selected && (
            <Image
              src={items.find((item) => item.name === selected)?.logo ?? ''}
              alt={selected}
              style={{
                width: '100%',
                height: 'auto',
                backgroundColor: networkBackgroundColor,
                borderRadius: '25%',
              }}
              width={16}
              height={16}
            />
          )}
          <div>
            {selected && (
              <ChevronDownIcon
                className={`animated-transition h-5 w-5 ml-2 ${
                  open ? 'rotate-180 ' : ''
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="dark:bg-navy-blue-600 mt-1 w-48 rounded-3xl bg-white shadow-lg focus:outline-none border-none p-1">
        <div className="p-1">
          {filteredNetworks.map((item) => (
            <NetworkDropdownMenuItem
              key={item.name}
              network={item}
              selected={selected === item.name}
              handleBtn={setSelected}
              variant={variant}
            />
          ))}
        </div>

        <DropdownMenuSeparator className="bg-gray-900" />

        <div className="flex items-center justify-around p-1">
          <span className="text-sm">Show testnets</span>
          <div className="flex items-center justify-center">
            <Switch
              checked={showTestNets}
              onCheckedChange={() => {
                if (isSelectedTestnet(selected, items)) {
                  setTimeout(() => {
                    useToastStore.setState({
                      open: true,
                      title: t('disable-testnet-switch'),
                      type: 'error',
                      loading: false,
                      link: null,
                    });
                  });
                } else {
                  setShowTestNets(!showTestNets);
                }
              }}
              className={clsx(
                showTestNets ? 'bg-red-500 dark:bg-orange-accent-dark' : '',
                'scale-80'
              )}
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
