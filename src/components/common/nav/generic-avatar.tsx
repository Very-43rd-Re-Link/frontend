import genericAvatarSvg from '@/assets/icons/generic-avatar.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';

type GenericAvatarProps = {
    size?: number;
};

export function GenericAvatar({ size = 34 }: GenericAvatarProps) {
    return (
        <InlineSvgIcon
            svg={genericAvatarSvg}
            label="기본 프로필 이미지"
            className="block overflow-hidden rounded-full"
            style={{ width: size, height: size }}
        />
    );
}
