type InlineSvgIconProps = {
    svg: string;
    className?: string;
    label?: string;
    style?: React.CSSProperties;
};

export function InlineSvgIcon({ svg, className = '', label, style }: InlineSvgIconProps) {
    return (
        <span
            aria-hidden={label ? undefined : true}
            aria-label={label}
            role={label ? 'img' : undefined}
            className={`inline-flex shrink-0 items-center justify-center [&>svg]:block [&>svg]:h-full [&>svg]:w-full ${className}`}
            style={style}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
