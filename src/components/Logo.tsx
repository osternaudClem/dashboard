'use client';

import Image from 'next/image';
import { useMemo } from 'react';

import { useTheme } from 'next-themes';

const IMAGES_PATH = {
  dark: '/img/logo-inline-dark.png',
  light: '/img/logo-inline-light.png',
  darkVertical: '/img/logo-vertical-dark.png',
  lightVertical: '/img/logo-vertical-light.png',
  darkIcon: '/img/logo-icon-dark.png',
  lightIcon: '/img/logo-icon-light.png',
};

type Props = {
  className?: string;
  isIcon?: boolean;
  vertical?: boolean;
};

const Logo = ({ className = '', isIcon = false, vertical = false }: Props) => {
  const { theme, systemTheme } = useTheme();

  const logoPath = useMemo(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme;

    if (isIcon) {
      return currentTheme === 'dark' ? IMAGES_PATH.darkIcon : IMAGES_PATH.lightIcon;
    }

    if (vertical) {
      return currentTheme === 'dark' ? IMAGES_PATH.darkVertical : IMAGES_PATH.lightVertical;
    }

    return currentTheme === 'dark' ? IMAGES_PATH.dark : IMAGES_PATH.light;
  }, [isIcon, systemTheme, theme, vertical]);

  return (
    <Image src={logoPath} alt="Logo" width={200} height={303} priority className={className} />
  );
};

export default Logo;
