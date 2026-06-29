import helpSvg from '@/assets/icons/help-icon.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';

type HelpBadgeProps = {
  size?: number;
};

const HelpBadge = ({ size = 15 }: HelpBadgeProps) => {
  return (
      <InlineSvgIcon
          svg={helpSvg}
          label="도움말"
          className="ml-auto object-contain"
          style={{ width: size, height: size }}
      />
  );
};

export { HelpBadge };
