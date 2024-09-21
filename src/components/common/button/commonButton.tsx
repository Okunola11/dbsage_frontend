import { ReactNode, FC, cloneElement, ReactElement } from "react";
import { Plus, LoaderCircle } from "lucide-react";
import Link from "next/link";

import { Button, ButtonProps } from ".";

interface ButtonProperties extends ButtonProps {
  /** Icon to be displayed inside the button */
  icon?: ReactNode;
  /** Indicates if the button is in a loading state */
  isLoading?: boolean;
  /** Indicates if the button is icon only */
  isIconOnly?: boolean;
  /** Indicates if the left icon is visible */
  isLeftIconVisible?: boolean;
  /** Indicates if the right icon is visible */
  isRightIconVisible?: boolean;
  /** Disables the button if true */
  isDisabled?: boolean;
  /** Accessibility label for the button */
  ariaLabel?: string;
  /** Href to link button to a URL or route */
  href?: string;
}

const CustomButton: FC<ButtonProperties> = ({
  type = "button",
  variant,
  size,
  children,
  icon,
  isLoading = false,
  isLeftIconVisible = false,
  isRightIconVisible = false,
  isDisabled = false,
  isIconOnly = false,
  ariaLabel,
  href,
  className,
  onClick,
}) => {
  const modifiedIcon = icon ? (
    cloneElement(icon as ReactElement, { className: "w-[1rem] h-[1rem]" })
  ) : (
    <Plus className="w-[1rem] h-[1rem]" />
  );

  const buttonContent = (
    <>
      {isLeftIconVisible && !isLoading && modifiedIcon}
      {isRightIconVisible && !isLoading && modifiedIcon}
      {isLoading && <LoaderCircle className="w-[1rem] h-[1rem] animate-spin" />}
      {isIconOnly && !isLoading && modifiedIcon}
      {!isIconOnly && children}
      {!isIconOnly && !children && isLoading && "Loading"}
    </>
  );

  if (href) {
    const isExternal = /^https?:\/\//.test(href);

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
        >
          <Button
            type={type}
            variant={variant}
            size={size}
            disabled={isDisabled}
            aria-label={ariaLabel}
            className={className}
            onClick={onClick}
            role="button"
          >
            {buttonContent}
          </Button>
        </a>
      );
    }

    return (
      <Link href={href} passHref aria-label={ariaLabel}>
        <Button
          variant={variant}
          size={size}
          disabled={isDisabled}
          aria-label={ariaLabel}
          className={className}
          onClick={onClick}
          role="button"
        >
          {buttonContent}
        </Button>
      </Link>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        disabled={isDisabled}
        aria-label={ariaLabel}
        className={className}
        onClick={onClick}
        role="button"
      >
        {buttonContent}
      </Button>
    </>
  );
};

export default CustomButton;
