import genericAvatarSvg from '@/assets/icons/generic-avatar.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';

type GenericAvatarProps = {
    size?: number;
    imageUrl?: string | null;
};

export function GenericAvatar({ size = 34, imageUrl }: GenericAvatarProps) {
    if (imageUrl) {
        return (
            <img
                src={imageUrl}
                alt="프로필 이미지"
                className="block rounded-full object-cover"
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <InlineSvgIcon
            svg={genericAvatarSvg}
            label="기본 프로필 이미지"
            className="block overflow-hidden rounded-full"
            style={{ width: size, height: size }}
        />
    );
}
