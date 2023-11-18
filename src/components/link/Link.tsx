export default function Link({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        import.meta.env.MODE === 'production' ? chrome.tabs.create({ url: href, active: false }) : open(href, "_blank")
    };
    return <a href={href} {...props}
        target="_blank"
        onClick={handleClick}
        onAuxClick={handleClick}
    >{children}</a>
}
