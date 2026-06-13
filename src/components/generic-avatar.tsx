import genericAvatarIcon from '../../assets/icons/generic-avatar.svg';

type GenericAvatarProps = {
    size?: number;
};

export function GenericAvatar({ size = 34 }: GenericAvatarProps) {
    return (
        <img
            src={genericAvatarIcon}
            alt="기본 프로필 이미지"
            className="block overflow-hidden rounded-full"
            style={{ width: size, height: size }}
        />
    );
}
